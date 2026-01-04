// ==UserScript==
// @name         Medium Web hotkeys
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  hotkeys!
// @author       You
// @match        https://web.imedium.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370810/Medium%20Web%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/370810/Medium%20Web%20hotkeys.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Your code here...
  function isWPressed(keyCode) {
    return [119, 1094].indexOf(keyCode) !== -1;
  }
  function isSPressed(keyCode) {
    return [115, 1099].indexOf(keyCode) !== -1;
  }

  function isBodyFocus() {
    return document.activeElement === document.body;
  }
  function setBodyFocus() {
    document.activeElement.blur();
  }

  function getList() {
    return document.getElementsByClassName('chats-list main')[0];
  }

  function getContacts() {
    return getList().children;
  }

  function getNextContact() {
    var contacts = getContacts();
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].className.indexOf('active') !== -1) {
        if (i < contacts.length - 1) {
          return contacts[i + 1];
        }
      }
    }
    return contacts[0] || null;
  }

  function getPreviousContact() {
    var contacts = getContacts();
    var previousContact = contacts[0];
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].className.indexOf('active') !== -1) {
        return previousContact;
      }
      previousContact = contacts[i];
    }
    return null;
  }

  function click(element) {
    if (element === null) {
      return;
    }
    element.click();
    setTimeout(setBodyFocus, 2);
  }

  function onKeyPress(event) {
    if (!isBodyFocus()) {
      return;
    }
    var keyCode = event.keyCode;
    if (isWPressed(keyCode)) {
      return click(getPreviousContact());
    }
    if (isSPressed(keyCode)) {
      return click(getNextContact());
    }
  }

  document.addEventListener('keypress', onKeyPress);
})();
