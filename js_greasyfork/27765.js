// ==UserScript==
// @name         Login Manager
// @namespace    http://jonas.ninja
// @version      1.1.2
// @description  For the benefit of anyone who has too many accounts to remember
// @author       @_jnblog
// @match        *://ivan.dev.sentryone.com/myaccount/login*
// @match        *://dev.sentryone.com/myaccount/login*
// @match        *://qa.sentryone.com/myaccount/login*
// @match        *://stg.sentryone.com/myaccount/login*
// @match        *://www.sentryone.com/myaccount/login*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/27765/Login%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/27765/Login%20Manager.meta.js
// ==/UserScript==
/* jshint -W097 */
/* GM_addStyle, GM_getValue, GM_setValue */
/* jshint asi: true, multistr: true */

var version = 1
var $ = unsafeWindow.jQuery
var templates, css, crud, viewModel

defineConstants()
defineCrudModule()
defineViewModel()
_manageVersion()
init()



// event handlers:
$(document).on('click', '.ijg-Login-createModal-createButton', function(e) {
  /// validate info
  var potentialLoginItem = new LoginItem($('#ijg-Login-createModal-username').val(), $('#ijg-Login-createModal-password').val())

  if (!potentialLoginItem.validate()) {
    viewModel.createNewItem.errorMessage.show()
    return
  }

  // does it already exist in the list?
  if (crud.find(potentialLoginItem.username) !== null) {
    viewModel.createNewItem.errorMessage.show('This username has already been added')
    return
  }

  // success
  crud.saveItem(potentialLoginItem)
  viewModel.appendItem(potentialLoginItem).closeModal(this)
})
.on('click', '.ijg-Login-item', function(e) {
  if (e.target.classList.contains('ijg-Login-item-button')) {
    return
  }
  var loginItem = $(e.target).closest('.ijg-Login-item').data(crud._dataKeys.loginItem)
  $('#Email').val(loginItem.username)
  $('#Password').val(loginItem.password)
  $('#LoginButton, .js-myAccount-loginButton').click()
  return false
})
.on('click', '.ijg-Login-deleteModal-deleteButton', function(e) {
  console.log('delete')
  var loginItemToDelete = $(this).closest('.modal').data(crud._dataKeys.loginItem)
  crud.delete(loginItemToDelete)
  viewModel.clear().appendItems(crud.read()).closeModal(this)
})

$('#ijg-Login-deleteModal').on('show.bs.modal', function (event) {
  var loginItem = $(event.relatedTarget).closest('.ijg-Login-item').data(crud._dataKeys.loginItem)
  var modal = $(this)
  modal.data(crud._dataKeys.loginItem, loginItem)
    .find('.ijg-Login-deleteModal-username')
    .text(loginItem.username)
})
$('#ijg-Login-createModal').on('hidden.bs.modal', function(e) {
  $('#ijg-Login-createModal-username').val('')
  $('#ijg-Login-createModal-password').val('')
  $('.ijg-Login-createModal-errorContainer').text('')
})



function LoginItem (username, password) {
  username = username || ''
  password = password || ''
  this.username = username.trim();
  this.password = password.trim();
}
LoginItem.prototype.validate = function () {
  var valid = true;

  try {
    valid = valid && this.username !== undefined &&
      this.username.length > 0 &&
      this.password !== undefined &&
      this.password.length > 0
  } catch (e) {
    valid = false
  }
  return valid
}

function init() {
  /// Initial app load. Assume all necessary modules have been loaded.
  $('#top > .container, .l-pageSection > .container').prepend($(templates.root))
  viewModel.appendItems(crud.read())
  $('body').append($('<div class="bstrnstn">').append($(templates.createModal), $(templates.deleteModal)))
}

