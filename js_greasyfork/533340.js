// ==UserScript==
// @name         YouTube Playback Speed Control Overlay
// @namespace    https://greasyfork.org/en/users/1317369-bishoy-asaad
// @version      1.0.0
// @description  Adds a convenient overlay to control YouTube video playback speed with keyboard shortcuts and perfect sync with native controls
// @author       Bishoy
// @license      MIT
// @match        https://www.youtube.com/watch*
// @match        https://youtube.com/watch*
// @match        https://www.youtube.com/shorts*
// @match        https://youtube.com/shorts*
// @icon         https://www.youtube.com/favicon.ico
// @homepage     https://greasyfork.org/en/scripts/533340-youtube-playback-speed-control-overlay
// @grant        none
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/533340/YouTube%20Playback%20Speed%20Control%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/533340/YouTube%20Playback%20Speed%20Control%20Overlay.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Configuration
    const speedStep = 0.25;
    const minSpeed = 0.25;
    const maxSpeed = 3.0;
    const updateInterval = 1000;

    // Create and style the overlay
    function createSpeedControl() {
        const container = document.createElement('div');
        container.id = 'yt-speed-control';
        container.style.cssText = `
            position: absolute;
            bottom: 80px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            display: flex;
            align-items: center;
            font-family: Arial, sans-serif;
            user-select: none;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: auto;
        `;

        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '−';
        decreaseBtn.style.cssText = `
            background-color: #333;
            color: white;
            border: none;
            border-radius: 3px;
            width: 28px;
            height: 28px;
            font-size: 16px;
            cursor: pointer;
            margin-right: 8px;
        `;
        decreaseBtn.addEventListener('click', () => changeSpeed('decrease'));

        const speedDisplay = document.createElement('div');
        speedDisplay.id = 'yt-speed-display';
        speedDisplay.textContent = `1.00x`;
        speedDisplay.style.cssText = `
            font-size: 14px;
            font-weight: bold;
            margin: 0 8px;
            min-width: 46px;
            text-align: center;
        `;

        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '+';
        increaseBtn.style.cssText = `
            background-color: #333;
            color: white;
            border: none;
            border-radius: 3px;
            width: 28px;
            height: 28px;
            font-size: 16px;
            cursor: pointer;
            margin-left: 8px;
        `;
        increaseBtn.addEventListener('click', () => changeSpeed('increase'));

        container.appendChild(decreaseBtn);
        container.appendChild(speedDisplay);
        container.appendChild(increaseBtn);

        return container;
    }

    // Update YouTube's internal speed state
    function updateYouTubeSpeedState(speed) {
        try {
            // Update session storage
            const storageData = {
                data: speed.toString(),
                creation: Date.now()
            };
            sessionStorage.setItem('yt-player-playback-rate', JSON.stringify(storageData));

            // Find the YouTube settings menu and update its state
            const menuItems = document.querySelectorAll('div.ytp-menuitem');
            menuItems.forEach(item => {
                if (item.querySelector('.ytp-menuitem-label')?.textContent?.includes('Playback speed')) {
                    const valueElement = item.querySelector('.ytp-menuitem-content');
                    if (valueElement) {
                        valueElement.textContent = speed === 1 ? 'Normal' : speed + '×';
                    }
                    
                    // Update the checked state
                    const checkmark = item.querySelector('.ytp-menuitem-toggle-checkbox');
                    if (checkmark) {
                        const currentSpeedText = item.querySelector('.ytp-menuitem-content')?.textContent;
                        const isSelected = currentSpeedText === (speed === 1 ? 'Normal' : speed + '×');
                        checkmark.style.display = isSelected ? '' : 'none';
                    }
                }
            });

            // Dispatch a ratechange event to trigger YouTube's internal handlers
            const video = document.querySelector('video');
            if (video) {
                video.dispatchEvent(new Event('ratechange'));
            }
        } catch (e) {
            console.log('Error updating YouTube speed state:', e);
        }
    }

    // Change playback speed
    function changeSpeed(direction) {
        const video = document.querySelector('video');
        if (!video) return;

        let currentSpeed = video.playbackRate;
        let newSpeed;
        
        if (direction === 'increase') {
            newSpeed = Math.min(maxSpeed, currentSpeed + speedStep);
        } else {
            newSpeed = Math.max(minSpeed, currentSpeed - speedStep);
        }
        
        // Try to use YouTube's native API first
        if (window.yt && window.yt.player && window.yt.player.getPlayerByElement) {
            const playerElement = document.querySelector('#movie_player');
            if (playerElement) {
                const player = window.yt.player.getPlayerByElement(playerElement);
                if (player && player.setPlaybackRate) {
                    player.setPlaybackRate(newSpeed);
                    updateSpeedDisplay(newSpeed);
                    updateYouTubeSpeedState(newSpeed);
                    return;
                }
            }
        }
        
        // Fallback
        setPlaybackRate(newSpeed);
    }

    // Fallback method to set speed directly
    function setPlaybackRate(speed) {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = speed;
            updateSpeedDisplay(speed);
            updateYouTubeSpeedState(speed);
        }
    }

    // Update the speed display text
    function updateSpeedDisplay(speed) {
        const display = document.getElementById('yt-speed-display');
        if (display) {
            display.textContent = `${speed.toFixed(2)}x`;
        }
    }

    // Show/hide controls based on YouTube controls visibility
    function updateControlsVisibility() {
        const speedControl = document.getElementById('yt-speed-control');
        if (!speedControl) return;
        
        const playerContainer = document.querySelector('#movie_player');
        if (!playerContainer) return;
        
        const isControlsVisible = playerContainer.classList.contains('ytp-autohide') === false;
        
        if (isControlsVisible) {
            speedControl.style.opacity = '0.8';
        } else {
            speedControl.style.opacity = '0';
        }
    }

    // Sync with YouTube's speed changes
    function setupSpeedChangeListener() {
        const video = document.querySelector('video');
        if (video) {
            video.addEventListener('ratechange', () => {
                updateSpeedDisplay(video.playbackRate);
                updateYouTubeSpeedState(video.playbackRate);
            });
        }
    }

    // Initialize control and monitor for player
    let controlAdded = false;
    let speedControl = null;

    function initializeControl() {
        const video = document.querySelector('video');
        const playerContainer = document.querySelector('#movie_player');
        
        if (video && playerContainer) {
            if (!controlAdded) {
                speedControl = createSpeedControl();
                playerContainer.appendChild(speedControl);
                controlAdded = true;
                
                updateSpeedDisplay(video.playbackRate);
                setupSpeedChangeListener();
                
                document.addEventListener('keydown', function(e) {
                    if (document.activeElement.tagName !== 'INPUT' && 
                        document.activeElement.tagName !== 'TEXTAREA') {
                        if (e.key === ']') changeSpeed('increase');
                        else if (e.key === '[') changeSpeed('decrease');
                    }
                });
                
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.type === 'attributes' && 
                            mutation.attributeName === 'class') {
                            updateControlsVisibility();
                        }
                    });
                });
                
                observer.observe(playerContainer, { attributes: true });
                playerContainer.addEventListener('mousemove', updateControlsVisibility);
                updateControlsVisibility();
            } else {
                const isFullscreen = document.fullscreenElement || 
                                    document.webkitFullscreenElement || 
                                    document.mozFullScreenElement;
                
                if (speedControl) {
                    speedControl.style.bottom = isFullscreen ? '120px' : '80px';
                }
                
                updateSpeedDisplay(video.playbackRate);
                updateControlsVisibility();
            }
        } else if (controlAdded && speedControl && !playerContainer) {
            speedControl.remove();
            controlAdded = false;
        }
    }

    setInterval(initializeControl, updateInterval);
})();