// ==UserScript==
// @name         Video Speed Controller
// @namespace    http://mijikawa.top
// @version      0.11
// @description  中小学智慧教育平台加速、跳过视频，仅低于2倍速可用，跳过视频能正常答题
// @author       mijikawa
// @match        *://basic.smartedu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491096/Video%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/491096/Video%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoPauseEnabled = true; // Flag to control automatic pause behavior
    let lastPlayedVideo = null; // Variable to store the last played video element

    // Function to detect video player type
    function detectVideoPlayer() {
        const videoPlayers = {
            'html5': () => !!document.querySelector('video'), // HTML5 video player
            'youtube': () => window.location.hostname.includes('youtube.com'), // YouTube video player
            // Add more video player detection methods as needed
        };

        for (const [player, detect] of Object.entries(videoPlayers)) {
            if (detect()) {
                return player;
            }
        }

        return null; // No supported video player detected
    }

    // Function to adjust video speed based on player type
    function adjustVideoSpeed(speed) {
        const playerType = detectVideoPlayer();
        if (playerType === 'html5') {
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                video.playbackRate = speed;
            });
        } else if (playerType === 'youtube') {
            // Adjust YouTube player speed
            // Example: If using YouTube API, you can adjust speed with player.setPlaybackRate(speed);
            // For simplicity, this example doesn't include the YouTube player API integration
            console.log('Adjust YouTube player speed to ' + speed);
        }
        // Add more cases for other video player types as needed
    }

    // Create the floating control for toggling automatic pause
    const autoPauseControl = document.createElement('div');
    autoPauseControl.style.position = 'fixed';
    autoPauseControl.style.top = '20px';
    autoPauseControl.style.right = '20px';
    autoPauseControl.style.backgroundColor = '#ffffff';
    autoPauseControl.style.padding = '10px';
    autoPauseControl.style.border = '1px solid #000000';
    autoPauseControl.style.zIndex = '9999'; // Set z-index to a high value
    autoPauseControl.innerHTML = `
        <button id="autoPauseToggle">Auto Pause: ${autoPauseEnabled ? 'On' : 'Off'}</button>
    `;
    document.body.appendChild(autoPauseControl);

    // Function to toggle automatic pause behavior
    function toggleAutoPause() {
        autoPauseEnabled = !autoPauseEnabled;
        document.getElementById('autoPauseToggle').textContent = `Auto Pause: ${autoPauseEnabled ? 'On' : 'Off'}`;
    }

    // Listen for click event on auto pause toggle button
    document.getElementById('autoPauseToggle').addEventListener('click', toggleAutoPause);

    // Function to pause all videos
    function pauseAllVideos() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
        });
    }

    // Listen for visibility change to pause videos when the page is hidden
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden' && autoPauseEnabled) {
            pauseAllVideos();
        }
    });

    // Function to adjust video speed based on user selection
    function adjustVideoSpeedOnSelection(speed) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.playbackRate = speed;
        });
    }

    // Create the floating control for adjusting video speed
    const speedControl = document.createElement('div');
    speedControl.style.position = 'fixed';
    speedControl.style.top = '60px';
    speedControl.style.right = '20px';
    speedControl.style.backgroundColor = '#ffffff';
    speedControl.style.padding = '10px';
    speedControl.style.border = '1px solid #000000';
    speedControl.style.zIndex = '9999'; // Set z-index to a high value
    speedControl.innerHTML = `
        <label for="speed">Speed:</label>
        <select id="speed">
            <option value="0.25">0.25x</option>
            <option value="0.5">0.5x</option>
            <option value="1" selected>1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
            <option value="4">4x</option>
            <option value="8">8x</option>
            <option value="16">16x</option>
        </select>
    `;
    document.body.appendChild(speedControl);

    // Listen for changes in the speed selection
    document.getElementById('speed').addEventListener('change', function() {
        const selectedSpeed = parseFloat(this.value);
        adjustVideoSpeedOnSelection(selectedSpeed);
    });

    // Function to skip video
    function skipVideo() {
        let video = document.getElementsByTagName('video')[0];
        video.currentTime = video.duration;
    }

    // Create the floating control for skipping video
    const skipButton = document.createElement('button');
    skipButton.innerText = 'Skip Video';
    skipButton.style.position = 'fixed';
    skipButton.style.top = '100px'; // Adjust top position as needed
    skipButton.style.right = '20px';
    skipButton.style.backgroundColor = '#ffffff';
    skipButton.style.padding = '10px';
    skipButton.style.border = '1px solid #000000';
    skipButton.style.zIndex = '9999'; // Set z-index to a high value
    document.body.appendChild(skipButton);

    // Listen for click event on skip video button
    skipButton.addEventListener('click', skipVideo);

    // Calculate the position for the skip button
    function calculateSkipButtonPosition() {
        const speedControlHeight = document.getElementById('speed').offsetHeight;
        const autoPauseControlHeight = document.getElementById('autoPauseToggle').offsetHeight;
        const skipButtonTop = 60 + speedControlHeight + autoPauseControlHeight + 20; // Adjust top position based on speed and auto pause control
        skipButton.style.top = skipButtonTop + 'px';
    }

    // Listen for window resize to recalculate skip button position
    window.addEventListener('resize', calculateSkipButtonPosition);

    // Initial calculation of skip button position
    calculateSkipButtonPosition();

    // Function to monitor video playback and resume playback if video stops
    function monitorVideoPlayback() {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.paused && video.currentTime === video.duration) {
                video.currentTime = 0;
                video.play();
            }
            lastPlayedVideo = video;
        });
    }

    // Set an interval to monitor video playback periodically
    setInterval(monitorVideoPlayback, 1000);

    // Disable default pause behavior on all videos
    document.querySelectorAll('video').forEach(video => {
        video.addEventListener('pause', event => {
            if (autoPauseEnabled) {
                event.preventDefault();
                event.stopPropagation();
                lastPlayedVideo.play();
            }
        });
    });

})();