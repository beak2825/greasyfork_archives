// ==UserScript==
// @name         YouTube Shorts Blocker (m.youtube.com)
// @namespace    https://greasyfork.org/users/000000   // replace with your own GreasyFork ID if you want
// @version      1.0
// @description  Completely remove YouTube Shorts from search results and recommendations on m.youtube.com
// @author       ChatGPT
// @license      MIT
// @match        https://m.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546393/YouTube%20Shorts%20Blocker%20%28myoutubecom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546393/YouTube%20Shorts%20Blocker%20%28myoutubecom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeShorts() {
        document.querySelectorAll('a[href*="/shorts/"]').forEach(el => {
            let parent = el.closest(
                'ytd-rich-item-renderer, ytm-video-with-context-renderer, ytm-compact-video-renderer, li, div'
            );
            if (parent) {
                parent.remove();
            } else {
                el.remove();
            }
        });
    }

    // Initial run
    removeShorts();

    // Watch for dynamically loaded content
    const observer = new MutationObserver(removeShorts);
    observer.observe(document.body, { childList: true, subtree: true });
})();