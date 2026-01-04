// ==UserScript==
// @name         Eporner – Hide Watched Videos
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Hide or grayscale already watched videos on eporner.com
// @author       orgacord
// @match        https://www.eporner.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541068/Eporner%20%E2%80%93%20Hide%20Watched%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/541068/Eporner%20%E2%80%93%20Hide%20Watched%20Videos.meta.js
// ==/UserScript==
(function() {
    'use strict';

    /**
     * CONFIGURATION
     * Choose how watched videos are treated:
     * "hide"      → completely remove them from the grid
     * "grayscale" → keep them visible but dimmed
     */
    const HIDE_MODE = "grayscale";

    const hiddenSet = new WeakSet();

    function hideWatched() {
        let count = 0;
        document.querySelectorAll('.mb').forEach(thumb => {
            if (hiddenSet.has(thumb)) return;

            const watchedIcon = thumb.querySelector('i[title^="Watched"]');
            if (watchedIcon) {
                if (HIDE_MODE === "hide") {
                    thumb.style.display = 'none';
                } else {
                    thumb.style.filter = 'grayscale(100%)';
                    thumb.style.opacity = '0.5';
                }
                hiddenSet.add(thumb);
                count++;
            }
        });

        if (count > 0) {
            console.log(`Processed ${count} watched video(s)`);
        }
    }


    hideWatched();

    const observer = new MutationObserver(hideWatched);
    observer.observe(document.body, { childList: true, subtree: true });
})();
