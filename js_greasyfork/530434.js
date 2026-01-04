// ==UserScript==
// @name         Delete System Chat Messages
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Deletes any new system chat message, leaves dungeon messages alone
// @author       GoldenHound
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530434/Delete%20System%20Chat%20Messages.user.js
// @updateURL https://update.greasyfork.org/scripts/530434/Delete%20System%20Chat%20Messages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeInvalidMessages() {
        document.querySelectorAll('.TabPanel_tabPanel__tXMJF .ChatMessage_chatMessage__2wev4.ChatMessage_systemMessage__3Jz9e').forEach(msg => {
            const messageText = msg.textContent.trim();

            // List of strings that should not be deleted
            const allowedStrings = [
                "Key count:", "Party failed", "is not ready",
                "joined the party", "is ready", "Battle started:"
            ];

            // Check if the message contains any of the allowed strings
            const isValid = allowedStrings.some(allowedString => messageText.includes(allowedString));

            // Delete the message if it doesn't contain a ":" or any of the allowed strings
            if (!isValid) {
                msg.remove();
            }
        });
    }

    const observer = new MutationObserver(removeInvalidMessages);
    observer.observe(document.body, { childList: true, subtree: true });

    removeInvalidMessages();
})();
