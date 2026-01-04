// ==UserScript==
// @name         Youtube HD Auto Quality
// @author       xechostormx, hearing echoes, Grok 3
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @match        *://www.youtube.com/*
// @match        *://m.youtube.com/*
// @match        *://www.youtube-nocookie.com/*
// @exclude      *://www.youtube.com/live_chat*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @description  Automatically selects the best available video quality on YouTube.
// @downloadURL https://update.greasyfork.org/scripts/542245/Youtube%20HD%20Auto%20Quality.user.js
// @updateURL https://update.greasyfork.org/scripts/542245/Youtube%20HD%20Auto%20Quality.meta.js
// ==/UserScript==

/* jshint esversion: 11 */

(async function () {
    'use strict';

    const QUALITIES = {
        highres: 4320,
        hd2160: 2160,
        hd1440: 1440,
        hd1080: 1080,
        hd720: 720,
        large: 480,
        medium: 360,
        small: 240,
        tiny: 144
    };

    const PREMIUM_INDICATOR_LABEL = "Premium";

    // Global variables
    let moviePlayer = null;
    let isIframe = false;

    async function setResolution() {
        if (!moviePlayer) {
            console.log('Movie player not found.');
            return;
        }

        // Debounce to prevent rapid calls
        let debounceTimer;
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            try {
                const videoQualityData = moviePlayer.getAvailableQualityData();
                if (!videoQualityData.length) {
                    console.log('No quality data available, waiting for playback...');
                    const videoElement = moviePlayer.querySelector('video');
                    if (videoElement && videoElement.paused) {
                        videoElement.addEventListener('play', setResolution, { once: true });
                    }
                    return;
                }

                const availableQualities = moviePlayer.getAvailableQualityLevels();
                const highestQuality = availableQualities.reduce((max, q) => 
                    QUALITIES[q] > QUALITIES[max] ? q : max, availableQualities[0]);
                const premiumData = videoQualityData.find(q =>
                    q.quality === highestQuality &&
                    q.qualityLabel?.trim().endsWith(PREMIUM_INDICATOR_LABEL) &&
                    q.isPlayable
                );

                moviePlayer.setPlaybackQualityRange(highestQuality, highestQuality, premiumData?.formatId);
                console.log(`Set quality to: [${highestQuality}${premiumData ? ' Premium' : ''}]`);
            } catch (error) {
                console.error('Failed to set resolution:', error);
            }
        }, 100);
    }

    function processVideoLoad(event = null) {
        console.log('Processing video load...');
        moviePlayer = event?.target?.player_ ?? document.querySelector('#movie_player');
        if (moviePlayer) setResolution();
    }

    function addEventListeners() {
        if (window.location.hostname === 'm.youtube.com') {
            window.addEventListener('state-navigateend', processVideoLoad, true);
        } else {
            window.addEventListener('yt-player-updated', processVideoLoad, true);
        }
    }

    async function initialize() {
        if (window.self !== window.top) isIframe = true;
        window.addEventListener('pageshow', processVideoLoad, true);
        addEventListeners();
    }

    function hasGreasyMonkeyAPI() {
        return typeof GM !== 'undefined' || typeof GM_info !== 'undefined';
    }

    if (hasGreasyMonkeyAPI()) {
        initialize();
    } else {
        console.error('No Grease Monkey API detected.');
    }
})();