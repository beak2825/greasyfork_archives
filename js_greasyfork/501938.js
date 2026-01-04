// ==UserScript==
// @name         YouTube Stream Timestamp Logger
// @namespace    http://tampermonkey.net/
// @version      420.69
// @description  Logs the current YouTube stream URL, timestamp, and timestamped URL in shortened format
// @author       Kai Amamiya / ModernDisappointment | using the help of ChatGPT 3.0
// @license      MIT
// @match        *://www.youtube.com/watch*
// @downloadURL https://update.greasyfork.org/scripts/501938/YouTube%20Stream%20Timestamp%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/501938/YouTube%20Stream%20Timestamp%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert seconds to HH:MM:SS.sss format
    function formatTime(seconds) {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = (seconds % 60).toFixed(3);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(6, '0')}`;
    }

    // Function to convert seconds to URL timestamp format
    function secondsToURLTimestamp(seconds) {
        return Math.floor(seconds); // Round down to the nearest whole number
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Function to log and copy the current media time and video URL
    function logVideoDetails() {
        const ytPlayer = document.querySelector('video');
        if (ytPlayer) {
            const currentTime = ytPlayer.currentTime;
            const videoURL = window.location.href;
            const timestamp = formatTime(currentTime);
            const urlTimestamp = secondsToURLTimestamp(currentTime);
            // Extract video ID from the URL
            const videoIdMatch = videoURL.match(/[?&]v=([a-zA-Z0-9_-]+)/);
            const videoId = videoIdMatch ? videoIdMatch[1] : '';
            const timestampedURL = `https://youtu.be/${videoId}?t=${urlTimestamp}`;
            const output = `Note: \nVideo URL: ${videoURL}\nTimestamp: ${timestamp}\nVideo URL w/ Time: ${timestampedURL}`;
            console.log(output);
            copyToClipboard(output);
            alert('Video URL, Timestamp, and Timestamped URL copied to clipboard!');
        } else {
            console.log('YouTube video element not found.');
        }
    }
    // Function to create or remove the button based on the page state
    function updateButton() {
        // Check if we are on a YouTube video or stream page
        const isYouTubeVideoPage = /\/watch\?v=/.test(window.location.href) || /\/live/.test(window.location.href);
        const isVideoPage = document.querySelector('video') !== null;
        const isFullscreen = document.fullscreenElement !== null;

        if (isYouTubeVideoPage && isVideoPage && !isFullscreen) {
            if (!document.getElementById('copyTimestampButton')) {
                const button = document.createElement('button');
                button.id = 'copyTimestampButton';
                button.innerHTML = 'Timestamp';
                button.style.position = 'fixed';
                button.style.bottom = '10px';
                button.style.left = '10px';
                button.style.zIndex = '9999';
                button.style.padding = '10px';
                button.style.backgroundColor = '#404040';
                button.style.color = '#FFFFFF';
                button.style.border = 'none';
                button.style.cursor = 'pointer';
                button.addEventListener('click', logVideoDetails);
                document.body.appendChild(button);
            }
        } else {
            const button = document.getElementById('copyTimestampButton');
            if (button) {
                button.remove();
            }
        }
    }

    // Set up observers to check for changes
    function setupObservers() {
        // Monitor for changes in the page that might indicate a video or fullscreen state change
        const observer = new MutationObserver(updateButton);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check for fullscreen changes
        document.addEventListener('fullscreenchange', updateButton);
    }

    // Initialize observers when the page loads
    window.addEventListener('load', setupObservers);
    // Also check initially if on a video page
    window.addEventListener('load', updateButton);
})();