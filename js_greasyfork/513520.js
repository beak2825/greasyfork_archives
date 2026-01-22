// ==UserScript==
// @name YouTube Speed-Adjusted Time Display
// @namespace http://tampermonkey.net/
// @version 1.4
// @description Shows speed-adjusted time for YouTube videos
// @author kavinned
// @match https://www.youtube.com/*
// @grant none
// @icon https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513520/YouTube%20Speed-Adjusted%20Time%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/513520/YouTube%20Speed-Adjusted%20Time%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let updateInterval = null;

    function updateTimeDisplay() {
        const video = document.querySelector('video');
        if (!video) return;

        const speedDisplayContainer = document.querySelector('.speed-adjusted-time-container');
        const speedIndicator = document.querySelector('.speed-indicator');
        if (!speedDisplayContainer || !speedIndicator) return;

        const currentTime = video.currentTime;
        const duration = video.duration;
        const playbackRate = video.playbackRate;

        if (isNaN(currentTime) || isNaN(duration) || isNaN(playbackRate) || playbackRate === 0) return;

        const adjustedCurrentTime = currentTime / playbackRate;
        const adjustedDuration = duration / playbackRate;

        function formatTime(seconds) {
            if (isNaN(seconds) || !isFinite(seconds)) return "0:00";

            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = Math.floor(seconds % 60);

            if (hours > 0) {
                return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            } else {
                return `${minutes}:${secs.toString().padStart(2, '0')}`;
            }
        }

        try {
            speedDisplayContainer.textContent = `${formatTime(adjustedCurrentTime)} / ${formatTime(adjustedDuration)}`;
            speedIndicator.textContent = `${playbackRate}×`;

            const displayElements = document.querySelectorAll('.speed-time-wrapper');
            displayElements.forEach(el => {
                el.style.display = playbackRate !== 1 ? 'flex' : 'none';
            });
        } catch (e) {
            console.error("Error updating time display:", e);
        }
    }

    function createSpeedTimeDisplay() {
        const existingDisplay = document.querySelector('.speed-time-wrapper');
        if (existingDisplay) existingDisplay.remove();

        const timeDisplay = document.querySelector('.ytp-time-display');
        if (!timeDisplay) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'speed-time-wrapper';
        wrapper.style.display = 'none';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '6px';
        wrapper.style.marginInlineStart = '6px';
        wrapper.style.height = 'var(--yt-delhi-pill-height, 48px)';
        wrapper.style.padding = '0 12px';
        wrapper.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        wrapper.style.borderRadius = 'calc(var(--yt-delhi-pill-height, 48px) / 2)';
        wrapper.style.position = 'relative';
        wrapper.style.alignSelf = 'center';

        const innerWrapper = document.createElement('div');
        innerWrapper.className = 'speed-time-inner-wrapper';
        innerWrapper.style.display = 'none';
        innerWrapper.style.position = 'absolute';
        innerWrapper.style.top = '4px';
        innerWrapper.style.left = '4px';
        innerWrapper.style.right = '4px';
        innerWrapper.style.bottom = '4px';
        innerWrapper.style.borderRadius = 'calc((var(--yt-delhi-pill-height, 48px) - 8px) / 2)';

        wrapper.addEventListener('mouseover', () => {
            innerWrapper.style.display = 'block';
            innerWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });

        wrapper.addEventListener('mouseout', () => {
            innerWrapper.style.display = 'none';
            innerWrapper.style.backgroundColor = '';
        });




        const speedDisplayContainer = document.createElement('div');
        speedDisplayContainer.className = 'speed-adjusted-time-container';
        speedDisplayContainer.style.display = 'flex';
        speedDisplayContainer.style.alignItems = 'center';
        speedDisplayContainer.style.fontFamily = '"YouTube Sans", "Roboto", sans-serif';
        speedDisplayContainer.style.fontSize = '13px';
        speedDisplayContainer.style.fontWeight = '500';
        speedDisplayContainer.style.color = '#fff';
        speedDisplayContainer.style.whiteSpace = 'nowrap';
        speedDisplayContainer.style.userSelect = 'none';

        const speedIndicator = document.createElement('div');
        speedIndicator.className = 'speed-indicator';
        speedIndicator.style.display = 'flex';
        speedIndicator.style.alignItems = 'center';
        speedIndicator.style.fontFamily = '"YouTube Sans", "Roboto", sans-serif';
        speedIndicator.style.fontSize = '13px';
        speedIndicator.style.fontWeight = '600';
        speedIndicator.style.color = '#aaf';
        speedIndicator.style.whiteSpace = 'nowrap';
        speedIndicator.style.userSelect = 'none';

        wrapper.appendChild(innerWrapper);
        wrapper.appendChild(speedDisplayContainer);
        wrapper.appendChild(speedIndicator);

        timeDisplay.parentNode.insertBefore(wrapper, timeDisplay);
        return speedDisplayContainer;
    }

    function startUpdates() {
        if (!updateInterval) {
            createSpeedTimeDisplay();
            updateInterval = setInterval(updateTimeDisplay, 500);
        }
    }

    function stopUpdates() {
        if (updateInterval) {
            clearInterval(updateInterval);
            updateInterval = null;

            const existingDisplay = document.querySelector('.speed-time-wrapper');
            if (existingDisplay) existingDisplay.remove();
        }
    }

    function checkForVideoPage() {
        if (window.location.pathname === '/watch') {
            startUpdates();
        } else {
            stopUpdates();
        }
    }

    checkForVideoPage();

    window.addEventListener('yt-navigate-start', stopUpdates);
    window.addEventListener('yt-navigate-finish', checkForVideoPage);

    const playerObserver = new MutationObserver(() => {
        if (window.location.pathname === '/watch') {
            if (document.querySelector('video') && !document.querySelector('.speed-time-wrapper')) {
                createSpeedTimeDisplay();
                updateTimeDisplay();
            }
        }
    });

    const observeTarget = document.querySelector('#player') || document.body;
    playerObserver.observe(observeTarget, {
        childList: true,
        subtree: true
    });

    document.addEventListener('ratechange', () => {
        updateTimeDisplay();
        if (!document.querySelector('.speed-time-wrapper')) {
            createSpeedTimeDisplay();
        }
    }, true);

    window.addEventListener('beforeunload', () => {
        stopUpdates();
        playerObserver.disconnect();
    });
})();
