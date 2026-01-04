// ==UserScript==
// @name         CrownCoins Package Swapper
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Updates packageId parameter in iframes when specific value is found
// @match        *://*.crowncoinscasino.com/*
// @match        https://crowncoinscasino.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519497/CrownCoins%20Package%20Swapper.user.js
// @updateURL https://update.greasyfork.org/scripts/519497/CrownCoins%20Package%20Swapper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update iframe URLs
    function updateIframeUrls() {
        // Get all iframes on the page
        const iframes = document.getElementsByTagName('iframe');

        // Check each iframe
        for (let iframe of iframes) {
            if (!iframe.src) continue;

            try {
                const url = new URL(iframe.src);
                const packageId = url.searchParams.get('packageId');

                // Check if this is the specific packageId we want to replace
                if (packageId === '166022') {
                    // Set the new packageId while keeping all other parameters
                    url.searchParams.set('packageId', '8903');
                    iframe.src = url.toString();
                }
            } catch (e) {
                console.log('Error processing iframe URL:', e);
            }
        }
    }

    // Run when the page loads
    updateIframeUrls();

    // Also run when new content is dynamically added to the page
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                updateIframeUrls();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });
})();