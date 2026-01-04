// ==UserScript==
// @name         WhatsApp Conversation Hider
// @namespace    https://roinujnosde.me
// @version      0.3
// @description  Hides the conversation tab when ESC is pressed
// @author       RoinujNosde
// @match        https://web.whatsapp.com/
// @icon         https://web.whatsapp.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443126/WhatsApp%20Conversation%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/443126/WhatsApp%20Conversation%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var closeConvoClassName = "_2oldI dJxPU";

    function isConversationOpen() {
        return document.getElementsByClassName("_3xTHG").length > 0;
    }

    function hideOptions() {
        document.getElementsByClassName("o--vV wGJyi")[0].style.display = "none";
    }

    function getMoreOptions() {
        return document.getElementsByClassName("_26lC3")[4];
    }

    function closeConversation() {
        if (!isConversationOpen()) {
            return;
        }
        getMoreOptions().click();
        setTimeout(function() {
            var buttons = document.getElementsByClassName(closeConvoClassName);
            if (buttons.length === 6) { //it's a group
                document.getElementsByClassName("_3K4-L")[0].focus(); //scroll works again
                hideOptions();
                return;
            }
            var index = buttons.length === 9 ? 4 : 2;
            buttons[index].click()
            hideOptions();
        }, 1);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape") {
            console.debug("Esc pressed");
            if (closeConversation()) {
                event.preventDefault();
            }
        }
    });
})();
