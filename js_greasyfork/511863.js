// ==UserScript==
// @name         Video Speeder
// @namespace    leyuskc.video-speeder
// @version      2024-05-22
// @description  Control video playback speed on any website, including advertisements. Seamlessly adjust video playback rates to suit your viewing preferences without being restricted by website constraints or ad blockers.
// @author       leyuskc
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @contact     mailto:leyuskc@example.com
// @supportURL   https://twitter.com/leyuskc
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511863/Video%20Speeder.user.js
// @updateURL https://update.greasyfork.org/scripts/511863/Video%20Speeder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to control video playback based on key input
    const controlVideo = (key) => {
        // Get all the video elements
        const videos = document.querySelectorAll("video");

        // Helper function to apply changes to each video element
        const applyToVideos = (action,must_be_playing) => {
            videos.forEach(video => {
                if (must_be_playing && !video.paused) {
                    action(video);
                }else if(!must_be_playing){
                    action(video)
                }
            });
        };

        switch (key.toUpperCase()) {
            case 'S':
                // Increase playback rate
                applyToVideos(video => video.playbackRate += 0.25,true);
                break;
            case 'A':
                // Decrease playback rate
                applyToVideos(video => video.playbackRate -= 0.25,true);
                break;
            case 'Z':
                // Rewind 5 seconds
                applyToVideos(video => video.currentTime -= 5,true);
                break;
            case 'C':
                // Fast forward 5 seconds
                applyToVideos(video => video.currentTime += 5,true);
                break;
            case 'Q':
                // Toggle play/pause
                applyToVideos(video => video.paused ? video.play() : video.pause(),false);
                break;
            case 'D':
                // Toggle mute/unmute
                applyToVideos(video => video.muted = !video.muted,true);
                break;
        }
    };

    // Listen for keyup events, ignoring when the active element is an input field
    document.addEventListener('keyup', (event) => {
        if (document.activeElement.tagName.toLowerCase() !== 'input') {
            controlVideo(event.key);
        }
    });

})();
