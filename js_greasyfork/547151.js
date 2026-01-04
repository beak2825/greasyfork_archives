// ==UserScript==
// @name         Patreon Audio Fix
// @namespace    http://tampermonkey.net/
// @version      1.2
 // @license     MIT
// @description  Forces videos on Patreon to unmute automatically and sets a default volume when they start playing.
// @author       google Gemini
// @match        *://*.patreon.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547151/Patreon%20Audio%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/547151/Patreon%20Audio%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to unmute a video and set its volume
    function forceUnmute(videoElement) {
        // Check if the video is actually muted or its volume is zero
        if (videoElement.muted || videoElement.volume === 0) {
            console.log('Patreon Audio Fix: Muted video detected, forcing unmute and setting volume.');
            videoElement.muted = false;
            // Set the volume to 75%. Adjust this value (0.0 to 1.0) to your preference.
            videoElement.volume = 0.75;
        }
    }

    // We use a MutationObserver to watch the page
    // for new videos that are loaded dynamically.
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    // Check if the new node is a video element itself, or if it contains video elements
                    if (node.nodeType === 1) { // Ensure it's an element node
                        const videos = (node.tagName === 'VIDEO') ? [node] : node.querySelectorAll('video');
                        videos.forEach(video => {
                            // Add an event listener that triggers when the video starts playing
                            video.addEventListener('play', () => forceUnmute(video), { once: true });
                        });
                    }
                });
            }
        }
    });

    // Start the observer to watch the entire page for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();