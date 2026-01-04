// ==UserScript==
// @name         Chatango User Mute
// @namespace    http://tampermonkey.net/
// @version      2024-07-07
// @description  Block messages from users you don't want to see
// @author       sillycritter (silly@ifyouevenca.re)
// @match        https://st.chatango.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatango.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/499889/Chatango%20User%20Mute.user.js
// @updateURL https://update.greasyfork.org/scripts/499889/Chatango%20User%20Mute.meta.js
// ==/UserScript==
var wsHook = {};
(function () {
  // Mutable MessageEvent.
  // Subclasses MessageEvent and makes data, origin and other MessageEvent properites mutatble.
  function MutableMessageEvent (o) {
    this.bubbles = o.bubbles || false
    this.cancelBubble = o.cancelBubble || false
    this.cancelable = o.cancelable || false
    this.currentTarget = o.currentTarget || null
    this.data = o.data || null
    this.defaultPrevented = o.defaultPrevented || false
    this.eventPhase = o.eventPhase || 0
    this.lastEventId = o.lastEventId || ''
    this.origin = o.origin || ''
    this.path = o.path || new Array(0)
    this.ports = o.parts || new Array(0)
    this.returnValue = o.returnValue || true
    this.source = o.source || null
    this.srcElement = o.srcElement || null
    this.target = o.target || null
    this.timeStamp = o.timeStamp || null
    this.type = o.type || 'message'
    this.__proto__ = o.__proto__ || MessageEvent.__proto__
  }

  var before = wsHook.before = function (data, url, wsObject) {
    return data
  }
  var after = wsHook.after = function (e, url, wsObject) {
    return e
  }
  var modifyUrl = wsHook.modifyUrl = function(url) {
    return url
  }
  wsHook.resetHooks = function () {
    wsHook.before = before
    wsHook.after = after
    wsHook.modifyUrl = modifyUrl
  }

  var _WS = WebSocket
  WebSocket = function (url, protocols) {
    var WSObject
    url = wsHook.modifyUrl(url) || url
    this.url = url
    this.protocols = protocols
    if (!this.protocols) { WSObject = new _WS(url) } else { WSObject = new _WS(url, protocols) }

    var _send = WSObject.send
    WSObject.send = function (data) {
      arguments[0] = wsHook.before(data, WSObject.url, WSObject) || data
      _send.apply(this, arguments)
    }

    // Events needs to be proxied and bubbled down.
    WSObject._addEventListener = WSObject.addEventListener
    WSObject.addEventListener = function () {
      var eventThis = this
      // if eventName is 'message'
      if (arguments[0] === 'message') {
        arguments[1] = (function (userFunc) {
          return function instrumentAddEventListener () {
            arguments[0] = wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject)
            if (arguments[0] === null) return
            userFunc.apply(eventThis, arguments)
          }
        })(arguments[1])
      }
      return WSObject._addEventListener.apply(this, arguments)
    }

    Object.defineProperty(WSObject, 'onmessage', {
      'set': function () {
        var eventThis = this
        var userFunc = arguments[0]
        var onMessageHandler = function () {
          arguments[0] = wsHook.after(new MutableMessageEvent(arguments[0]), WSObject.url, WSObject)
          if (arguments[0] === null) return
          userFunc.apply(eventThis, arguments)
        }
        WSObject._addEventListener.apply(this, ['message', onMessageHandler, false])
      }
    })

    return WSObject
  }
})()

function addUser(event) {
    var username_field = document.getElementById("inputuser");
    var users = getUsers();
    users.push(username_field.value);
    updateUsers(users);
}

function removeUser(event) {
    var users = getUsers();
    var index = users.indexOf(event.target.parentNode.dataset.sid);
    users.splice(index, 1);
    updateUsers(users);
    return
}

function getUsers() {
    var users = JSON.parse(localStorage.getItem("muted_users"));
    if (users == null) {
        users = [];
    }
    return users
}

function updateUsers(users) {
    var content = document.querySelector(".userlist");
    var user_list = content.children[1];
    var temp_user = document.createElement("template");
    user_list.replaceChildren();
    users.forEach((user) => {
        temp_user.innerHTML = `<div class="participants-profile" data-sid="${user}"><span>${user}</span><button style="float: right;" type="button">Remove</button></div>`
        temp_user.content.children[0].children[1].onclick = removeUser
        user_list.append(temp_user.content.children[0])
    });
    localStorage.setItem("muted_users", JSON.stringify(users));
}

function changeVisibility() {
    var dialog = document.getElementById("BLOCKDIALOG");
    dialog.hidden = !dialog.hidden
}

var temp_element = document.createElement("template");
temp_element.innerHTML = '<div id="BLOCK" class="ftr_el icon-v-ctr" role="button" style="display: inline-block;"><div class="ownmsg goog-inline-block goog-link-button txt-v-ctr" style="user-select: none" tabindex="0" title="Block">Mutes</div></div>';
var block_element = temp_element.content.children[0]
block_element.onclick = changeVisibility

temp_element.innerHTML = '<div id="BLOCKDIALOG" hidden="" class="sdlg-main-cbdr-cpbg participants-dlg" tabindex="0" style="width: 80%; height: 60%; left: 10%; top: 20%;" role="dialog"><div class="sdlg-title" style="padding-right: 33px;"><span class="sdlg-title-text" id=":1b" role="heading">Muted users</span><span class="sdlg-title-close" role="button" tabindex="0" aria-label="Close"><div class="icon-button close-button" title="" style="height: 15px; width: 15px; user-select: none;" role="button" tabindex="0"><div class="ib-icon"><svg width="15" height="15" overflow="hidden"><defs></defs><g style="display: block;"><path d="M 4 4 L 11 11 M 11 4 L 4 11" stroke="#000" stroke-opacity="1" stroke-width="0.6" fill="none"></path></g></svg></div></div></span></div><div class="sdlg-header"><div class="sdlg-header-content" style=""><span class="participants-option"><div class="chatango-checkbox chatango-checkbox-checked" role="checkbox" style="user-select: none;" tabindex="0" aria-checked="true"><input type="checkbox" id="hide" name="hide" value="hideoption"><span class="chatango-checkbox-caption"><span title="Delete option">Completely hide messages</span></span></div></span></div></div><div class="userlist" style="overflow: scroll; height: 100%"><div style="padding-top: 10px;padding-left: 10px"><span>Enter username: </span><input id="inputuser" name="inputuser" type="text" style="display: inline-block"><input id="adduser" type="button" value="Add"></div><div class="sdlg-sc content-dialog participants-list participants-mods"></div></div></div>'
var menu_element = temp_element.content.children[0]
menu_element.children[0].children[1].onclick = changeVisibility

wsHook.before = function (data, url, wsObject) {
    return data;
}

wsHook.after = function (data, url, wsObject) {
    var users = getUsers();
    if (data.data == null) {
        return data;
    } else if (data.data == "inited") { // Ready to add elements
        let footer = document.getElementById("FTR_RIGHT");
        footer.prepend(block_element);
        document.body.append(menu_element);
        updateUsers(getUsers());
        var input_field = document.getElementById("adduser");
        input_field.onclick = addUser
    } else if (data.data.startsWith("b:")) {
        var data_items = data.data.split(':');
        if (users.includes(data_items[2])) { // User is in the mute list
            data_items[10] = "&lt;hidden&gt;";
            data.data = data_items.join(':');
        }
    }
    return data;
}