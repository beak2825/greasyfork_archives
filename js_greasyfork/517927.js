// ==UserScript==
// @name         YouTube Preview Volume and Subtitles Control
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Control volume and subtitles settings of YouTube video previews
// @author       Nulmad
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517927/YouTube%20Preview%20Volume%20and%20Subtitles%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/517927/YouTube%20Preview%20Volume%20and%20Subtitles%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Desired volume level for video previews (0.0 to 1.0)
    const previewVolume = 0.13;
    let isMuted = false; // Track mute state

    // Function to set volume for all preview videos
    function setPreviewVolume() {
        document.querySelectorAll('ytd-thumbnail video, ytd-rich-grid-media video, ytd-video-preview video')
            .forEach(video => {
                video.volume = isMuted ? 0 : previewVolume;
                video.muted = isMuted;
            });
    }

    // Function to update the mute/unmute icons
    function updateSoundIcons() {
        document.querySelectorAll('ytm-mute-button button')
            .forEach(button => {
                const svg = button.querySelector('svg');
                if (svg) {
                    const path = svg.querySelector('path');
                    if (path) {
                        path.setAttribute('d', isMuted
                            ? 'M14 9.71V7.62c2 .46 3.5 2.24 3.5 4.38 0 .58-.13 1.13-.33 1.64l-1.67-1.67c-.02-1.01-.63-1.88-1.5-2.26zM19 12c0 1-.26 1.94-.7 2.77l1.47 1.47C20.54 15.01 21 13.56 21 12c0-4.08-3.05-7.44-7-7.93v2.02c2.83.48 5 2.94 5 5.91zM3.15 3.85l4.17 4.17L6.16 9H3v6h3.16L12 19.93v-7.22l2 2v1.67c.43-.1.83-.27 1.2-.48l1.09 1.09c-.68.45-1.45.78-2.28.92v2.02c1.39-.17 2.66-.71 3.73-1.49l2.42 2.42.71-.71-17-17-.72.7zm8.85.22L9.62 6.08 12 8.46V4.07z'
                            : 'M21 12c0 4.08-3.05 7.44-7 7.93v-2.02c2.83-.48 5-2.94 5-5.91s-2.17-5.43-5-5.91V4.07c3.95.49 7 3.85 7 7.93zM3 9v6h3.16L12 19.93V4.07L6.16 9H3zm11-1.38v2.09c.88.39 1.5 1.27 1.5 2.29s-.62 1.9-1.5 2.29v2.09c2-.46 3.5-2.24 3.5-4.38S16 8.08 14 7.62z'
                        );
                        button.setAttribute('aria-label', isMuted ? 'Mute' : 'Unmute');
                        button.title = isMuted ? 'Mute' : 'Unmute';
                    }
                }
            });
    }

    // Function to toggle mute/unmute icons and volume
    function toggleMuteUnmute(event) {
        isMuted = !isMuted;
        setIcon(event.currentTarget);
        setPreviewVolume();
        updateSoundIcons();
    }

    function setIcon(button) {
        const svg = button.querySelector('svg');
        if (svg) {
            const path = svg.querySelector('path');
            if (path) {
                path.setAttribute('d', isMuted
                    ? 'M14 9.71V7.62c2 .46 3.5 2.24 3.5 4.38 0 .58-.13 1.13-.33 1.64l-1.67-1.67c-.02-1.01-.63-1.88-1.5-2.26zM19 12c0 1-.26 1.94-.7 2.77l1.47 1.47C20.54 15.01 21 13.56 21 12c0-4.08-3.05-7.44-7-7.93v2.02c2.83.48 5 2.94 5 5.91zM3.15 3.85l4.17 4.17L6.16 9H3v6h3.16L12 19.93v-7.22l2 2v1.67c.43-.1.83-.27 1.2-.48l1.09 1.09c-.68.45-1.45.78-2.28.92v2.02c1.39-.17 2.66-.71 3.73-1.49l2.42 2.42.71-.71-17-17-.72.7zm8.85.22L9.62 6.08 12 8.46V4.07z'
                    : 'M21 12c0 4.08-3.05 7.44-7 7.93v-2.02c2.83-.48 5-2.94 5-5.91s-2.17-5.43-5-5.91V4.07c3.95.49 7 3.85 7 7.93zM3 9v6h3.16L12 19.93V4.07L6.16 9H3zm11-1.38v2.09c.88.39 1.5 1.27 1.5 2.29s-.62 1.9-1.5 2.29v2.09c2-.46 3.5-2.24 3.5-4.38S16 8.08 14 7.62z'
                );
                button.setAttribute('aria-label', isMuted ? 'Mute' : 'Unmute');
                button.title = isMuted ? 'Mute' : 'Unmute';
            }
        }
    }

    // Function to disable subtitles for preview videos
    function disableSubtitles() {
        document.querySelectorAll('yt-closed-captions-toggle-button button')
            .forEach(button => {
                if (button.getAttribute('aria-pressed') === 'true') {
                    button.click();
                }
            });
    }

    // Function to handle mutations
    const updateImmediately = () => {
        setPreviewVolume();
        updateSoundIcons();
        disableSubtitles();
    };

    // MutationObserver callback to check for added video elements and buttons
    const observerCallback = (mutationsList) => {
        mutationsList.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                updateImmediately();
            }
        });
    };

    // Create a MutationObserver instance
    const observer = new MutationObserver(observerCallback);

    // Start observing the document body for added nodes and subtree modifications
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial setting of the preview volume, icons, and subtitles for existing previews
    window.addEventListener('load', () => {
        setPreviewVolume();
        updateSoundIcons();
        disableSubtitles();
    });

    // Additional interval check to handle any missed previews, icon updates, and subtitles
    setInterval(updateImmediately, 500); // Faster interval for more frequent updates

})();
