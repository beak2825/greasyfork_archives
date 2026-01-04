// ==UserScript==
// @name         YouTube Playback Speed with Slider + Hold (Space/Click)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Temporarily boost playback speed by holding Spacebar or Left Mouse Button. Includes speed slider 1x-8x and delay.
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533085/YouTube%20Playback%20Speed%20with%20Slider%20%2B%20Hold%20%28SpaceClick%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533085/YouTube%20Playback%20Speed%20with%20Slider%20%2B%20Hold%20%28SpaceClick%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let speed = parseFloat(localStorage.getItem('youtubeSpeed')) || 4.0;
    let normalSpeed = 1.0;
    let spaceHeld = false;
    let mouseHeld = false;

    let spaceDelayTimer = null;
    let mouseDelayTimer = null;

    function updatePlaybackRate() {
        const video = document.querySelector('video');
        if (video) {
            video.playbackRate = (spaceHeld || mouseHeld) ? speed : normalSpeed;
        }
    }

    setInterval(updatePlaybackRate, 100);

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !spaceHeld && !spaceDelayTimer) {
            const active = document.activeElement.tagName.toLowerCase();
            if (active === 'input' || active === 'textarea' || document.activeElement.isContentEditable) return;

            // Verzögerung von 300ms bevor Space aktiviert
            spaceDelayTimer = setTimeout(() => {
                spaceHeld = true;
                updatePlaybackRate();
            }, 300);
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            clearTimeout(spaceDelayTimer);
            spaceDelayTimer = null;
            spaceHeld = false;
            updatePlaybackRate();
        }
    });

    document.addEventListener('mousedown', (e) => {
        const video = document.querySelector('video');
        if (e.button === 0 && video && video.contains(e.target)) {
            // Verzögerung von 300ms bevor Maushalten aktiviert
            mouseDelayTimer = setTimeout(() => {
                mouseHeld = true;
                updatePlaybackRate();
            }, 300);
        }
    });

    document.addEventListener('mouseup', (e) => {
        if (e.button === 0) {
            clearTimeout(mouseDelayTimer);
            mouseDelayTimer = null;
            mouseHeld = false;
            updatePlaybackRate();
        }
    });

    function createSliderMenu() {
        if (document.getElementById('sliderSpeedContainer')) return;

        const videoContainer = document.querySelector('.html5-video-player');
        if (!videoContainer) return;

        const container = document.createElement('div');
        container.id = 'sliderSpeedContainer';
        container.style.position = 'absolute';
        container.style.top = '100%';
        container.style.left = '90%';
        container.style.transform = 'translateX(-50%)';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '6px';
        container.style.fontSize = '14px';
        container.style.color = '#fff';
        container.style.background = 'rgba(0, 0, 0, 0)';
        container.style.borderRadius = '5px';
        container.style.padding = '5px';
        container.style.zIndex = '9999';
        container.style.width = '210px';
        container.style.boxSizing = 'border-box';

        const label = document.createElement('span');
        label.textContent = 'Speed:';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 1;
        slider.max = 8;
        slider.step = 0.5;
        slider.value = speed;
        slider.style.width = '120px';
        slider.style.margin = '0';

        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = `${speed}x`;

        slider.addEventListener('input', () => {
            speed = parseFloat(slider.value);
            valueDisplay.textContent = `${speed}x`;
            localStorage.setItem('youtubeSpeed', speed);
        });

        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);

        videoContainer.parentElement.appendChild(container);
    }

    const checkInterval = setInterval(() => {
        const video = document.querySelector('video');
        if (video) {
            createSliderMenu();
        }
    }, 1000);
})();