function defineViewModel () {
  viewModel = {
    clear: function () {
      $('.ijg-Login-items').empty()
      return this
    },
    appendItem: function (loginItem) {
      /// Takes a persisted LoginItem and creates/inserts a functional dom element in the list
      var $itemDom = $(templates.item)
      $itemDom.find('.ijg-Login-item')
        .data(crud._dataKeys.loginItem, loginItem)
        .find('.ijg-Login-item-username')
        .text(loginItem.username)
        .prop('title', loginItem.password)
      $('.ijg-Login-items').append($itemDom)
      return this
    },
    appendItems: function (loginItems) {
      /// Takes an array of LoginItems and appends them all, in sorted order
      if (!loginItems) {
        return this
      }

      loginItems.sort(function (itemA, itemB) {
        return (itemA.id - itemB.id)
      })
      loginItems.forEach(function (loginItem) {
        viewModel.appendItem(loginItem)
      })
      return this
    },
    createNewItem: {
      errorMessage: {
        show: function(message) {
          message = message || 'Invalid username and/or password'
          $('.ijg-Login-createModal-errorContainer').text(message).show()
        },
        hide: function() {
          $('.ijg-Login-createModal-errorContainer').hide()
        }
      }
    },
    closeModal: function(modalEl) {
      // we don't have access to the page's jQuery, which is extended with Bootstrap methods like `.modal('hide')`
      $(modalEl).closest('.modal').find('.close').click()
      return this
    }
  }
}

function defineCrudModule () {
  crud = {
    _storageKeys: {
      version: 'ijg-plugin-LoginManager-version',
      data: 'ijg-plugin-LoginManager-keys',
      nextId: 'ijg-plugin-LoginManager-nextId'
    },
    _dataKeys: {
      loginItem: 'loginItem'
    },
    saveItem: function (loginItemToSave) {
      /// Takes a possibly-persisted LoginItem and persists it, either updating or creating it.
      var items = crud.read()
      var updated = false
      // first, look for an identical match. Exists ? update : create
      items.forEach(function(item) {
        if (item.username === loginItemToSave.username) {
          console.info('updating...')
          item.password = loginItemToSave.password
          console.log(items)
        }
      })
      if (!updated) {
        console.info('creating...')
        items.push(loginItemToSave)
      }
      crud.saveItems(items)
    },
    saveItems: function(loginItems) {
      /// Completely overwrite the existing list with the given list of items.
      GM_setValue(crud._storageKeys.data, loginItems)
    },
    read: function () {
      /// returns an array of LoginItem
      return GM_getValue(crud._storageKeys.data, [])
    },
    delete: function (loginItem) {
      /// un-persists the loginItem
      var remainingItems = crud.read().filter(function(item) {
        return item.username !== loginItem.username
      })
      crud.saveItems(remainingItems)
      return this
    },
    find: function(username) {
      /// Returns a persisted LoginItem with the given username, or null if none is found.
      var found = crud.read().filter(function (item) {
        return item.username === username
      })
      return found.length > 0 ? found[0] : null
    }
  }
}

