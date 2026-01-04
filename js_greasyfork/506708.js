// ==UserScript==
// @name         TikTok Live Auto Like
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically clicks the like button on TikTok live streams in a loop
// @author       David Dominguez
// @match        https://www.tiktok.com/*/live
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506708/TikTok%20Live%20Auto%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/506708/TikTok%20Live%20Auto%20Like.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const clicksPerBatch = 100;
    const restTime = 20000; // 20 seconds in milliseconds

    function clickLikeButton() {
        const likeButton = document.querySelector('[data-e2e="like-btn"]');
        if (likeButton) {
            for (let i = 0; i < clicksPerBatch; i++) {
                likeButton.click();
            }
        }
    }

    function startLoop() {
        clickLikeButton();
        setTimeout(startLoop, restTime);
    }

    // Inicia el loop
    startLoop();
})();
