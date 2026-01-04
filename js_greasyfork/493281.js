// ==UserScript==
// @name         Acellus Auto 1.5x Speed Increase
// @namespace    https://greasyfork.org/en/users/1291009
// @version      1.5
// @description  Automatically speed up the video to 1.5x for a more comfortable experience!
// @match        https://admin192c.acellus.com/student/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acellus.com
// @author       BadOrBest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/493281/Acellus%20Auto%2015x%20Speed%20Increase.user.js
// @updateURL https://update.greasyfork.org/scripts/493281/Acellus%20Auto%2015x%20Speed%20Increase.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Inject CSS for animations
    const style = document.createElement('style');
    style.innerHTML = `
        /* Playback Speed Notification */
        #playback-speed-notification {
            position: fixed;
            bottom: 10px;
            left: 10px;
            padding: 5px 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 14px;
            border-radius: 5px;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            z-index: 9999;
        }

        /* Highlight for media elements */
        .media-highlight {
            outline: 3px solid rgba(0, 150, 250, 0.7);
            transition: outline 0.5s ease-in-out;
        }

        /* Spinner while waiting for media */
        #media-spinner {
            position: fixed;
            bottom: 10px;
            right: 10px;
            width: 30px;
            height: 30px;
            border: 3px solid rgba(0, 0, 0, 0.3);
            border-top-color: rgba(0, 150, 250, 0.8);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
            z-index: 9999;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Create playback speed notification element
    const notification = document.createElement('div');
    notification.id = 'playback-speed-notification';
    document.body.appendChild(notification);

    // Define the default playback speed
    const defaultSpeed = 1.5;

    // Define the minimum and maximum allowed speeds
    const minSpeed = 0.5;
    const maxSpeed = 2.0;

    // Track how many times the notification has appeared
    let notificationCount = 0;
    const maxNotifications = 2;

    // Function to set the playback speed
    function setSpeed(speed) {
        if (speed >= minSpeed && speed <= maxSpeed) {
            const videoContainers = document.querySelectorAll('video, [class*="plyr"], [class*="media"]');
            videoContainers.forEach(container => {
                if (container.tagName.toLowerCase() === 'video') {
                    container.playbackRate = speed;
                } else {
                    const video = container.querySelector('video');
                    if (video) {
                        video.playbackRate = speed;
                    }
                }
            });
            showPlaybackSpeedNotification(speed);
        } else {
            console.error(`Playback speed should be between ${minSpeed}x and ${maxSpeed}x`);
        }
    }

    // Function to show playback speed notification
    function showPlaybackSpeedNotification(speed) {
        // Only show the notification if it hasn't appeared too many times
        if (notificationCount < maxNotifications) {
            notification.innerText = `Playback Speed: ${speed}x`;
            notification.style.opacity = 1;
            setTimeout(() => {
                notification.style.opacity = 0;
            }, 2000); // Show for 2 seconds
            notificationCount++;
        }
    }

    // Function to continuously monitor and adjust playback speed with some randomness
    function monitorSpeed() {
        const interval = 1000 + Math.floor(Math.random() * 1000); // Random interval between 1 and 2 seconds
        setInterval(() => {
            setSpeed(defaultSpeed);
        }, interval);
    }

    // Function to check for URL changes and restart the script
    function checkURLChange() {
        const currentURL = window.location.href;
        if (checkURLChange.lastURL !== currentURL) {
            clearInterval(monitorInterval);
            monitorSpeed();
            checkURLChange.lastURL = currentURL;
            showPlaybackSpeedNotification(defaultSpeed); // Notify the change
        }
        setTimeout(checkURLChange, 1000); // Check every second
    }

    // Initialize the lastURL variable with the current URL
    checkURLChange.lastURL = window.location.href;

    // Start checking for URL changes
    checkURLChange();

    // Check for the presence of media player
    function waitForMediaPlayer() {
        const videoContainers = document.querySelectorAll('video, [class*="plyr"], [class*="media"]');
        if (videoContainers.length === 0) {
            // Show spinner while waiting for media
            document.getElementById('media-spinner').style.opacity = 1;
            setTimeout(waitForMediaPlayer, 1000); // Check again after 1 second
        } else {
            // Hide spinner
            document.getElementById('media-spinner').style.opacity = 0;
            // Start monitoring playback speed
            monitorSpeed();
        }
    }

    // Create and append the spinner
    const spinner = document.createElement('div');
    spinner.id = 'media-spinner';
    document.body.appendChild(spinner);

    // Start waiting for media player
    waitForMediaPlayer();

})();
