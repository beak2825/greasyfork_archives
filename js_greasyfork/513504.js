// ==UserScript==
// @name         Youtube thumbnail padding fix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes the padding discrepancy on the thumbnails
// @author       Kalakaua
// @match        https://www.youtube.com/
// @include      *://*.youtube.com/watch*
// @include      *://*.youtube.com/feed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513504/Youtube%20thumbnail%20padding%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/513504/Youtube%20thumbnail%20padding%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if an element is visible
    function isVisible(el) {
        return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) &&
               window.getComputedStyle(el).visibility !== 'hidden' &&
               window.getComputedStyle(el).display !== 'none';
    }

    // Function to update margin-left in the specified pattern
    function updateMarginLeft() {
        const elements = document.querySelectorAll('ytd-rich-item-renderer');
        let activeCount = 0; // Count of active (visible) elements

        elements.forEach((el) => {
            if (isVisible(el)) {
                // Increment active count for visible elements
                if (activeCount % 6 === 0) {
                    el.style.marginLeft = '24px'; // 1st, 7th, 13th, etc.
                } else {
                    el.style.marginLeft = '8px'; // 2nd to 6th, 8th to 12th, etc.
                }
                activeCount++; // Increment the count for each visible element
            }
        });
    }

    // Initial margin adjustment
    updateMarginLeft();

    // MutationObserver to detect DOM changes and update margin accordingly
    const observer = new MutationObserver(() => {
        updateMarginLeft();
    });

    // Observe the entire document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Event listener for when the page is fully loaded
    window.addEventListener('DOMContentLoaded', updateMarginLeft);

    // Listen for visibility changes (when returning from another tab)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateMarginLeft();
        }
    });
})();