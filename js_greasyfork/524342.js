// ==UserScript==
// @name         Facebook: Force Chronological Feed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Appends ?sorting_setting=CHRONOLOGICAL to every Facebook URL change and refreshes the page.
// @author       ChatGPT
// @license MIT
// @match        *://*.facebook.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/524342/Facebook%3A%20Force%20Chronological%20Feed.user.js
// @updateURL https://update.greasyfork.org/scripts/524342/Facebook%3A%20Force%20Chronological%20Feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to append ?sorting_setting=CHRONOLOGICAL and refresh the page
    function appendSortingSettingAndRefresh() {
        const url = new URL(window.location.href);

        // Only add sorting_setting=CHRONOLOGICAL if it is not already present
        if (!url.searchParams.has('sorting_setting')) {
            url.searchParams.set('sorting_setting', 'CHRONOLOGICAL');
            window.history.replaceState({}, '', url.href); // Update the URL without reloading the page
            location.reload(); // Refresh the page to apply the updated URL
        }
    }

    // Observe URL changes in Facebook's Single Page Application
    function observeUrlChanges() {
        let previousUrl = window.location.href;

        const observer = new MutationObserver(() => {
            if (window.location.href !== previousUrl) {
                previousUrl = window.location.href;
                appendSortingSettingAndRefresh(); // Append the parameter and refresh when the URL changes
            }
        });

        // Start observing changes to the <body> element
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize the script
    function initialize() {
        appendSortingSettingAndRefresh(); // Apply the parameter and refresh on initial page load
        observeUrlChanges();              // Handle dynamic URL changes
    }

    // Run the script
    initialize();
})();
