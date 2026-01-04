// ==UserScript==
// @name        YouTube Playback Saver
// @namespace   http://tampermonkey.net/
// @version     1.6
// @description Periodically save and restore playback time of YouTube videos, including seek events.
// @license     Unlicense
// @match       *://*.youtube.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/515353/YouTube%20Playback%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/515353/YouTube%20Playback%20Saver.meta.js
// ==/UserScript==

const SAVE_INTERVAL = 2; // Interval for saving playback data in seconds
const STORAGE_KEY = 'youtubePlaybackSaver';
const LOG_PREFIX = '[YTPS]';
let playbackRestored = false;
let lastSavedTime = null;
let isSaving = false;

// Utility Functions
const currentVideoId = () => new URL(location.href).searchParams.get('v');
const getVideoElement = () => document.querySelector('video.html5-main-video');

// Format seconds to hh:mm:ss
const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(11, 8);

// Local Storage Operations with Race Condition Prevention
const saveData = (videoId, time) => {
    if (isSaving) return; // Prevent concurrent saves
    isSaving = true;

    try {
        const playbackData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        playbackData[videoId] = { time };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playbackData));
    } finally {
        isSaving = false;
    }
};

const loadData = (videoId) => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')[videoId] || { time: 0 };
};

// Validates the restored time by checking video.currentTime within 500ms
const validateRestoredTime = (video, targetTime, attempts = 5) => {
    return new Promise((resolve) => {
        const checkTime = (remainingAttempts) => {
            if (Math.abs(video.currentTime - targetTime) < 0.5 || remainingAttempts <= 0) {
                resolve();
            } else {
                video.currentTime = targetTime; // Retry setting the currentTime
                setTimeout(() => checkTime(remainingAttempts - 1), 100); // Check every 100ms
            }
        };
        checkTime(attempts);
    });
};

// Restore saved playback time on load with validation
const restorePlayback = async () => {
    if (playbackRestored) return;

    const video = getVideoElement();
    if (!video) return;

    const videoId = currentVideoId();
    const savedTime = loadData(videoId).time;
    if (savedTime > 0 && savedTime < video.duration) {
        video.currentTime = savedTime;
        await validateRestoredTime(video, savedTime);
        playbackRestored = true;
        console.info(`${LOG_PREFIX} Restored playback to ${formatTime(savedTime)}`);
    }
};

// Save current playback time if it has changed
const savePlayback = () => {
    const video = getVideoElement();
    if (!video) return;

    const videoId = currentVideoId();
    const timeToSave = Math.floor(video.currentTime);
    if (timeToSave > 0 && timeToSave !== lastSavedTime) {
        saveData(videoId, timeToSave);
        lastSavedTime = timeToSave;
        const url = new URL(location.href);
        url.searchParams.set('t', `${timeToSave}s`);
        history.replaceState(history.state, document.title, url.toString());
        console.info(`${LOG_PREFIX} Saved playback at ${formatTime(timeToSave)}`);
    }
};

// Monitor video for events with enhanced checks
const monitorVideo = () => {
    const video = getVideoElement();
    if (!video || playbackRestored) return;

    restorePlayback(); // Try restoring playback time on load

    video.addEventListener('timeupdate', () => {
        if (Math.floor(video.currentTime) % SAVE_INTERVAL === 0) savePlayback();
    });

    video.addEventListener('seeked', savePlayback);
    video.addEventListener('pause', savePlayback); // Save on pause

    video.addEventListener('play', () => {
        if (!playbackRestored) restorePlayback(); // Ensure restore on play
    }, { once: true });

    video.addEventListener('ratechange', () => {
        console.info(`${LOG_PREFIX} Playback rate changed to ${video.playbackRate}`);
    });

    video.addEventListener('ended', () => {
        console.info(`${LOG_PREFIX} Video ended, resetting saved time.`);
        saveData(currentVideoId(), 0); // Reset playback position on video end
    });

    video.addEventListener('loadedmetadata', restorePlayback); // Restore when metadata is loaded
    video.addEventListener('canplay', restorePlayback); // Restore when video can play without buffering
};

// Re-run monitor if video ID changes, preventing redundant calls
let lastVideoId = null;
setInterval(() => {
    const videoId = currentVideoId();
    if (videoId && videoId !== lastVideoId) {
        lastVideoId = videoId;
        playbackRestored = false;
        monitorVideo();
    }
}, 1000);
