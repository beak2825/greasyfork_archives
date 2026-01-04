// ==UserScript==
// @name         Twitch Turbo Overlay Blocker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide Twitch Turbo adblock message and dark screen overlay without removing controls
// @match        https://www.twitch.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545637/Twitch%20Turbo%20Overlay%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/545637/Twitch%20Turbo%20Overlay%20Blocker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideOverlays() {
        // Hide Turbo message
        document.querySelectorAll('.Layout-sc-1xcs6mc-0.boHJDp').forEach(el => {
            el.style.display = 'none';
            console.log('[Turbo Blocker] Hid Twitch Turbo overlay');
        });

        // Hide dark background overlays but keep their children
        document.querySelectorAll('.player-overlay-background.player-overlay-background--darkness-3').forEach(el => {
            el.style.background = 'transparent';
            el.style.pointerEvents = 'none';
            console.log('[Turbo Blocker] Neutralized dark overlay');
        });
    }

    // Initial run
    hideOverlays();

    // MutationObserver to catch future overlays
    const observer = new MutationObserver(hideOverlays);
    observer.observe(document.body, { childList: true, subtree: true });
})();
