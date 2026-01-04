// ==UserScript==
// @name                Block YouTube Shorts Completely
// @namespace    http://tampermonkey.net/
// @version            2.0
// @description    Hides YT Shorts (I use this to focus better on my work)
// @author             Emree.el on instagram 
// @match             https://www.youtube.com/*
// @grant               none
// @license           MIT
// @downloadURL https://update.greasyfork.org/scripts/532423/Block%20YouTube%20Shorts%20Completely.user.js
// @updateURL https://update.greasyfork.org/scripts/532423/Block%20YouTube%20Shorts%20Completely.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeShorts = () => {
        const selectors = [
            'ytd-rich-shelf-renderer:has(a[href^="/shorts"])',
            'ytd-reel-shelf-renderer',
            'a[href^="/shorts"]',
            'ytd-grid-video-renderer:has(a[href^="/shorts"])',
            'ytd-reel-item-renderer',
            'ytd-video-renderer:has(a[href*="shorts"])',
            'a[title="Shorts"]', // Sidebar Shorts button
            'a[href="/shorts"]'   // Any other direct shorts button
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    };

    setInterval(removeShorts, 1000); // run every second to clean up
})();
