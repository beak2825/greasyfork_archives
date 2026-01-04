// ==UserScript==
// @name         Reliable Keys for YouTube Player
// @namespace    https://youtube.com/
// @version      1.0
// @description  Removes the tabindex attribute from the YouTube player's controls, so that left/right keys always perform seeking and up/down keys always perform volume adjustments.
// @author       timtimtimaroo
// @match        *://www.youtube.com/*
// @grant        none
// @license      copyright
// @downloadURL https://update.greasyfork.org/scripts/526801/Reliable%20Keys%20for%20YouTube%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/526801/Reliable%20Keys%20for%20YouTube%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeTabindex() {
        ['.ytp-progress-bar', '.ytp-volume-panel'].flatMap(s => [...document.querySelectorAll(s)]).forEach(panel => {
            if (panel.hasAttribute('tabindex')) {
                panel.removeAttribute('tabindex');
                console.log("[Reliable Keys for YouTube Player] Removed tabindex from:", panel);
            }
        });
    }

    // Run once on load
    removeTabindex();

    // Observe for changes in the page (useful for SPA behavior)
    const observer = new MutationObserver(removeTabindex);
    observer.observe(document.body, { childList: true, subtree: true });

})();


