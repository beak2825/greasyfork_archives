// ==UserScript==
// @name         AnimeFLV-auto-skip-Mega-addon
// @namespace    https://grayapps.es/
// @version      0.0.1
// @description  Set video on fullscreen and send data to AnimeFLV addon
// @author       Javiergg
// @match        https://mega.nz/embed/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502764/AnimeFLV-auto-skip-Mega-addon.user.js
// @updateURL https://update.greasyfork.org/scripts/502764/AnimeFLV-auto-skip-Mega-addon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Mega Video Addon running");
    let interval = undefined;

    function logVideoTimes() {
        const video = document.querySelector('video');
        if (video) {
            // Ensure the video is loaded
            video.addEventListener('loadedmetadata', function() {
                if (interval) {
                    clearInterval(interval);
                }
                interval = setInterval(() => {
                    const data = {
                        currentTime: video.currentTime,
                        duration: video.duration
                    };
                    window.parent.postMessage({ type: 'VIDEO_DATA', data: data }, '*');
                }, 1000);

                // Autoplay the video
                video.play().catch(error => {
                    console.log('Autoplay failed:', error);
                });

                // Enter fullscreen mode
                if (video.requestFullscreen) {
                    video.requestFullscreen().catch(error => {
                        console.log('Fullscreen request failed:', error);
                    });
                } else if (video.mozRequestFullScreen) { // Firefox
                    video.mozRequestFullScreen().catch(error => {
                        console.log('Fullscreen request failed:', error);
                    });
                } else if (video.webkitRequestFullscreen) { // Chrome, Safari and Opera
                    video.webkitRequestFullscreen().catch(error => {
                        console.log('Fullscreen request failed:', error);
                    });
                } else if (video.msRequestFullscreen) { // IE/Edge
                    video.msRequestFullscreen().catch(error => {
                        console.log('Fullscreen request failed:', error);
                    });
                }
            });
        } else {
            console.log("No video element found.");
        }
    }

    // Attempt to log times when the DOM is loaded
    window.addEventListener('load', function() {
        logVideoTimes();
    });

    const observer = new MutationObserver(logVideoTimes);
    observer.observe(document.body, { childList: true, subtree: true });
})();
