// ==UserScript==
// @name         YouTube Custom Volume Control
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  Hides the volume slider and mute button, adds icon buttons to adjust volume with a centered and always visible volume indicator.
// @match        *://www.youtube.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/js/all.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512867/YouTube%20Custom%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/512867/YouTube%20Custom%20Volume%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to update the volume indicator
    function updateVolumeDisplay(volume) {
        var volumeDisplay = document.querySelector('#volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = Math.round(volume * 100) + '%';
            volumeDisplay.style.color = volume === 0 ? 'red' : 'white';
        }
    }
    // Function to display volume change on screen
    function showVolumeChangeOnScreen(volume) {
        let volumeDisplay = document.querySelector('#ytp-video-volume');
        if (!volumeDisplay) {
            volumeDisplay = document.createElement('div');
            volumeDisplay.id = 'ytp-video-volume';
            volumeDisplay.style.position = 'absolute';
            volumeDisplay.style.top = '10%';
            volumeDisplay.style.left = '50%';
            volumeDisplay.style.transform = 'translate(-50%, 0)';
            volumeDisplay.style.textAlign = 'center';
            volumeDisplay.style.background = 'rgba(0,0,0,.5)';
            volumeDisplay.style.color = '#eee';
            volumeDisplay.style.fontSize = '175%';
            volumeDisplay.style.zIndex = '19';
            volumeDisplay.style.padding = '10px 20px';
            volumeDisplay.style.borderRadius = '3%';

            const playerContainer = document.querySelector('.html5-video-player');
            playerContainer.appendChild(volumeDisplay);
        }

        volumeDisplay.textContent = `${volume}%`;
        volumeDisplay.style.display = 'block';

        clearTimeout(volumeDisplay.timeout);
        volumeDisplay.timeout = setTimeout(() => {
            volumeDisplay.style.display = 'none';
        }, 1000);
    }
    // Function to update volume changes triggered by arrow keys
    function detectVolumeChange() {
        const player = document.getElementById('movie_player');
        if (player) {
            const currentVolume = player.getVolume();
            updateVolumeDisplay(currentVolume / 100);
            saveVolume(currentVolume);
        }
    }

    // Create volume control buttons and the volume indicator
    function createVolumeButtons() {
        var controlBar = document.querySelector('.ytp-right-controls');
        if (!controlBar) {
            console.log("Control bar not found.");
            return;
        }

        var muteButton = document.querySelector('.ytp-mute-button');
        var volumeSlider = document.querySelector('.ytp-volume-panel');
        if (muteButton) muteButton.style.display = 'none';
        if (volumeSlider) volumeSlider.style.display = 'none';

        if (document.querySelector('#custom-volume-buttons')) return;

        var volumeButtonContainer = document.createElement('div');
        volumeButtonContainer.id = 'custom-volume-buttons';
        volumeButtonContainer.style.cssText = 'display: flex; align-items: center; justify-content: center; gap: 0;';

        var buttonStyle = `
            font-size: 16px;
            color: white;
            background-color: transparent;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s ease;
            width: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        var hoverStyle = `background-color: rgba(255, 255, 255, 0.2);`;

        // Volume down button
        var volumeDownBtn = document.createElement('button');
        volumeDownBtn.innerHTML = '<i class="fa-solid fa-volume-low"></i>';
        volumeDownBtn.className = 'ytp-button';
        volumeDownBtn.style.cssText = buttonStyle;
        volumeDownBtn.onmouseover = () => volumeDownBtn.style.cssText = buttonStyle + hoverStyle;
        volumeDownBtn.onmouseout = () => volumeDownBtn.style.cssText = buttonStyle;

        volumeDownBtn.onclick = function() {
            const player = document.getElementById('movie_player');
            let playerVolume = player.getVolume();
            playerVolume = Math.max(playerVolume - 25, 0);
            player.setVolume(playerVolume);
            updateVolumeDisplay(playerVolume / 100);
            showVolumeChangeOnScreen(playerVolume);
            saveVolume(playerVolume);
        };

        // Volume up button
        var volumeUpBtn = document.createElement('button');
        volumeUpBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        volumeUpBtn.className = 'ytp-button';
        volumeUpBtn.style.cssText = buttonStyle + "width:35px;";
        volumeUpBtn.onmouseover = () => volumeUpBtn.style.cssText = buttonStyle + hoverStyle + "width:35px;";
        volumeUpBtn.onmouseout = () => volumeUpBtn.style.cssText = buttonStyle + "width:35px;";

        volumeUpBtn.onclick = function() {
            const player = document.getElementById('movie_player');
            let playerVolume = player.getVolume();
            playerVolume = Math.min(playerVolume + 25, 100);
            player.setVolume(playerVolume);
            updateVolumeDisplay(playerVolume / 100);
            showVolumeChangeOnScreen(playerVolume);
            saveVolume(playerVolume);
        };

        // Volume indicator
        var volumeDisplay = document.createElement('button');
        volumeDisplay.id = 'volume-display';
        volumeDisplay.style.cssText = 'color: white; font-size: 16px; width: 40px; text-align: center; margin-right: 5px; background: transparent; border: none; cursor: pointer;';
        volumeDisplay.onclick = function() {
            var player = document.querySelector('video');
            if (player) {
                player.muted = !player.muted;
                updateVolumeDisplay(player.muted ? 0 : player.volume);
            }
        };

        volumeButtonContainer.appendChild(volumeDownBtn);
        volumeButtonContainer.appendChild(volumeDisplay);
        volumeButtonContainer.appendChild(volumeUpBtn);

        if (muteButton && muteButton.parentElement) {
            muteButton.parentElement.insertBefore(volumeButtonContainer, muteButton);
        }
    }

    function saveVolume(volume) {
        const volumeData = { data: { volume: volume } };
        localStorage.setItem('yt-player-volume', JSON.stringify(volumeData));
        sessionStorage.setItem('yt-player-volume', JSON.stringify(volumeData));
    }

    function ensureVideoLoaded() {
        const player = document.getElementById('movie_player');
        if (player && player.getVolume !== undefined) {
            createVolumeButtons();
            const storedVolume = JSON.parse(localStorage.getItem('yt-player-volume'));
            if (storedVolume && storedVolume.data && storedVolume.data.volume !== undefined) {
                const volume = storedVolume.data.volume;
                player.setVolume(volume);
                updateVolumeDisplay(volume / 100);
            } else {
                // player.setVolume(100);
                updateVolumeDisplay(1);
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    setTimeout(detectVolumeChange, 100);
                }
            });
        }
    }

    var observer = new MutationObserver(function() {
        if (document.querySelector('.ytp-right-controls') && !document.querySelector('#custom-volume-buttons')) {
            ensureVideoLoaded();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
