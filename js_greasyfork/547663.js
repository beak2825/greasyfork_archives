// ==UserScript==
// @name         YouTube Restore Scrollable Fullscreen
// @namespace    burak-tools
// @version      1.91
// @description  Restores scrollable fullscreen mode to show title, comments, likes, and related videos. Disables new UI's bottom recommendations.
// @author       Waldoocs (https://x.com/Waldoocs) https://github.com/Waldoocs
// @match        https://www.youtube.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM.addStyle
// @license      MIT
// @compatible   firefox
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/547663/YouTube%20Restore%20Scrollable%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/547663/YouTube%20Restore%20Scrollable%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addStyle = (css) => {
        if (typeof GM_addStyle !== 'undefined') {
            GM_addStyle(css);
        } else if (typeof GM !== 'undefined' && GM.addStyle) {
            GM.addStyle(css);
        } else {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.textContent = css;
            document.head.appendChild(style);
        }
    };

    addStyle(`
        ytd-app[fullscreen] {
            overflow: auto !important;
        }
        ytd-app[scrolling] {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: calc((var(--ytd-app-fullerscreen-scrollbar-width) + 1px)*-1) !important;
            bottom: 0 !important;
            overflow-x: auto !important;
        }
        ytd-watch-flexy[fullscreen] #single-column-container.ytd-watch-flexy,
        ytd-watch-flexy[fullscreen] #columns.ytd-watch-flexy {
            display: flex !important;
        }

        /* Hide grid completely during playback */
        .html5-video-player:not(.ended-mode):not(.ytp-autohide) .ytp-fullscreen-grid,
        .html5-video-player:not(.ended-mode) .ytp-fullscreen-grid-stills-container {
            display: none !important;
            visibility: hidden !important;
        }

        /* Force grid variables to 0 */
        .html5-video-player:not(.ended-mode) {
            --ytp-grid-scroll-percentage: 0 !important;
            --ytp-grid-peek-height: 0px !important;
        }
    `);

    let lastCheck = 0;
    const CHECK_INTERVAL = 200; // Throttle checks to every 200ms

    function disableGridScroll() {
        // Throttle execution
        const now = Date.now();
        if (now - lastCheck < CHECK_INTERVAL) return;
        lastCheck = now;

        const player = document.querySelector('.html5-video-player');
        if (!player) return;

        // Remove problematic classes
        if (player.classList.contains('ytp-grid-scrollable')) {
            player.classList.remove('ytp-grid-scrollable');
        }
        if (player.classList.contains('ytp-fullscreen-grid-peeking')) {
            player.classList.remove('ytp-fullscreen-grid-peeking');
        }
    }

    function init() {
        disableGridScroll();

        // Lightweight observer watching only player element
        const playerObserver = new MutationObserver(disableGridScroll);

        // Wait for player to exist
        const checkPlayer = setInterval(() => {
            const player = document.querySelector('.html5-video-player');
            if (player) {
                clearInterval(checkPlayer);
                // Only observe the player, not entire document
                playerObserver.observe(player, {
                    attributes: true,
                    attributeFilter: ['class'] // Only watch class changes
                });
            }
        }, 500);

        // Single backup interval
        setInterval(disableGridScroll, 500);

        // Throttled scroll handler
        let scrollTimeout;
        document.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                disableGridScroll();
                scrollTimeout = null;
            }, 100);
        }, true);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
