// ==UserScript==
// @name         youtube hides controls while showing progress bar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide YouTube's controls and display the progress bar
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500857/youtube%20hides%20controls%20while%20showing%20progress%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/500857/youtube%20hides%20controls%20while%20showing%20progress%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let controlsVisible = false;
    let isScriptEnabled = true;
    let intervalId = null;
    let savedState = null;

    // Function to hide controls but keep the progress bar and prevent subtitles from moving up
    function hideControls() {
        const controls = document.querySelector('.ytp-chrome-controls');
        const progressBar = document.querySelector('.ytp-progress-bar-container');

        if (controls) {
            controls.style.opacity = '0';
        }

        if (progressBar) {
            progressBar.style.opacity = '1';
        }

        const subtitles = document.querySelector('.ytp-caption-window-container');
        if (subtitles) {
            subtitles.style.transform = 'none';
        }
    }

    // Function to show controls
    function showControls() {
        const controls = document.querySelector('.ytp-chrome-controls');
        const progressBar = document.querySelector('.ytp-progress-bar-container');

        if (controls) {
            controls.style.opacity = '1';
        }

        if (progressBar) {
            progressBar.style.opacity = '1';
        }

        const subtitles = document.querySelector('.ytp-caption-window-container');
        if (subtitles) {
            subtitles.style.transform = '';
        }
    }

    // Function to toggle controls visibility
    function toggleControls() {
        controlsVisible = !controlsVisible;
        if (controlsVisible) {
            showControls();
        } else {
            hideControls();
        }
    }

    // Function to restore all changes made by the script and disable interval
    function restoreDefaults() {
        const controls = document.querySelector('.ytp-chrome-controls');
        const progressBar = document.querySelector('.ytp-progress-bar-container');
        const subtitles = document.querySelector('.ytp-caption-window-container');

        if (controls) {
            controls.style.opacity = '';
        }

        if (progressBar) {
            progressBar.style.opacity = '';
        }

        if (subtitles) {
            subtitles.style.transform = '';
        }

        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }

        isScriptEnabled = false;
    }

    // Function to enable interval and hide controls
    function enableInterval() {
        if (intervalId === null) {
            intervalId = setInterval(() => {
                if (!controlsVisible && isScriptEnabled) {
                    hideControls();
                }
            }, 1000);
        }

        isScriptEnabled = true;
    }

    // Initially hide controls and start interval
    hideControls();
    enableInterval();

    // Add event listener for Ctrl+M to toggle controls
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key.toLowerCase() === 'm' && isScriptEnabled) {
            toggleControls();
        }
        if (e.altKey && e.key.toLowerCase() === 'm') {
            if (isScriptEnabled) {
                savedState = {
                    controlsVisible,
                    isScriptEnabled,
                    intervalId
                };
                restoreDefaults();
            } else {
                if (savedState) {
                    controlsVisible = savedState.controlsVisible;
                    isScriptEnabled = savedState.isScriptEnabled;
                    intervalId = savedState.intervalId;
                }
                hideControls();
                enableInterval();
            }
        }
    });
})();
