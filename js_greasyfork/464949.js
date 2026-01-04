// ==UserScript==
// @name         Iggy
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Ignore Someone!
// @author       BadNintendo
// @match        https://www.shutdown.chat/*/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
 // @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/464949/Iggy.user.js
// @updateURL https://update.greasyfork.org/scripts/464949/Iggy.meta.js
// ==/UserScript==

(function () {
    'use strict';

// Define an object to store blocked nicknames and uuids
var blockedUsers = {};

// Define an array of blocked nicknames to ignore in chat
var blockedNicknames = ["GROVE_0F_WAR", "Example2"];

// Define a function to extract the nickname from the span element with class name fcuser
function getNickname(fcuserSpan) {
	if(!fcuserSpan) return;
  var nickname = fcuserSpan.innerText.replace(/[:\-]/g, '').trim(); // remove : and - and leading/trailing spaces
  return nickname;
}

// Define a function to handle the new <p> elements
function handleNewChatMessages() {
  var chatboxElems = document.getElementsByClassName('chatbox')[0].getElementsByTagName('p');
  for (var i = 0; i < chatboxElems.length; i++) {
    var chatElem = chatboxElems[i];
    if (!chatElem.handled) { // check if the element has been handled before
      chatElem.handled = true; // mark the element as handled
      var fcuserSpan = chatElem.getElementsByClassName('fcuser')[0];
      var nickname = getNickname(fcuserSpan);
      var uuid = fcuserSpan.dataset.uuid;
      if (blockedNicknames.includes(nickname) || blockedUsers[uuid]) { // check if the nickname or uuid is blocked
        chatElem.parentNode.removeChild(chatElem); // remove the message element
      } else {
        fcuserSpan.dataset.uuid = nickname; // update the data-uuid attribute with the nickname
        blockedUsers[uuid] = false; // initialize the blocked state of the uuid to false
        blockedNicknames.push(nickname); // add the nickname to the array of blocked nicknames
      }
    }
  }
}

// Call the handleNewChatMessages function on page load and whenever the chatbox is updated
handleNewChatMessages();
document.getElementsByClassName('chatbox')[0].addEventListener('DOMNodeInserted', handleNewChatMessages);


})();