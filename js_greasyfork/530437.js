// ==UserScript==
// @name         Rename Player in Chat
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replaces a specific player's name in chat messages with a custom name
// @author       You
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530437/Rename%20Player%20in%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/530437/Rename%20Player%20in%20Chat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the original and new names
    const targetName = "TargetName";  // Pick the username you want to change
    const newName = "DesiredName"; // Change this to your desired replacement

    function renamePlayerMessages() {
        document.querySelectorAll('.CharacterName_name__1amXp[data-name]').forEach(nameElement => {
            if (nameElement.getAttribute("data-name") === targetName) {
                let span = nameElement.querySelector('span');
                if (span && span.textContent === targetName) {
                    span.textContent = newName;
                }
            }
        });
    }

    // Observe chat for new messages dynamically
    const observer = new MutationObserver(renamePlayerMessages);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run immediately on script load
    renamePlayerMessages();
})();
