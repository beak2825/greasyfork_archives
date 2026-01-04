// ==UserScript==
// @name         Hide Premiere/Upcoming Videos in YouTube Search results until they release.
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Hide Premiere/Upcoming Videos in YouTube Search results until they release. It doesn't hide normal and live videos.
// @license      MIT
// @icon         https://www.youtube.com/favicon.ico
// @author       Valryx
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502728/Hide%20PremiereUpcoming%20Videos%20in%20YouTube%20Search%20results%20until%20they%20release.user.js
// @updateURL https://update.greasyfork.org/scripts/502728/Hide%20PremiereUpcoming%20Videos%20in%20YouTube%20Search%20results%20until%20they%20release.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let counter = 0;

    function hideNoDurationAndUpcomingVideos() {
        const videoItems = document.querySelectorAll('ytd-video-renderer, ytd-grid-video-renderer, ytd-compact-video-renderer');

        videoItems.forEach((item, index) => {
            const durationElement = item.querySelector('span.ytd-thumbnail-overlay-time-status-renderer');
            const durationText = durationElement ? durationElement.textContent.trim() : '';
            const viewCountElement = item.querySelector('span.ytd-video-meta-block');
            const viewCountText = viewCountElement ? viewCountElement.textContent.trim() : '';
            const titleElement = item.querySelector('a#video-title');
            const videoTitle = titleElement ? titleElement.textContent.trim() : 'Unknown Title';

            // Step 1: Check if Duration is Valid
            const validDuration = /^\d{1,2}:\d{2}(?::\d{2})?$/.test(durationText);
            if (validDuration) {
                // console.log(`Video ${index}: Valid Duration: ${durationText}. Status: VISIBLE. \nTitle: "${videoTitle}" \nViews: "${viewCountText}"`);
                return;
            }

            // Step 2: Check if the Video is Live
            if (viewCountText.includes('watching')) {
                // console.log(`Video ${index}: Live Video. Status: VISIBLE. \nTitle: "${videoTitle}" \nViews: "${viewCountText}"`);
                return;
            }

            // Step 3: Check if the Video is Scheduled
            if (viewCountText.includes('Scheduled')) {
                // console.log(`Video ${index}: Scheduled Video. Status: HIDDEN. \nTitle: "${videoTitle}" \nViews: "${viewCountText}"`);
                item.style.display = 'none';
                return;
            }

            if (viewCountText.includes('Premieres')) {
                // console.log(`Video ${index}: Premieres Video. Status: HIDDEN. \nTitle: "${videoTitle}" \nViews: "${viewCountText}"`);
                item.style.display = 'none';
                return;
            }

            // Else: Show the Video
            // console.log(`Video ${index}: Not Scheduled, Not Live, Invalid Duration. Status: VISIBLE. \nTitle: "${videoTitle}" \nViews: "${viewCountText}"`);
            // The video is shown by default, so no need to hide it here.
        });
    }

    function initializeScript() {
        // console.log("Initializing script...");
        hideNoDurationAndUpcomingVideos();
    }

    window.addEventListener('load', initializeScript);

    // Fallback to periodically reinitialize if the script seems inactive
    const intervalId = setInterval(() => {
        // console.log("Periodic reinitialization check...");
        initializeScript();
        counter += 1;

        // If the counter reaches 5, clear the current interval and set a new one with a 5-second delay
        if (counter >= 5) {
            clearInterval(intervalId);
            setInterval(() => {
                // console.log("Switching to recheck every 5 seconds...");
                initializeScript();
            }, 5000); // Switch to every 5 seconds
        }
    }, 1000); // Initial check every 1 second

})();
