// ==UserScript==
// @name         Hide Partially Watched YouTube Videos
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hides watched and partially watched videos on Youtube
// @author       You
// @license      MIT
// @match        https://www.youtube.com/*
// @match        *://m.youtube.com/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1024px-YouTube_full-color_icon_%282017%29.svg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534917/Hide%20Partially%20Watched%20YouTube%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/534917/Hide%20Partially%20Watched%20YouTube%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide partially or fully watched videos
    function hideWatchedVideos() {
        // Select all videos with any watched progress
        const watchedVideos = document.querySelectorAll("ytd-thumbnail-overlay-resume-playback-renderer, ytm-thumbnail-overlay-resume-playback-renderer, yt-thumbnail-overlay-progress-bar-view-model");
        // console.log("Found watched videos:", watchedVideos);

        // Loop through and hide each watched video
        watchedVideos.forEach(video => {
            const videoParent = video.closest('ytd-rich-item-renderer') ||
                    video.closest('ytd-video-renderer') ||
                    video.closest('ytm-compact-video-renderer') ||         // mobile browser cases Chat gpt generated
                    video.closest('ytm-video-with-context-renderer');            // not even sure if you really need all of them, but they shouldn't hurt
            // console.log(videoParent);
            if (videoParent) {
                videoParent.style.display = 'none';
            }
        });
    }

    // Run on page load and whenever new content is loaded
    const observer = new MutationObserver(hideWatchedVideos);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    hideWatchedVideos();
})();
