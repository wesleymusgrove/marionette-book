/*global ContactManager:true, console:true*/
ContactManager.module("ContactsApp.List", function(List, ContactManager, Backbone, Marionette, $, _) {

  List.Controller = {
    listContacts: function() {
      var loadingView = new ContactManager.Common.Views.Loading();
      ContactManager.mainRegion.show(loadingView);
      
      var fetchingContacts = ContactManager.request("contact:entities");

      $.when(fetchingContacts).done(function(contacts) {
        var contactsListView = new List.Contacts({
          collection: contacts
        });
      
        contactsListView.on("itemview:contact:show", function(childView, model) {
          console.log("Received itemview:contact:show event on model: ", model);
          ContactManager.ContactsApp.trigger("contact:show", model.get("id"));
        });

        contactsListView.on("itemview:contact:edit", function(childView, model) {
          console.log("Receieved itemview:contact:edit event on model: ", model);
          var modalView = new ContactManager.ContactsApp.Edit.Contact({
            model: model,
            asModal: true
          });

          modalView.on("form:submit", function(data) {
            if(model.save(data)) {
              childView.render();
              ContactManager.dialogRegion.close();
              childView.flash("success");
            }
            else {
              modalView.triggerMethod("form:data:invalid", model.validationError);
            }
          });

          ContactManager.dialogRegion.show(modalView);
        });

        contactsListView.on("itemview:contact:delete", function(childView, model) {
          model.destroy();
        });

        contactsListView.on("itemview:contact:highlight", function(childView, model) {
          console.log("highlighting toggled on model: " + model);
        });

        ContactManager.mainRegion.show(contactsListView);
      });
    }
  };

});