// ==UserScript==
// @name         YouTube Unshortened
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Hides YouTube Shorts from feeds, but keeps the main Shorts navigation link.
// @author       OthorWight
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539934/YouTube%20Unshortened.user.js
// @updateURL https://update.greasyfork.org/scripts/539934/YouTube%20Unshortened.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hideShortsElements = () => {
        // Selectors for Shorts-related elements, EXCLUDING the main navigation links.
        const selectorsToHide = [
            // --- Shelves and Sections ---
            // Hide the entire "Shorts" section (shelf container) on Home/Subscriptions pages.
            'ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
            // Explicitly hide the rich shelf renderer if it has the 'is-shorts' attribute.
            'ytd-rich-shelf-renderer[is-shorts]',

            // Hide other types of Shorts shelves (e.g., on search results).
            'ytd-reel-shelf-renderer',

            // --- Individual Videos ---
            // Hide individual Short videos that may appear in various feeds.
            'ytd-grid-video-renderer:has(a[href^="/shorts/"])', // Grid view (e.g., Subscriptions)
            'ytd-rich-item-renderer:has(a[href^="/shorts/"])', // Home page rich grid
            'ytd-video-renderer:has(a[href^="/shorts/"])', // List view (e.g., Search results)
            'ytd-compact-video-renderer:has(a[href^="/shorts/"])', // "Up next" sidebar when watching a video
            'ytd-reel-item-renderer' // Renderer specifically for Shorts reels
        ];

        // Find all elements matching the selectors and hide them.
        document.querySelectorAll(selectorsToHide.join(','))
            .forEach(element => {
                if (element.style.display !== 'none') {
                    element.style.display = 'none';
                }
            });

        // --- Special Case: Channel Tabs ---
        // Hiding the "Shorts" tab on a channel page.
        document.querySelectorAll('tp-yt-paper-tab').forEach(tab => {
            const tabText = tab.textContent || tab.innerText;
            if (tabText && tabText.trim().toUpperCase() === 'SHORTS') {
                 if (tab.style.display !== 'none') {
                    tab.style.display = 'none';
                }
            }
        });
    };

    // YouTube loads content dynamically. A MutationObserver is the most
    // reliable way to act on new elements as they are added to the page.
    const observer = new MutationObserver(hideShortsElements);

    // Start observing the entire document for additions of new elements.
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Run the function once the initial document is loaded.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideShortsElements);
    } else {
        hideShortsElements();
    }
})();