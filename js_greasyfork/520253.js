// ==UserScript==
// @name         Bluesky Hashtag Page Auto-Click Latest Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically clicks the 'Latest' button on Bluesky hashtag pages
// @author       Claude 3.5 Sonnet
// @match        https://bsky.app/hashtag/*
// @match        https://bsky.app/search?q*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520253/Bluesky%20Hashtag%20Page%20Auto-Click%20Latest%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/520253/Bluesky%20Hashtag%20Page%20Auto-Click%20Latest%20Button.meta.js
// ==/UserScript==

// Written with prompting instructions from Lauren @lauren1701.bsky.social

(function() {
    'use strict';

    // Function to check and click the 'Latest' button
    function clickLatestButton() {
        // Select the 'Latest' tab button
        const latestButton = document.querySelector('div[role="tablist"] div[role="tab"]:nth-child(2)');

        if (latestButton) {
            // If the 'Latest' button is found and not already selected, click it
            if (!latestButton.querySelector('[style*="border-bottom-color: rgb(16, 131, 254)"]')) {
                latestButton.click();
                console.log('Clicked Latest button');
            }
        }
    }

    // Use a MutationObserver to watch for changes in the page
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                clickLatestButton();
            }
        }
    });

    // Start observing the page with the following configuration
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case the button is already present
    clickLatestButton();
})();