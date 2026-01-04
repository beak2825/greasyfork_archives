// ==UserScript==
// @name         Remove people from faction chat
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Where are they ? I don't know !
// @author       Vaaaz
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393453/Remove%20people%20from%20faction%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/393453/Remove%20people%20from%20faction%20chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var t=setInterval(checkChat,1000);
    var chatMessage = document.getElementsByClassName('message_oP8oM ');
    var peopleToIgnore = ['Someone','SomeoneElse'] // Just add someone if you want

    function checkChat() {
      for (var i = 0; i < chatMessage.length; i++) {
        for (var k = 0; k < peopleToIgnore.length; k++) {
          if (chatMessage[i].textContent.startsWith(peopleToIgnore[k])) {
            chatMessage[i].style.display = "none";
            console.log("Message hidden.");
          }
        }
      }
    }
})();
