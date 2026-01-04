// ==UserScript==
// @name         Video time tracker (localStorage)
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Remembers the last watched time of videos on any website (including YouTube) and auto-deletes after 3 months
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528629/Video%20time%20tracker%20%28localStorage%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528629/Video%20time%20tracker%20%28localStorage%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EXPIRATION_DAYS = 90; // Days
    const SAVE_INTERVAL = 1*1000; // Seconds*1000
    const SHORT_VIDEO_TIME = 10; // Days
    const YOUTUBE_URL_REGEX = /youtube\.com\/watch\?v=([^&]+)/;

    // Function to save time
    function saveTime(video, key) {
        if (!video || video.duration < SHORT_VIDEO_TIME) return;
        let data = { time: video.currentTime, timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Function to load and restore time
    function loadTime(video, key) {
        let savedData = localStorage.getItem(key);
        if (savedData) {
            let data = JSON.parse(savedData);
            let elapsedDays = (Date.now() - data.timestamp) / (1000 * 60 * 60 * 24);
            if (elapsedDays < EXPIRATION_DAYS && !isNaN(data.time)) {
                video.currentTime = parseFloat(data.time);
            } else {
                localStorage.removeItem(key); // Delete expired data
            }
        }
    }

    // Standard video handling
    function handleVideo(video) {
        if (!video || video.dataset.processed) return;
        video.dataset.processed = true;

        let key = `videoTime_${location.href}`;
        loadTime(video, key);
        let saveInterval = setInterval(() => saveTime(video, key), SAVE_INTERVAL);

        video.addEventListener('pause', () => clearInterval(saveInterval));
    }

    // YouTube-specific handling using the IFrame API
    function handleYouTube() {
        let match = location.href.match(YOUTUBE_URL_REGEX);
        if (!match) return;

        let videoId = match[1];
        let key = `youtubeTime_${videoId}`;

        // Wait for the YouTube player to load
        let checkPlayer = setInterval(() => {
            let player = document.querySelector('.html5-main-video');
            if (player) {
                clearInterval(checkPlayer);
                loadTime(player, key);
                let saveInterval = setInterval(() => saveTime(player, key), SAVE_INTERVAL);
                player.addEventListener('pause', () => clearInterval(saveInterval));
            }
        }, 1000);
    }

    // Observer to track new video elements
    function init() {
        if (location.hostname.includes('youtube.com')) {
            handleYouTube();
        } else {
            let observer = new MutationObserver(() => {
                document.querySelectorAll('video').forEach(video => handleVideo(video));
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    window.addEventListener('load', init);
})();
