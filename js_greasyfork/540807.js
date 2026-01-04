// ==UserScript==
// @name         Google Home Video Speed Controller
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a simple, stable dropdown to control playback speed (including slow motion) on home.google.com.
// @author       Your Name
// @match        https://home.google.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540807/Google%20Home%20Video%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/540807/Google%20Home%20Video%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createSpeedControl(playerElement, videoElement) {
        // Updated options to include slow-motion, normal, and fast-forward speeds
        const speedOptions = [
            { label: '0.25x', value: 0.25 },
            { label: '0.5x', value: 0.5 },
            { label: '0.75x', value: 0.75 },
            { label: 'Normal', value: 1 },
            { label: '1.5x', value: 1.5 },
            { label: '2x', value: 2 },
            { label: '3x', value: 3 },
            { label: '5x', value: 5 },
            { label: '10x', value: 10 }
        ];

        const selectContainer = document.createElement('div');
        selectContainer.id = 'speed-control-container';
        selectContainer.style.cssText = 'display: inline-block; margin-left: 15px; vertical-align: middle;';

        const select = document.createElement('select');
        select.id = 'speed-select';
        select.style.cssText = 'background: #202124; color: white; border: 1px solid #5f6368; border-radius: 4px; padding: 8px 12px; font-size: 14px; cursor: pointer;';

        speedOptions.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.innerHTML = option.label;
            if (option.value === 1) opt.selected = true;
            select.appendChild(opt);
        });

        select.addEventListener('change', (event) => {
            const speed = parseFloat(event.target.value);
            videoElement.playbackRate = speed;
        });

        const centerButtons = playerElement.querySelector('.center-buttons');
        if (centerButtons) {
            centerButtons.appendChild(selectContainer);
            selectContainer.appendChild(select);
        }
    }

    function initialize() {
        const observer = new MutationObserver((mutations) => {
            const player = document.querySelector('ghw-full-player');
            if (player && player.querySelector('.center-buttons') && !document.getElementById('speed-control-container')) {
                const video = player.querySelector('video.isZoomable');
                if (video) {
                    createSpeedControl(player, video);
                    observer.disconnect();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    initialize();

})();