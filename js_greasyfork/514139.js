// ==UserScript==
// @name         Youtube No Shorts
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide Shorts section on YouTube results and main pages, including individual SHORTS videos
// @author       SunshineMoonGit
// @license      MIT
// @icon         https://www.youtube.com/s/desktop/9fa451de/img/logos/favicon_48x48.png
// @match        https://www.youtube.com/results?search_query=*
// @match        https://www.youtube.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514139/Youtube%20No%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/514139/Youtube%20No%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Shorts section selectors
    const resultsShortsSelector = "ytd-reel-shelf-renderer.style-scope.ytd-item-section-renderer";
    const mainShortsSelector = "ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer";
    const shortsBadgeSelector = ".badge-shape-wiz__text";  // Selector for the "SHORTS" badge
    const videoRendererSelector = "ytd-video-renderer.style-scope.ytd-item-section-renderer";

    // Function to remove Shorts sections and individual SHORTS videos
    function removeShorts() {
        // Remove Shorts sections on search results and main page
        document.querySelectorAll(resultsShortsSelector).forEach(el => el.remove());
        document.querySelectorAll(mainShortsSelector).forEach(el => el.remove());

        // Remove individual SHORTS videos with "SHORTS" badge
        document.querySelectorAll(videoRendererSelector).forEach(video => {
            const badge = video.querySelector(shortsBadgeSelector);
            if (badge && badge.textContent.trim() === "SHORTS") {
                video.remove();
            }
        });
    }

    // Observer to monitor dynamic content changes and remove Shorts sections
    const observer = new MutationObserver(() => {
        removeShorts();
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial removal of Shorts sections and individual SHORTS videos
    removeShorts();
})();
