// ==UserScript==
// @name         YouTube Ad Blocker (Updated)
// @namespace    https://example.com/
// @version      1.0
// @description  Blocks YouTube ads effectively without detection.
// @author       hunter
// @match        *://*.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524072/YouTube%20Ad%20Blocker%20%28Updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/524072/YouTube%20Ad%20Blocker%20%28Updated%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const adSelectors = [
        '.ytp-ad-player-overlay',
        '.ytp-ad-module',
        '.ytp-ad-text',
        '.ad-interrupting',
        '.video-ads',
        '.ytp-ad-image-overlay'
    ];

    const adPatterns = [
        'googleads.g.doubleclick.net',
        'youtube.com/api/stats/playback',
        'youtube.com/get_video_info'
    ];

    // Block network ads (fetch and XHR)
    const blockNetworkAds = () => {
        const originalFetch = window.fetch;
        window.fetch = function(url, options) {
            if (adPatterns.some(pattern => url.includes(pattern))) {
                console.log('Blocked fetch request:', url);
                return new Promise(() => {});
            }
            return originalFetch.apply(this, arguments);
        };

        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            if (adPatterns.some(pattern => url.includes(pattern))) {
                console.log('Blocked XMLHttpRequest:', url);
                return;
            }
            return originalXhrOpen.apply(this, arguments);
        };
    };

    // MutationObserver to hide ads
    const observer = new MutationObserver(() => {
        adSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(ad => {
                ad.style.display = 'none';  // Hide the ad instead of removing it
            });
        });
    });

    const startObserver = () => {
        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Initialize the script after the video player is loaded
    const initializeObserver = () => {
        const player = document.querySelector('video');
        if (player) {
            startObserver();
        } else {
            setTimeout(initializeObserver, 1000); // Retry after 1 second if player isn't found
        }
    };

    // Inject styles to hide ads without affecting the video player
    GM_addStyle(`
        ${adSelectors.filter(selector => !selector.includes('video')).join(', ')} {
            display: none !important;
            visibility: hidden !important;
        }
    `);

    // Initialize the script
    blockNetworkAds();
    initializeObserver();

})();
