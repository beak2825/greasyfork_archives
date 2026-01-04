// ==UserScript==
// @name         Coursera Custom Subtitles with Video and Mouse Control
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Customize subtitles on Coursera videos with line breaks and video control shortcuts (command+left/right for rewind/forward 5 seconds, command+up/down for speed control, space for play/pause, mouse buttons for control)
// @author       readpan@gmail.com
// @match        https://www.coursera.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503259/Coursera%20Custom%20Subtitles%20with%20Video%20and%20Mouse%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/503259/Coursera%20Custom%20Subtitles%20with%20Video%20and%20Mouse%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add custom subtitle container
    function addSubtitleContainer(video) {
        if (!video) return;

        // Check if a subtitle container already exists
        if (video.parentElement.querySelector('#subtitle-container')) {
            return;
        }

        const subtitleContainer = document.createElement('div');
        subtitleContainer.id = 'subtitle-container';
        subtitleContainer.style.position = 'absolute';
        subtitleContainer.style.bottom = '30px'; // Adjust this value to change subtitle position
        subtitleContainer.style.width = '100%';
        subtitleContainer.style.textAlign = 'center';
        subtitleContainer.style.color = 'white';
        subtitleContainer.style.background = 'rgba(0, 0, 0, 0.7)';
        subtitleContainer.style.fontSize = '30px'; // Set subtitle font size
        subtitleContainer.style.pointerEvents = 'none';
        subtitleContainer.style.zIndex = '1000'; // Ensure subtitle container is on top

        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(subtitleContainer);

        const tracks = video.querySelectorAll('track');
        tracks.forEach(track => {
            track.addEventListener('load', () => {
                const textTrack = track.track;
                textTrack.mode = 'hidden'; // Hide default subtitles

                // Listen to cue change for each track
                textTrack.addEventListener('cuechange', () => {
                    if (textTrack.mode === 'hidden') {
                        const activeCues = textTrack.activeCues;
                        if (activeCues.length > 0) {
                            subtitleContainer.innerHTML = formatSubtitles(activeCues[0].text);
                        } else {
                            subtitleContainer.textContent = '';
                        }
                    }
                });
            });
        });

        // Function to handle track change
        function onTrackChange() {
            tracks.forEach(track => {
                const textTrack = track.track;
                if (textTrack.mode === 'showing') {
                    textTrack.mode = 'hidden'; // Hide default subtitles
                    const activeCues = textTrack.activeCues;
                    if (activeCues.length > 0) {
                        subtitleContainer.innerHTML = formatSubtitles(activeCues[0].text);
                    } else {
                        subtitleContainer.textContent = '';
                    }
                }
            });
        }

        // Listen for changes in track selection
        video.textTracks.addEventListener('change', onTrackChange);
    }

    // Function to format subtitles with line breaks
    function formatSubtitles(text) {
        return text.replace(/\n/g, '<br>');
    }

    // Initialize subtitle container for all existing video elements
    function initializeSubtitles() {
        const videos = document.querySelectorAll('video');
        videos.forEach((video) => {
            addSubtitleContainer(video);
        });
    }

    // Function to handle keyboard shortcuts for video control
    function handleKeyboardShortcuts(event) {
        const videos = document.querySelectorAll('video');
        if ((event.metaKey || event.ctrlKey) && (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
            event.preventDefault(); // Prevent default browser action (navigation)
            videos.forEach(video => {
                if (event.key === 'ArrowLeft') {
                    video.currentTime = Math.max(0, video.currentTime - 5);
                } else if (event.key === 'ArrowRight') {
                    video.currentTime = Math.min(video.duration, video.currentTime + 5);
                } else if (event.key === 'ArrowUp') {
                    video.playbackRate = Math.min(5, video.playbackRate + 0.25);
                } else if (event.key === 'ArrowDown') {
                    video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
                }
            });
        }
    }

    // Function to handle mouse buttons for video control
    function handleMouseButtons(event) {
        const videos = document.querySelectorAll('video');
        if (event.button === 3) { // Mouse back button
            event.preventDefault(); // Prevent default browser action (navigation)
            event.stopPropagation(); // Stop event propagation
            videos.forEach(video => {
                video.currentTime = Math.max(0, video.currentTime - 5);
            });
        } else if (event.button === 4) { // Mouse forward button
            event.preventDefault(); // Prevent default browser action (navigation)
            event.stopPropagation(); // Stop event propagation
            videos.forEach(video => {
                video.currentTime = Math.min(video.duration, video.currentTime + 5);
            });
        } else if (event.button === 1) { // Mouse middle button
            event.preventDefault(); // Prevent default action
            event.stopPropagation(); // Stop event propagation
            videos.forEach(video => {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });
        }
    }

    // Observe the body for added video elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.tagName === 'VIDEO') {
                    addSubtitleContainer(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('video').forEach((video) => {
                        addSubtitleContainer(video);
                    });
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initialize subtitles for existing videos
    initializeSubtitles();

    // Add event listener for keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Add event listener for mouse buttons
    // document.addEventListener('mousedown', handleMouseButtons);
    document.addEventListener('mouseup', handleMouseButtons);
})();
