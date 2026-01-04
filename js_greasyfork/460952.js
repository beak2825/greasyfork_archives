// ==UserScript==
// @name         Violentmonkey - Nostr.ch Chatbox Filter
// @namespace    NostrChatboxFilter
// @version      1.1
// @description  Filters spam messages from Nostr chatbox based on specified pattern - Tested with Chromium
// @author       gourcetools
// @match        https://nostr.ch/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460952/Violentmonkey%20-%20Nostrch%20Chatbox%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/460952/Violentmonkey%20-%20Nostrch%20Chatbox%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideMessages() {
        // Define the patterns to hide
        const patternsToHide = ['lightning', 'chatgpt', 'free sats', 'nokyc'];

        // Select all message boxes
        const messageBoxes = document.querySelectorAll('.mbox');

        // Iterate through the message boxes
        messageBoxes.forEach((messageBox) => {
            // Get the message text
            const messageText = messageBox.innerText.toLowerCase();

            // Check if the message contains any of the patterns to hide
            const shouldHide = patternsToHide.some((pattern) => messageText.includes(pattern));

            // Hide the message if it contains any of the patterns to hide
            if (shouldHide) {
                messageBox.style.display = 'none';
            }
        });
    }

    setInterval(hideMessages, 1000);
})();

