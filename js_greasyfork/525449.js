// ==UserScript==
// @name         Missav keeps playing
// @namespace    http://tampermonkey.net/
// @version      2025-01-31
// @description  Let videos keeps playing after losing focus
// @author       zqi
// @match        https://missav.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=missav.ai
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/525449/Missav%20keeps%20playing.user.js
// @updateURL https://update.greasyfork.org/scripts/525449/Missav%20keeps%20playing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        console.log('[Debug] DOM loaded');
        initPlayerObserver();
    });

    function initPlayerObserver() {
        const observer = new MutationObserver(() => {
            if (window.player?.pause) {
                console.log('[Debug] Player detected');
                overridePause();
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
        if (window.player) overridePause();
    }

    function overridePause() {
        try {
            const originalPause = window.player.pause.bind(window.player);
            Object.defineProperty(window.player, 'pause', {
                value: function() {
                    console.log('[Debug] Pause called. Focus:', document.hasFocus());
                    if (document.hasFocus()) originalPause();
                },
                writable: false,
                configurable: false
            });
            console.log('[Debug] Pause overridden');
        } catch (e) {
            console.error('[Debug] Override error:', e);
        }
    }

    setInterval(() => {
        if (!window.player?.pause?.toString().includes('Focus:')) {
            console.log('[Debug] Pause was reset! Re-overriding...');
            overridePause();
        }
    }, 2000);
})();