function defineConstants () {
  templates = {
    root: '\
<div class="ijg-Login-wrapper bstrnstn mbd">\
  <div class="row">\
    <div class="ijg-Login cloudStyleBox">\
      <ul  class="ijg-Login-items"></ul>\
      <div class="ijg-Login-settings">\
        <button class="ijg-Login-settings-create btn btn-primary" data-toggle="modal" data-target="#ijg-Login-createModal">Enter a New Login</button>\
      </div>\
    </div>\
  </div>\
</div>',
    item: '\
<li>\
  <a class="ijg-Login-item" href="#">\
    <div class="ijg-Login-item-username"></div>\
    <div class="ijg-u-floatRight">\
      <!--<button class="ijg-Login-item-button ijg-Login-item-modify btn btn-default" title="edit">\
        <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>\
      </button>-->\
      <button class="ijg-Login-item-button ijg-Login-item-delete btn btn-default" data-toggle="modal" data-target="#ijg-Login-deleteModal" title="delete" aria-label="Delete">\
        <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>\
      </button>\
    </div>\
  </a>\
</li>',
    createModal: '\
<div class="modal fade" id="ijg-Login-createModal" tabindex="-1" role="dialog" aria-labelledby="ijg-Login-createModal-Label">\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="ijg-Login-createModal-Label">New Login</h4>\
      </div>\
      <div class="modal-body">\
        <form class="form-inline">\
          <div class="form-group">\
            <label class="sr-only" for="ijg-Login-createModal-username">Username</label>\
            <input type="email" class="form-control" id="ijg-Login-createModal-username" placeholder="Email">\
          </div>\
          <div class="form-group">\
            <label class="sr-only" for="ijg-Login-createModal-password">Password</label>\
            <input type="password" class="form-control" id="ijg-Login-createModal-password" placeholder="Password">\
          </div>\
          <button type="button" class="ijg-Login-createModal-createButton btn btn-success">Create Login</button>\
        </form>\
        <div class="ijg-Login-createModal-errorContainer" style="display:none"></div>\
      </div>\
    </div>\
  </div>\
</div>\
',
    updateModal: '\
<div class="modal fade" id="ijg-Login-updateModal" tabindex="-1" role="dialog" aria-labelledby="ijg-Login-updateModal-Label">\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="ijg-Login-updateModal-Label">Update Login</h4>\
      </div>\
      <div class="modal-body">\
        <form class="form-inline">\
          <div class="form-group">\
            <label class="sr-only" for="ijg-Login-updateModal-username">Username</label>\
            <input type="email" class="form-control" id="ijg-Login-updateModal-username" placeholder="Email">\
          </div>\
          <div class="form-group">\
            <label class="sr-only" for="ijg-Login-updateModal-password">Password</label>\
            <input type="password" class="form-control" id="ijg-Login-updateModal-password" placeholder="Password">\
          </div>\
          <button type="button" class="ijg-Login-updateModal-createButton btn btn-success">Update Login</button>\
        </form>\
        <div class="ijg-Login-updateModal-errorContainer" style="display:none"></div>\
      </div>\
    </div>\
  </div>\
</div>\
',
    deleteModal: '\
<div class="modal fade" id="ijg-Login-deleteModal" tabindex="-1" role="dialog" aria-labelledby="ijg-Login-deleteModal-Label">\
  <div class="modal-dialog" role="document">\
    <div class="modal-content">\
      <div class="modal-header">\
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
        <h4 class="modal-title" id="ijg-Login-deleteModal-Label">New Login</h4>\
      </div>\
      <div class="modal-body">\
        <p>Are you sure you want to delete <span class="ijg-Login-deleteModal-username">bob</span>?</p>\
        <div class="clearfix">\
          <div class="pull-left">\
            <button type="button" class="ijg-Login-deleteModal-deleteButton btn btn-error">Yes, delete</button>\
          </div>\
          <div class="pull-right">\
            <button type="button" class="btn btn-default" data-dismiss="modal">No, cancel</button>\
          </div>\
        </div>\
      </div>\
    </div>\
  </div>\
</div>\
'
  }

  componentsCSS = '\
.ijg-Login {\
    width: 400px;\
    margin: 0 auto;\
}\
.ijg-Login-items {\
  list-style: none;\
  margin: 0;\
}\
.ijg-Login-items > li {\
  padding-bottom: 5px;\
}\
.ijg-Login-item {\
  display: block;\
  padding-top: 0.1em;\
  padding-right: .3em;\
  padding-bottom: 0.55em;\
  padding-left: .3em;\
}\
.ijg-Login-item-button.btn {\
  line-height: 1;\
  font-size: 1em;\
}\
.ijg-Login-item-button > .glyphicon {\
  pointer-events: none;\
}\
.ijg-Login-item:hover {\
  background-color: #d9edf7;\
}\
.ijg-Login-item-username {\
  padding-top: .4em;\
  display: inline-block;\
}\
'
  utilitiesCSS = '\
.ijg-u-floatLeft {\
  float: left;\
}\
.ijg-u-floatRight {\
  float: right;\
}\
'

  GM_addStyle(componentsCSS)
  GM_addStyle(utilitiesCSS)
}

function _manageVersion () {
  /// If the format of the data changes, this function will perform necessary maintenance
  /// such as updating existing data.
  var lastLoadedVersion = GM_getValue(crud._storageKeys.version)
  if (lastLoadedVersion === undefined) {
    // first run
    GM_setValue(crud._storageKeys.version, version)
  }
}
