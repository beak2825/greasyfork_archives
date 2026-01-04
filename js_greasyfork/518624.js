// ==UserScript==
// @name         Discord Rule Filter
// @namespace    https://discord.com/
// @version      1.0
// @description  Hide elements related to specific rules in Discord messages.
// @author       Your Name
// @match        https://discord.com/channels/1165405556421435483/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518624/Discord%20Rule%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/518624/Discord%20Rule%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideRuleSpans() {
        const messageItems = document.querySelectorAll('li[class^="messageListItem_"]');

        messageItems.forEach(messageItem => {
            const spans = messageItem.querySelectorAll('div[class*="messageContent_"] span');

            let hideSpans = false;
            spans.forEach(span => {
                if (span.textContent.includes('<Rule')) {
                    hideSpans = true;
                }
                if (hideSpans) {
                    span.style.display = 'none';
                }
            });
        });
    }

    // Observe for new messages being added to the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            hideRuleSpans();
        });
    });

    // Start observing the entire document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    hideRuleSpans();
})();
