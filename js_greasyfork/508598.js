// ==UserScript==
// @name         Stable Volume Emulator
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Emulates stable volume on videos without it.
// @author       InariOkami
// @match        *://www.youtube.com/*
// @grant        none
// @icon         https://cdn.pixabay.com/photo/2021/10/02/23/20/logo-6676544_1280.png
// @downloadURL https://update.greasyfork.org/scripts/508598/Stable%20Volume%20Emulator.user.js
// @updateURL https://update.greasyfork.org/scripts/508598/Stable%20Volume%20Emulator.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const volumeStorageKey = 'youtube_stable_volume';
    const volumeNormalizationKey = 'youtube_volume_normalization';
    let storedVolume = 1.0;
    let volumeHistory = [];

    function loadSettings() {
        const savedVolume = localStorage.getItem(volumeStorageKey);
        if (savedVolume !== null) {
            storedVolume = parseFloat(savedVolume);
        }
        const savedHistory = localStorage.getItem(volumeNormalizationKey);
        if (savedHistory !== null) {
            volumeHistory = JSON.parse(savedHistory);
        }
    }

    function saveVolume(volume) {
        localStorage.setItem(volumeStorageKey, volume);
    }

    function saveVolumeHistory() {
        localStorage.setItem(volumeNormalizationKey, JSON.stringify(volumeHistory));
    }

    function calculateAverageVolume() {
        if (volumeHistory.length === 0) return storedVolume;
        const total = volumeHistory.reduce((acc, val) => acc + val, 0);
        return total / volumeHistory.length;
    }

    function applyVolume(video, volume) {
        const boostedVolume = Math.min(volume, 1.0);
        video.volume = boostedVolume;
        volumeHistory.push(boostedVolume);
        if (volumeHistory.length > 10) volumeHistory.shift();
        saveVolumeHistory();

        video.addEventListener('volumechange', () => {
            saveVolume(video.volume);
            volumeHistory.push(video.volume);
            if (volumeHistory.length > 10) volumeHistory.shift();
            saveVolumeHistory();
        });
    }

    function handleVideo(video) {
        if (video) {
            video.volume = Math.min(storedVolume, 1.0);

            // Emulate stable volume if not available
            if (!video.hasAttribute('stable-volume')) {
                const averageVolume = calculateAverageVolume();
                applyVolume(video, averageVolume);
            }
        }
    }

    function observeDOMChanges() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeName === 'VIDEO') {
                        handleVideo(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function checkStableVolumeAvailability(callback) {
        const request = new XMLHttpRequest();
        request.open('GET', 'https://update.greasyfork.org/scripts/508598/Stable%20Volume%20Emulator.meta.js', true);
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 200) {
                    const responseText = request.responseText;
                    if (responseText.includes('Stable Volume')) {
                        callback(true);
                    } else {
                        callback(false);
                    }
                } else {
                    callback(false);
                }
            }
        };
        request.send();
    }

    function init() {
        checkStableVolumeAvailability(isAvailable => {
            if (!isAvailable) {
                loadSettings();
                const video = document.querySelector('video');
                handleVideo(video);
                observeDOMChanges();
            } else {
                const videos = document.querySelectorAll('video');
                videos.forEach(video => video.volume = Math.min(storedVolume, 1.0));
            }
        });
    }

    init();
})();