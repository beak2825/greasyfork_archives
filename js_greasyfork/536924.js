// ==UserScript==
// @name         Rule34Video Auto-Player Ultimate
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto-advance videos with full state control
// @author       YourName
// @match        https://rule34video.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536924/Rule34Video%20Auto-Player%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/536924/Rule34Video%20Auto-Player%20Ultimate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;
    let checkInterval;
    const config = {
        checkInterval: 100,     // Progress check frequency
        nextDelay: 1000,         // Delay before next click
        actionDelay: 2000,       // Post-navigation wait
        playDelay: 250,          // Play->fullscreen delay
        retryInterval: 250,      // State check interval
        maxRetries: 4096            // Max retry attempts per state
    };

    function parseTime(timeStr) {
        const [mins, secs] = timeStr.split(':').map(Number);
        return mins * 60 + secs;
    }

    function enforcePlayerState() {
        let retries = 0;
        const stateChecker = setInterval(() => {
            const player = document.getElementById('kt_player');
            const playButton = document.querySelector('.fp-play');
            const fsButton = document.querySelector('.fp-screen');

            if (!player) {
                clearInterval(stateChecker);
                return;
            }

            // Check and enforce playing state
            if (!player.classList.contains('is-playing') && playButton) {
                playButton.click();
            }

            // Check and enforce fullscreen state
            if (!player.classList.contains('is-fullscreen') && fsButton) {
                fsButton.click();
            }

            // Stop checking when both states are present or max retries reached
            if ((player.classList.contains('is-playing') &&
                 player.classList.contains('is-fullscreen')) ||
                retries >= config.maxRetries) {
                clearInterval(stateChecker);
            }

            retries++;
        }, config.retryInterval);
    }

    function performPlayActions() {
        const playButton = document.querySelector('.fp-play');
        if (playButton) {
            playButton.click();

            setTimeout(() => {
                const fsButton = document.querySelector('.fp-screen');
                if (fsButton) {
                    fsButton.click();
                    enforcePlayerState();
                }
            }, config.playDelay);
        }
    }

    function triggerNextSequence() {
        if (isProcessing) return;
        isProcessing = true;

        setTimeout(() => {
            const nextBtn = document.querySelector('a.link-video.next.js-url-next');
            if (nextBtn) {
                nextBtn.click();

                setTimeout(() => {
                    performPlayActions();
                    isProcessing = false;
                }, config.actionDelay);
            }
        }, config.nextDelay);
    }

    function checkPlaybackProgress() {
        const elapsedElem = document.querySelector('.fp-time-elapsed');
        const durationElem = document.querySelector('.fp-time-duration');

        if (!elapsedElem || !durationElem) return;

        const elapsed = parseTime(elapsedElem.textContent);
        const duration = parseTime(durationElem.textContent);

        if (duration > 0 && elapsed >= duration - 1) {
            clearInterval(checkInterval);
            triggerNextSequence();
        }
    }

    function init() {
        clearInterval(checkInterval);
        checkInterval = setInterval(checkPlaybackProgress, config.checkInterval);
    }

    // Initial setup
    init();

    // Handle SPA navigation
    new MutationObserver((mutations) => {
        if (document.querySelector('.fp-time-duration')) {
            init();
        }
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();