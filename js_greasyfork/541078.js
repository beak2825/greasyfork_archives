// ==UserScript==
// @name         Stop YouTube Shorts Auto Loop
// @namespace    Stop-YouTube-Shorts-Auto-Loop
// @version      1.0
// @name:id      Hentikan Auto-Loop YouTube Shorts
// @name:en      Stop YouTube Shorts Auto-Loop
// @description  Menghentikan video Shorts agar tidak mengulang otomatis setelah selesai
// @description:id  Menghentikan video Shorts agar tidak mengulang otomatis setelah selesai
// @description:en  Prevent YouTube Shorts from looping automatically when video ends
// @author       3xploiton3
// @match        *://www.youtube.com/shorts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541078/Stop%20YouTube%20Shorts%20Auto%20Loop.user.js
// @updateURL https://update.greasyfork.org/scripts/541078/Stop%20YouTube%20Shorts%20Auto%20Loop.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            video.loop = false;

            // Remove event listeners YouTube might be adding
            video.addEventListener('ended', () => {
                console.log('Video ended – loop is disabled');
                // Optional: Pause to ensure no restart
                video.pause();
            });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
