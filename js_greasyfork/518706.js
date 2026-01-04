// ==UserScript==
// @name         Discord/Shapes - < > Hider
// @namespace    https://discord.com/
// @version      1.3
// @description  Hide elements enclosed by < > in Discord
// @author       Vishanka
// @match        https://discord.com/channels/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/518706/DiscordShapes%20-%20%3C%20%3E%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/518706/DiscordShapes%20-%20%3C%20%3E%20Hider.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideEnclosedEntries() {
        const messageItems = document.querySelectorAll('li[class^="messageListItem_"]');

        messageItems.forEach(messageItem => {
            const spans = messageItem.querySelectorAll('div[class*="messageContent_"] span');

            let isHiding = false;
            spans.forEach(span => {
                const text = span.textContent.trim();

                // Start hiding when encountering '<'
                if (text.startsWith('<') && !isHiding) {
                    isHiding = true;
                }

                // Apply hiding style if within an enclosed entry
                if (isHiding) {
                    span.style.opacity = '0'; // Make it invisible
                    span.style.position = 'absolute'; // Remove it from the document flow
                }

                // Stop hiding when encountering '>'
                if (text.endsWith('>') && isHiding) {
                    isHiding = false;
                }
            });
        });
    }

    // Observe for new messages being added to the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            hideEnclosedEntries();
        });
    });

    // Start observing the entire document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    hideEnclosedEntries();
})();
