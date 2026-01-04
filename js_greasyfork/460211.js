// ==UserScript==
// @name         Twitch Banner Remover
// @namespace    https://www.twitch.tv/
// @version      1.0
// @description  Removes Twitch Banner
// @author       You
// @match        https://www.twitch.tv/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460211/Twitch%20Banner%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/460211/Twitch%20Banner%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function checkElements() {
        const adContainer = document.querySelector('.stream-display-ad__container');
        const videoPlayer = document.querySelector('.video-player--stream-display-ad');
        if (adContainer && videoPlayer) {
            adContainer.remove();
            const observer = new ResizeObserver(() => {
                videoPlayer.style.height = '100%';
            });
            observer.observe(videoPlayer);
            return true;
        }
        return false;
    }
    const observer = new MutationObserver(() => {
        if (checkElements()) {
            observer.disconnect();
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();