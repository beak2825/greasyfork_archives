// ==UserScript==
// @name         CivitAI-Crap-Blocker
// @namespace    Violentmonkey Scripts
// @version      3.3
// @description  Blocks unwanted resources and removes cosmetic effects
// @author       Poochilli
// @match        https://civitai.com/*
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/535828/CivitAI-Crap-Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/535828/CivitAI-Crap-Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block these URL patterns
    const BLOCK_LIST = [
        'avatar',
        'poster',
        'decoration',
        '_144x144',
        '_small',
        '/badges/',
        '/user/',
        'thumbnails',
        'previews'
    ];

    // Main blocking function
    function blockUnwantedResources() {
        // Block images/videos
        document.querySelectorAll('img, video').forEach(el => {
            const src = el.src || el.currentSrc || el.getAttribute('src') || '';
            const shouldBlock = BLOCK_LIST.some(pattern => src.includes(pattern)) ||
                              (el.width === 144 && el.height === 144) ||
                              el.alt?.toLowerCase().includes('avatar');

            if (shouldBlock && !el.dataset.blocked) {
                el.dataset.blocked = 'true';
                el.src = '';
                el.srcset = '';
                el.removeAttribute('src');
                el.style.display = 'none';

                if (el.tagName === 'IMG') {
                    el.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                }
            }
        });

        // Block background images
        document.querySelectorAll('[style*="background-image"]').forEach(el => {
            const bgImage = el.style.backgroundImage;
            if (bgImage && BLOCK_LIST.some(pattern => bgImage.includes(pattern))) {
                el.style.backgroundImage = 'none';
            }
        });

        // Remove all gradient effects
        document.querySelectorAll('[style*="--bgGradient"]').forEach(el => {
            el.style.removeProperty('--bgGradient');
            el.style.backgroundImage = 'none';
            el.style.boxShadow = 'none';
        });
    }

    // Initialize the blocker
    function initBlocker() {
        // Run immediately
        blockUnwantedResources();

        // Run periodically to catch new elements
        const interval = setInterval(blockUnwantedResources, 1000);

        // Stop when page unloads
        window.addEventListener('beforeunload', () => {
            clearInterval(interval);
        });

        // MutationObserver for dynamic content
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    blockUnwantedResources();
                    break;
                }
            }
        });

        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }

    // Start the blocker when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlocker);
    } else {
        setTimeout(initBlocker, 100);
    }
})();