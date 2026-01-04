// ==UserScript==
// @name         YouTube Playback Position Saver
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Save and restore YouTube playback position across sessions (even when not signed in)
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539363/YouTube%20Playback%20Position%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/539363/YouTube%20Playback%20Position%20Saver.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'yt-timestamps';
    let lastVideoId = null;
    let saveInterval = null;

    function log(...args) {
        console.log('[YT-PositionSaver]', ...args);
    }

    function getVideoId() {
        const params = new URLSearchParams(window.location.search);
        return params.get('v');
    }

    function loadTimestamps() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch {
            return {};
        }
    }

    function saveTimestamps(timestamps) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(timestamps));
    }

    function setupVideoTracking(videoId) {
        const video = document.querySelector('video');
        if (!video || !videoId) {
            return;
        }

        const timestamps = loadTimestamps();
        const savedTime = timestamps[videoId];
        if (savedTime && savedTime < video.duration - 10) {
            video.currentTime = savedTime;
        }

        if (saveInterval) clearInterval(saveInterval);
        saveInterval = setInterval(() => {
            if (!video.paused && !video.ended) {
                timestamps[videoId] = Math.floor(video.currentTime);
                saveTimestamps(timestamps);
            }
        }, 5000);
    }

    function waitForVideoAndSetup(videoId) {
        const check = setInterval(() => {
            const video = document.querySelector('video');
            if (video && video.readyState >= 1) {
                clearInterval(check);
                setupVideoTracking(videoId);
            }
        }, 500);
    }

    function onVideoChange() {
        const currentId = getVideoId();
        if (!currentId || currentId === lastVideoId) return;

        lastVideoId = currentId;
        waitForVideoAndSetup(currentId);
    }

    // Detect SPA navigation using MutationObserver
    const observer = new MutationObserver(() => {
        onVideoChange();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Also run on first load
    window.addEventListener('load', () => {
        setTimeout(onVideoChange, 1000);
    });
})();
