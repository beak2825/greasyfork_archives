// ==UserScript==
// @name         YouTube: Remove Videos Based on Duration
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove too short or too long videos from your YouTube's recommendation
// @author       Timothy (kuronek0zero)
// @namespace    https://github.com/kuronekozero/youtube-remove-short-long-videos/tree/main
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478560/YouTube%3A%20Remove%20Videos%20Based%20on%20Duration.user.js
// @updateURL https://update.greasyfork.org/scripts/478560/YouTube%3A%20Remove%20Videos%20Based%20on%20Duration.meta.js
// ==/UserScript==

(function() {
    const userMinVideoDuration = 120; // Minimum duration in seconds (1 minute)
    // const userMaxVideoDuration = 600; // Maximum duration in seconds (10 minutes) uncomment this part if you want to also remove too long videos

    function getDurationInSeconds(durationText) {
        const timeParts = durationText.split(":").map(Number);
        if (timeParts.length === 2) {
            return timeParts[0] * 60 + timeParts[1]; // MM:SS
        } else if (timeParts.length === 3) {
            return timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]; // HH:MM:SS
        }
        return 0;
    }

    function removeVideos() {
        const videos = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-rich-item-renderer');

        videos.forEach(video => {
            const durationElement = video.querySelector('.badge-shape-wiz__text');
            if (durationElement) {
                const durationText = durationElement.textContent.trim();
                const durationInSeconds = getDurationInSeconds(durationText);

                if (durationInSeconds < userMinVideoDuration /* || durationInSeconds > userMaxVideoDuration */ ) {
                    video.style.display = 'none';
                }
            }
        });
    }

    // Run the script every 3 seconds to remove videos dynamically
    setInterval(removeVideos, 3000);
})();