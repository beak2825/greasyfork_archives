// ==UserScript==
// @name         Filter YT home feed by video titles (updated selectors)
// @version      0.2
// @description  Filter YouTube home feed by video titles. Use multiple words with AND/OR logic switch.
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1449358
// @downloadURL https://update.greasyfork.org/scripts/530631/Filter%20YT%20home%20feed%20by%20video%20titles%20%28updated%20selectors%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530631/Filter%20YT%20home%20feed%20by%20video%20titles%20%28updated%20selectors%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the words you want to filter for (case-insensitive)
    const requiredWords = ['vlog', 'daily'];
    // Set the filter logic: true for AND, false for OR
    const useAndLogic = false; // Change this to true for AND logic

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function makeRegexp(word) {
        const escaped = escapeRegExp(word);
        // Create regex with word boundaries if word is only word chars
        if (/^\w+$/.test(word)) {
            return new RegExp(`\\b${escaped}\\b`, 'i');
        }
        // Otherwise a simple case-insensitive regex
        return new RegExp(escaped, 'i');
    }

    // Precompile regexps for performance
    const wordRegexps = requiredWords.map(makeRegexp);

    function filterVideos() {
        const videos = document.querySelectorAll('ytd-rich-item-renderer');

        videos.forEach(video => {
            // Find title anchor element by class pattern containing "title"
            const titleElement = video.querySelector('a[class*="title"]');
            if (!titleElement) {
                video.style.display = 'none';
                return;
            }
            const titleText = titleElement.textContent || '';
            const title = titleText.trim();

            // Detect playlist by href containing '/playlist?'
            const href = titleElement.getAttribute('href') || '';
            const isPlaylist = href.includes('/playlist?');

            if (isPlaylist || !title) {
                video.style.display = 'none';
                return;
            }

            // Check match based on AND/OR logic with wordRegexps
            let shouldDisplay;
            if (useAndLogic) {
                shouldDisplay = wordRegexps.every(re => re.test(title));
            } else {
                shouldDisplay = wordRegexps.some(re => re.test(title));
            }

            video.style.display = shouldDisplay ? '' : 'none';
        });
    }

    // Set up MutationObserver on the home page feed container for dynamic updates
    function setupObserver() {
        // The container that holds the video items
        const container = document.querySelector('ytd-rich-grid-renderer #contents');
        if (!container) {
            // Retry if container not found yet (page may not be loaded)
            setTimeout(setupObserver, 500);
            return;
        }
        // Observe changes so we re-filter on new videos added
        const observer = new MutationObserver(filterVideos);
        observer.observe(container, { childList: true, subtree: true });

        // Initial run
        filterVideos();
    }

    setupObserver();

})();