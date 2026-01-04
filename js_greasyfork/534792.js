// ==UserScript==
// @license MIT
// @name         Mega.nz Autoplay
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script auto-plays the next video on Mega.nz, shows status updates like when a video plays or ends, and lets you hide or show the messages by pressing "T".
// @author       fiuxxed
// @match        https://mega.nz/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/534792/Meganz%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/534792/Meganz%20Autoplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the status bot div
    const statusBot = document.createElement('div');
    statusBot.style.position = 'fixed';
    statusBot.style.top = '10px';
    statusBot.style.left = '10px';
    statusBot.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    statusBot.style.color = 'white';
    statusBot.style.padding = '10px';
    statusBot.style.fontSize = '14px';
    statusBot.style.borderRadius = '5px';
    statusBot.style.zIndex = '9999'; // Ensures it's always on top of everything else
    statusBot.style.pointerEvents = 'none'; // Avoids blocking any interaction with other page elements
    statusBot.style.opacity = '0'; // Initially set to invisible
    statusBot.style.transition = 'opacity 0.5s ease-in-out'; // Default fade transition
    document.body.appendChild(statusBot);

    // Create the text that appears when the script loads
    const infoText = document.createElement('div');
    infoText.style.position = 'fixed';
    infoText.style.top = '55px';
    infoText.style.left = '10px';
    infoText.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    infoText.style.color = 'white';
    infoText.style.padding = '10px';
    infoText.style.fontSize = '14px';
    infoText.style.borderRadius = '5px';
    infoText.style.zIndex = '10000'; // A bit above the status bot
    infoText.style.opacity = '0'; // Initially set to invisible
    infoText.style.transition = 'opacity 1s ease-in-out'; // Fade in and out smoothly
    infoText.innerText = 'Click T to hide/view autoplay text'; // The message text
    document.body.appendChild(infoText);
    let statusVisible = true;
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 't') {
        statusVisible = !statusVisible;
        statusBot.style.display = statusVisible ? 'block' : 'none';
    }
});


    // Function to fade in and fade out the info text
    function showInfoText() {
        // Fade in the text
        infoText.style.opacity = '1';

        // Wait for 3 seconds, then fade out
        setTimeout(() => {
            infoText.style.opacity = '0';
        }, 3000); // 3 seconds visible
    }

    // Call the function to show the text on load
    showInfoText();

    let currentStatus = '';
    let isPlaying = false;
    let isPaused = false;
    let nextClicked = false;
    let isVideoClosed = false;

    // Update the bot text function with emojis based on the status
    function updateStatus(text, emoji, isFastFade = false) {
        if (currentStatus !== text) {
            // Change the fade duration if it's a fast fade (e.g., switching play/pause)
            statusBot.style.transition = isFastFade ? 'opacity 0.1s ease-in-out' : 'opacity 0.5s ease-in-out'; // 0.1s for fast fade

            // Fade out the current status box
            statusBot.style.opacity = '0';

            // Wait for the current status box to fade out before updating the text
            setTimeout(() => {
                // Update the status with the new text and emoji
                statusBot.innerText = `${emoji} ${text}`;
                currentStatus = text;

                // Fade in the new status box
                statusBot.style.opacity = '1';
            }, 100); // Wait for 0.1 seconds (duration of fast fade-out for play/pause transitions)
        }
    }

    // Initial message when the script is working
    updateStatus('Script is working. Checking video elements...', '✅');

    // Detect the "X" button and handle video closing
    function detectXButton() {
        const closeButton = document.querySelector('button.v-btn.simpletip.close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                isVideoClosed = true; // Mark that the video was closed
                isPlaying = false;
                isPaused = false;
                updateStatus('Waiting for video...', '⏳'); // Set to "Waiting for video..." when video is closed
            });
        }
    }

    // Function to check for the video element
    function checkForVideo() {
        const videoElement = document.querySelector('video');
        const nextButton = document.querySelector('button.gallery-btn.next[aria-label="[[next]]"]');
        const playButton = document.querySelector('div.play-video-button'); // Target the play button using its class

        // If no video element is found, reset status and flag
        if (!videoElement) {
            if (isPlaying || isPaused) {
                isPlaying = false;
                isPaused = false;
                updateStatus('Waiting for video...', '⏳'); // Update status to "Waiting for video..."
            }
            return; // Stop further execution
        }

        // If the video element reappears (after being closed), handle its state
        if (isVideoClosed) {
            updateStatus('Waiting for video...', '⏳');
            isVideoClosed = false; // Reset flag after handling
        }

        // If we find the video element and it's playing, handle play/ended events
        videoElement.addEventListener('play', () => {
            if (!isVideoClosed) {
                isPlaying = true;
                isPaused = false;
                updateStatus('Video is playing...', '▶️', true); // Faster fade when switching to play
            }
        });

        videoElement.addEventListener('pause', () => {
            if (!isVideoClosed) {
                isPlaying = false;
                isPaused = true;
                updateStatus('Video is paused...', '⏸️', true); // Faster fade when switching to pause
            }
        });

        videoElement.addEventListener('ended', () => {
            isPlaying = false;
            isPaused = false;
            updateStatus('Video has ended...', '🔚'); // Change emoji to 🔚 for video has ended

            // Click the next button after the video ends, only if not already clicked
            if (nextButton && !nextClicked) {
                nextClicked = true; // Prevent multiple clicks
                nextButton.click();
                updateStatus('Auto playing next video...', '⏭️');

                // Wait for the next video to load and then click play
                setTimeout(() => {
                    if (playButton) {
                        playButton.click(); // Click the play button
                        updateStatus('Play button clicked. Video is playing...', '▶️');
                    } else {
                        updateStatus('Play button not found.', '❌');
                    }
                }, 1000); // Wait for the next video to load
            } else {
                updateStatus('Next video button not found or already clicked.', '❌');
            }

            // Reset to "Waiting for video..." after the video ends
            setTimeout(() => {
                updateStatus('Waiting for video...', '⏳');
                nextClicked = false; // Reset the flag after a new video is loaded
            }, 1000);
        });

        // If we find a video element but it's not playing or paused, show waiting status
        if (!isPlaying && !isPaused && !isVideoClosed) {
            updateStatus('Waiting for video...', '⏳');
        }
    }

    // Check periodically for the video element
    setInterval(() => {
        detectXButton(); // Detect and handle X button click
        checkForVideo(); // Check for video element and handle play/next
    }, 1000);
})();

/*
MIT License

Copyright (c) 2025 [Your Name or Username]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights 
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
copies of the Software, and to permit persons to whom the Software is 
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in 
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
*/
