// ==UserScript==
// @name         YouTube Auto HD (m.youtube.com)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Force highest quality on YouTube mobile site
// @author       MIT
// @license      MIT
// @match        https://m.youtube.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546067/YouTube%20Auto%20HD%20%28myoutubecom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546067/YouTube%20Auto%20HD%20%28myoutubecom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setQuality() {
        const player = document.querySelector('video');
        if (player && player.getAvailableQualityLevels) {
            const qualities = player.getAvailableQualityLevels();
            if (qualities && qualities.length > 0) {
                const best = qualities[0]; // first item is highest quality
                player.setPlaybackQuality(best);
                player.setPlaybackQualityRange(best);
            }
        }
    }

    // Run when video starts
    const observer = new MutationObserver(() => {
        const video = document.querySelector('video');
        if (video) {
            setQuality();
            video.addEventListener('loadeddata', setQuality, { once: true });
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();