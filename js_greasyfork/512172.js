// ==UserScript==
// @name         Hide Watched YouTube Videos from Recommendations
// @namespace    https://tampermonkey.net/
// @version      2.1
// @description  Hide YouTube videos you've already watched from the recommendations
// @author       Nyxia
// @match        *://www.youtube.com/*
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_log
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/512172/Hide%20Watched%20YouTube%20Videos%20from%20Recommendations.user.js
// @updateURL https://update.greasyfork.org/scripts/512172/Hide%20Watched%20YouTube%20Videos%20from%20Recommendations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide watched videos
    const hideWatchedVideos = () => {
        // Select all video items in the recommendation sections
        const videoItems = document.querySelectorAll('ytd-grid-video-renderer, ytd-compact-video-renderer, ytd-video-renderer');

        videoItems.forEach(video => {
            try {
                // Check if the video has a "watched" label (e.g., 'progress-bar' element indicating it's been watched)
                const progressBar = video.querySelector('.ytd-thumbnail-overlay-resume-playback-renderer');

                // If the video has been partially or fully watched, hide it
                if (progressBar) {
                    video.style.display = 'none';  // Hide the watched video
                    GM_log('Hiding watched video:', video);
                }
            } catch (error) {
                // Log any potential errors for debugging
                console.error('Error hiding watched video:', error);
            }
        });
    };

    // MutationObserver to watch for page updates (e.g., infinite scroll loading more videos)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            hideWatchedVideos();  // Reapply the function every time the page updates
        });
    });

    // Start observing the document for changes in child elements (like new video recommendations)
    observer.observe(document, {
        childList: true,
        subtree: true
    });

    // Initial call to hide videos when the script is first loaded
    hideWatchedVideos();
})();
