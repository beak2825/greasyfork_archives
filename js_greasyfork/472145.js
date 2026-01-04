// ==UserScript==
// @name         Garbo Funnifier
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  don't worry, funny is allowed in this repository.
// @author       NexusKitten
// @match        *://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      GNU LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/472145/Garbo%20Funnifier.user.js
// @updateURL https://update.greasyfork.org/scripts/472145/Garbo%20Funnifier.meta.js
// ==/UserScript==

(function () {
  'use strict';
  replace;
  window.setInterval(replace, 2500);

  function replace() {

    // Find all messages with attached usernames
    let preTags = document.getElementsByClassName('username-h_Y3Us desaturateUserColors-1O-G89 clickable-31pE3P');
    var messages = [];

    for (let i = 0; i < preTags.length; i++) {
      // Check if it's GarboMuffin
      if (preTags[i].innerHTML === 'GarboMuffin' && !(preTags[i].parentElement.className === 'repliedMessage-3Z6XBG')) {
        messages.push(preTags[i]);
      }
    }

    for (let i = 0; i < messages.length; i++) {
      // Swap out the username for "GarbowoMuffin"
      messages[i].textContent = "GarbowoMuffin";
      let message = messages[i].parentElement.parentElement.parentElement.lastChild;

      // Convert full message into owospeak.
      for (let j = 0; j < message.children.length; j++) {
      if (!(message.children[j].className === 'timestamp-p1Df1m')) {
        message.children[j].textContent = message.children[j].textContent.replace(new RegExp('r', 'g'), 'w');
        message.children[j].textContent = message.children[j].textContent.replace(new RegExp('l', 'g'), 'w');
      }
      }

      let tildemessage = message.lastChild;

      // Add the tilde~
      if (tildemessage.className === 'timestamp-p1Df1m') {
        tildemessage.previousElementSibling.textContent = tildemessage.previousElementSibling.textContent + '~'
      } else {
        tildemessage.textContent = tildemessage.textContent + '~'
      }
    }
  }
})();