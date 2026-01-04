// ==UserScript==
// @name         Remove Brightspace Chat Crap
// @namespace    http://brightspace.saxion.nl/
// @version      2025-03-11
// @description  Remove the annoying Brightspace chatbot from every screen
// @author       jbo37
// @match        https://brightspace.saxion.nl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=saxion.nl
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529494/Remove%20Brightspace%20Chat%20Crap.user.js
// @updateURL https://update.greasyfork.org/scripts/529494/Remove%20Brightspace%20Chat%20Crap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeStuff() {
        const floatButton = document.getElementById("lw-floating-button");
        const chatFrame = document.getElementById("lw-chat-iframe");

        if (floatButton) {
            floatButton.remove();
            chatFrame.remove();
        } else {
            setTimeout(removeStuff, 1000);
        }
    }

    removeStuff();
})();
