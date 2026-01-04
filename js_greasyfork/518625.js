// ==UserScript==
// @name         YouTube Playback Speed Buttons
// @namespace    https://youtube.com
// @version      1.1
// @description  Adds playback speed control buttons and keyboard shortcuts to YouTube videos
// @author       indistinctive
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/518625/YouTube%20Playback%20Speed%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/518625/YouTube%20Playback%20Speed%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let activeButton = null;

    function createSpeedControls() {
        const player = document.querySelector('ytd-player');
        const video = player ? player.querySelector('video') : null;

        if (!video) return;

        const controlsContainer = player.querySelector('.ytp-right-controls');
        if (!controlsContainer) return;

        const speedButtonContainer = document.createElement('div');
        speedButtonContainer.style.display = 'flex';
        speedButtonContainer.style.alignItems = 'center';
        speedButtonContainer.style.marginRight = '10px';
        speedButtonContainer.style.zIndex = '9999';

        // Speeds array with desired speeds
        const speeds = [1, 1.5, 2, 3];
        speeds.forEach(speed => {
            const button = document.createElement('button');
            button.innerText = `${speed}×`;
            button.style.padding = '4px 10px';
            button.style.marginRight = '5px';
            button.style.border = 'none';
            button.style.backgroundColor = '#fff';
            button.style.color = '#000';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.fontWeight = '500';
            button.style.borderRadius = '5px';
            button.style.transition = 'background-color 0.2s ease, color 0.2s ease';
            button.style.boxShadow = 'none';
            button.style.outline = 'none';
            button.style.width = '40px';
            button.style.display = 'flex';
            button.style.justifyContent = 'center';
            button.style.alignItems = 'center';

            // Hover effect
            button.addEventListener('mouseenter', () => {
                if (button !== activeButton) {
                    button.style.backgroundColor = '#000';
                    button.style.color = '#fff';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (button !== activeButton) {
                    button.style.backgroundColor = '#fff';
                    button.style.color = '#000';
                }
            });

            // Handle button click to change playback speed
            button.addEventListener('click', () => {
                video.playbackRate = speed;
                highlightButton(button);
            });

            speedButtonContainer.appendChild(button);
        });

        controlsContainer.style.display = 'flex';
        controlsContainer.insertBefore(speedButtonContainer, controlsContainer.firstChild);
    }

    // Highlight the active speed button
    function highlightButton(button) {
        if (activeButton !== button) {
            if (activeButton) {
                activeButton.style.backgroundColor = '#fff';
                activeButton.style.color = '#000';
            }
            activeButton = button;
            button.style.backgroundColor = '#000';
            button.style.color = '#fff';
        }
    }

    // Listen for keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        const player = document.querySelector('ytd-player');
        const video = player ? player.querySelector('video') : null;

        if (!video || event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
            return;
        }

        switch (event.key.toLowerCase()) {
            case 'q':
                video.playbackRate = 1;
                updateActiveButton(1);
                break;
            case 's':
                video.playbackRate = 1.5;
                updateActiveButton(1.5);
                break;
            case 'w':
                video.playbackRate = 2;
                updateActiveButton(2);
                break;
            case 'e':
                video.playbackRate = 3;
                updateActiveButton(3);
                break;
        }
    });

    // Update the active button based on playback speed
    function updateActiveButton(speed) {
        const player = document.querySelector('ytd-player');
        const controlsContainer = player ? player.querySelector('.ytp-right-controls') : null;
        if (!controlsContainer) return;

        const buttons = controlsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.innerText === `${speed}×`) {
                highlightButton(button);
            }
        });
    }

    function waitForPlayer() {
        const observer = new MutationObserver(() => {
            const player = document.querySelector('ytd-player');
            const controlsContainer = player ? player.querySelector('.ytp-right-controls') : null;

            if (controlsContainer) {
                createSpeedControls();
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    waitForPlayer();
})();