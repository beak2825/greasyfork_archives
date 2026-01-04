// ==UserScript==
// @name         Tagged message
// @namespace    
// @version      1.0.1
// @description  Bold and background on tagged message
// @author       MarentDev
// @match        https://realitygaming.fr/
// @match        https://realitygaming.fr/shoutbox/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368537/Tagged%20message.user.js
// @updateURL https://update.greasyfork.org/scripts/368537/Tagged%20message.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var username = document.getElementsByClassName("contentRow-header")[0].getElementsByClassName("username")[0].textContent;
    setInterval(function () { checkMessage(username) }, 1000);
})();

function checkMessage(username) {
    var messages = document.getElementsByClassName("shoutbox-messages")[0].getElementsByTagName("li");

   for (var i = 0; i < messages.length; i++) {
       var tags = messages[i].getElementsByClassName("username");

       for (var j = 0; j < tags.length; j++) {
           if (tags[j].dataset.username === "@" + username) {
               messages[i].style.background = "#23232380";
               messages[i].getElementsByClassName("shoutbox-message-content")[0].style.fontWeight = "bold";
           }
       }
   }
}