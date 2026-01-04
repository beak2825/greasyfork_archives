// ==UserScript==
// @name         Tokopedia Search URL Cleaner
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Removes unnecessary tracking and navigation GET parameters from Tokopedia search result URLs.
// @author       Gemini, LSlowmotion
// @match        https://www.tokopedia.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540703/Tokopedia%20Search%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/540703/Tokopedia%20Search%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of query parameters to be removed from the URL.
    const paramsToRemove = [
        'has_more',
        'search_id',
        'minus_ids',
        'navsource',
        'next_offset_organic',
        'next_offset_organic_ad'
    ];

    // --- Core URL Cleaning Function ---
    // This function reads the current URL, removes the unwanted parameters,
    // and updates the address bar if any changes were made.
    const cleanUrl = () => {
        // A simple check to prevent running the function on non-search pages if the script somehow injects there.
        if (!window.location.pathname.startsWith('/search')) {
            return;
        }

        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        let wasModified = false;

        paramsToRemove.forEach(param => {
            if (url.searchParams.has(param)) {
                url.searchParams.delete(param);
                wasModified = true;
            }
        });

        if (wasModified) {
            const newUrl = url.href;
            // Use history.replaceState to change the URL without a page reload.
            // This is more efficient and provides a smoother user experience.
            history.replaceState(null, '', newUrl);
            console.log('Tokopedia URL Cleaner: URL has been sanitized.');
        }
    };

    // --- Handling Single-Page Application (SPA) Navigation ---
    // Modern websites like Tokopedia change the URL with JavaScript (History API)
    // instead of full page reloads. We need to "monkey-patch" the history functions
    // to detect these changes and run our cleaning function.

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    const onUrlChange = () => {
        // We use a minimal timeout (0 milliseconds) to push the execution of cleanUrl
        // to the end of the browser's current task queue. This helps ensure that
        // the browser has finished updating window.location before we try to read it.
        setTimeout(cleanUrl, 0);
    };

    // Create a wrapper for history.pushState
    history.pushState = function(...args) {
        // Call the original function so the website works as expected.
        originalPushState.apply(this, args);
        // Run our custom logic after the URL has been pushed.
        onUrlChange();
    };

    // Create a wrapper for history.replaceState
    history.replaceState = function(...args) {
        // Call the original function.
        originalReplaceState.apply(this, args);
        // Run our custom logic after the URL has been replaced.
        onUrlChange();
    };

    // Also, listen for the 'popstate' event, which fires when the user
    // clicks the browser's back or forward buttons.
    window.addEventListener('popstate', onUrlChange);


    // --- Initial Execution ---
    // Run the cleaner function once as soon as the script is injected
    // to handle the initial page load.
    cleanUrl();

})();
