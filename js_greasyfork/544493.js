// ==UserScript==
// @name         YouTube: Block All Sponsored Videos on Home Page (Stable Layout)
// @namespace    https://greasyfork.org/en/users/1501169-mpatra193
// @version      1.5
// @description  Remove all YouTube ads and sponsored content. Keeps homepage layout stable and clean.
// @author       Monalisha Patra
// @match        *://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544493/YouTube%3A%20Block%20All%20Sponsored%20Videos%20on%20Home%20Page%20%28Stable%20Layout%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544493/YouTube%3A%20Block%20All%20Sponsored%20Videos%20on%20Home%20Page%20%28Stable%20Layout%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let debounceTimeout;

    function removeAds() {
        // Remove player ads, overlays, banners
        document.querySelectorAll([
            '#player-ads',
            '.ytp-ad-module',
            '.ytp-ad-overlay-container',
            '.video-ads',
            '.ytp-ad-player-overlay',
            'ytd-display-ad-renderer',
            'ytd-promoted-sparkles-text-search-renderer',
            'ytd-promoted-video-renderer',
            '#masthead-ad'
        ].join(',')).forEach(el => el.remove());

        // Remove sponsored videos from feed/home
        const items = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');
        for (const el of items) {
            const text = el.innerText.toLowerCase();
            if (/\bsponsored\b|\bad\b|\bpromotion\b/.test(text)) {
                el.remove();
            }
        }
    }

    function debounceRemoveAds() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(removeAds, 1200);
    }

    // Initial run
    window.addEventListener('load', () => {
        setTimeout(removeAds, 1800);
    });

    // Observe page changes but debounce DOM processing
    const observer = new MutationObserver(debounceRemoveAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();
