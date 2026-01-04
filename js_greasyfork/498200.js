// ==UserScript==
// @name         Auto Play X (Twitter) Videos & Unmute
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Automatically play X (formerly Twitter) videos by clicking the play button
// @author       Anon1337Elite
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498200/Auto%20Play%20X%20%28Twitter%29%20Videos%20%20Unmute.user.js
// @updateURL https://update.greasyfork.org/scripts/498200/Auto%20Play%20X%20%28Twitter%29%20Videos%20%20Unmute.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a click event
    function simulateClick(element) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    // Function to play videos
    function playVideos() {
        console.log('playVideos function triggered');
        const videoContainers = document.querySelectorAll('div[data-testid="videoPlayer"]');

        console.log(`Found ${videoContainers.length} video containers`);
        videoContainers.forEach(container => {
            const video = container.querySelector('video');
            console.log('Video element:', video);

            if (video) {
                console.log('Video element found');
                const isVideoInViewport = isElementInViewport(video);

                if (isVideoInViewport) {
                    console.log('Video is in viewport');
                    // Check if the video is already playing
                    if (video.paused) {
                        console.log('Video is paused, playing');
                        // Find and click the play button (circle and path within the SVG)
                        const playButton = container.querySelector('svg');
                        if (playButton) {
                            simulateClick(playButton);
                        }
                        video.muted = false; // Unmute the video
                    } else {
                        console.log('Video is already playing');
                    }
                } else {
                    console.log('Video is not in viewport, pausing');
                    video.pause();
                }
            } else {
                console.log('Video element not found');
            }
        });
    }

    // Function to check if an element is in the viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Run the playVideos function when the page loads
    window.addEventListener('load', playVideos);

    // Optionally, run the playVideos function when the user scrolls
    window.addEventListener('scroll', playVideos);

    // Use a mutation observer to run the playVideos function when new videos are added to the DOM
    const observer = new MutationObserver(playVideos);
    observer.observe(document.body, { childList: true, subtree: true });
})();