// ==UserScript==
// @name         YouTube - Hide Channel Trailer
// @description  Hides the autoplay channel trailer on YouTube channel pages.
// @match        https://www.youtube.com/*
// @grant        none
// @version 0.0.1.20250625215806
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/540783/YouTube%20-%20Hide%20Channel%20Trailer.user.js
// @updateURL https://update.greasyfork.org/scripts/540783/YouTube%20-%20Hide%20Channel%20Trailer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const trailerSelector = 'ytd-channel-video-player-renderer';

    function hideTrailer() {
        const trailer = document.querySelector(trailerSelector);
        if (trailer) {
            trailer.style.setProperty('display', 'none', 'important');
            const video = trailer.querySelector('video');
            if (video) {
                video.pause();
                video.muted = true;
            }
        }
    }

    // Use MutationObserver to detect dynamic content changes
    const observer = new MutationObserver(() => {
        hideTrailer();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Listen for YouTube's own navigation event
    window.addEventListener('yt-navigate-finish', () => {
        setTimeout(hideTrailer, 500); // Delay gives time for the page to load the trailer
    });

    // Initial run (e.g., first load or hard refresh)
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(hideTrailer, 500);
    });

    console.log('[yt-no-channel-trailer] Initialized');
})();
