// ==UserScript==
// @name         Autotrader Cleaner
// @namespace    https://autotrader.co.uk
// @version      1.3.2
// @description  Fully removes ads, leasing offers, and "you may also like" junk from Autotrader UK search results. Stable, fast, safe, and (hopefully) future-proof.
// @author       Mark
// @license      Custom: Free for personal use, commercial use prohibited.
// @match        https://www.autotrader.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autotrader.co.uk
// @homepageURL  https://greasyfork.org/en/scripts/539340-autotrader-cleaner
// @supportURL   https://greasyfork.org/en/scripts/539340-autotrader-cleaner/feedback
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539340/Autotrader%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/539340/Autotrader%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Safety check (belt-and-braces)
    if (window.location.hostname !== 'www.autotrader.co.uk') return;

    // Debug toggle for development/testing
    const DEBUG = false;

    // Central list of known unwanted listing types
    const testIdsToRemove = [
        "FEATURED_LISTING",
        "YOU_MAY_ALSO_LIKE",
        "LEASING_LISTING",
        "PROMOTED_LISTING"
    ];

    function removeUnwantedListings() {
        testIdsToRemove.forEach(testId => {
            document.querySelectorAll(`span[data-testid="${testId}"]`).forEach(el => {
                const listItem = el.closest('li');
                if (listItem) {
                    listItem.remove();
                    if (DEBUG) console.log(`[Autotrader Cleaner] Removed listing: ${testId}`);
                }
            });
        });
    }

    // Run initially at page load
    removeUnwantedListings();

    // Observe for dynamically loaded content (infinite scroll, filters, etc.)
    const observer = new MutationObserver((mutationsList, obs) => {
        // Pause observation while processing
        obs.disconnect();
        removeUnwantedListings();
        // Resume observation
        obs.observe(document.body, { childList: true, subtree: true });
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });

})();