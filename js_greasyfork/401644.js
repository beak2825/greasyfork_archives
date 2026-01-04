// ==UserScript==
// @name         Facebook Export: Show messages in the right order
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Orders messages into the right order on chat history pages of HTML exports produced by Facebook's "Download your information" tool (https://www.facebook.com/dyi). Make sure to go to chrome://extensions > Tampermonkey > Details and enable "Allow access to file URLs" to allow the script to work.
// @author       SUM1
// @match        *:///*/messages/inbox/*/message*.html
// @match        *://*/messages/inbox/*/message*.html
// @downloadURL https://update.greasyfork.org/scripts/401644/Facebook%20Export%3A%20Show%20messages%20in%20the%20right%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/401644/Facebook%20Export%3A%20Show%20messages%20in%20the%20right%20order.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector('._4t5n')) { //                                                    Check if the container div of all messages exists. If it does,
        let chatContainer = document.querySelector('._4t5n') //                                   assign the container div to a variable for brevity;
        for (var i = 1; i < chatContainer.childNodes.length; i++) { //                            for each child node of the container div (i.e., each message),
            chatContainer.insertBefore(chatContainer.childNodes[i], chatContainer.firstChild); // insert it before the first message div.
        }
    }
})();
