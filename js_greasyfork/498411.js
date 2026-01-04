// ==UserScript==
// @name         Remove YouTube Shorts and Trending/ Premium elements
// @namespace    fiverr.com/web_coder_nsd
// @version      1.0
// @description  Removes specific elements from YouTube for a cleaner interface
// @author       noushadBug
// @match        https://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498411/Remove%20YouTube%20Shorts%20and%20Trending%20Premium%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/498411/Remove%20YouTube%20Shorts%20and%20Trending%20Premium%20elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElements() {
        const reelShelves = document.querySelectorAll('ytd-reel-shelf-renderer');
        const richSections = document.querySelectorAll('div#content.ytd-rich-section-renderer');

        reelShelves.forEach(function(el){console.log("found short/premium ads"); el.remove()});
        richSections.forEach(function(el){console.log("found short/premium ads"); el.remove()});

        // Remove videos with "SHORTS" badge
        const badges = document.querySelectorAll('.badge-shape-wiz__text');
        badges.forEach((badge, index) => {
            if (badge.textContent.trim() === 'SHORTS') {
                const videoRenderer = badge.closest('ytd-video-renderer');
                if (videoRenderer) {
                    console.log("found short/premium ads");
                    videoRenderer.remove();
                }
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        removeElements();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check in case the elements are already present
    removeElements();
})();
