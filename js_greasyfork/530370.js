// ==UserScript==
// @name         YouTube Playlist Auto Skip Watched
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Automatically skips to the next video in a YouTube playlist if the current video is marked as watched (progress bar width > 5%).
// @author       You
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530370/YouTube%20Playlist%20Auto%20Skip%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/530370/YouTube%20Playlist%20Auto%20Skip%20Watched.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function skipWatchedVideo() {
        // Get all playlist items
        const playlistItemsVar = document.querySelectorAll('.playlist-items > ytd-playlist-panel-video-renderer');
        for (const item of playlistItemsVar) {
            // Check if this item is the currently playing video
            const playingIndicatorVar = item.querySelector('span#index.style-scope.ytd-playlist-panel-video-renderer');
            
            if (playingIndicatorVar && playingIndicatorVar.textContent.includes('▶')) {
                // Found the currently playing video
                const progressBarVar = item.querySelector('#progress.style-scope.ytd-thumbnail-overlay-resume-playback-renderer');
                if (progressBarVar) {
                    const widthStyleVar = progressBarVar.getAttribute('style');
                    console.log('Current video progress bar: ', widthStyleVar);

                    if (widthStyleVar) {
                        const widthMatch = widthStyleVar.match(/width: (\d+)%/);
                        if (widthMatch && parseInt(widthMatch[1]) > 5) {
                            console.log('Watched video (progress > 5%) detected. Skipping to the next.');
                            // Find the "Next" button
                            const nextButton = document.querySelector('.ytp-next-button'); // This is a common class for the next button

                            if (nextButton) {
                                nextButton.click();
                                // To avoid immediately triggering again, we can break the loop or add a short delay
                                break;
                            } else {
                                console.log('Could not find the "Next" button.');
                            }
                            // To avoid immediately triggering again, we can break the loop or add a short delay
                            break;
                        }
                    }
                }
                // If the currently playing video doesn't have a progress bar > 5%, we don't need to check others
                break;
            }
        }
    }

    // Run the check every 10 seconds
    setInterval(skipWatchedVideo, 10000);
})();