// ==UserScript==
// @name         YouTube Sharpness Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  A userscript that adds a sharpness toggle switch for YouTube videos.
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @author       Kirch (Kirchlive)
// @downloadURL https://update.greasyfork.org/scripts/499365/YouTube%20Sharpness%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/499365/YouTube%20Sharpness%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addSVGFilter() {
        const svgFilter = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgFilter.setAttribute('width', '0');
        svgFilter.setAttribute('height', '0');
        svgFilter.innerHTML = `
            <filter id="sharpness-filter">
                <feConvolveMatrix order="3" preserveAlpha="true" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0"/>
            </filter>
        `;
        document.body.appendChild(svgFilter);
    }

    function applySharpnessFilter(video, isEnabled) {
        if (isEnabled) {
            const sharpnessValue = 0.0005;
            const contrastValue = 0.995 - sharpnessValue * 0.5;
            const brightnessValue = 1 + sharpnessValue * 0.1;
            video.style.filter = `url(#sharpness-filter) contrast(${contrastValue}) brightness(${brightnessValue})`;
        } else {
            video.style.filter = 'none';
        }
    }

    function addSharpnessToggle() {
        const playerControls = document.querySelector('.ytp-chrome-bottom');
        if (!playerControls) return;

        const toggleContainer = document.createElement('div');
        toggleContainer.style.cssText = `
            position: absolute;
            right: 10px;
            top: -40px;
            color: white;
            display: flex;
            align-items: center;
            font-family: Arial, sans-serif;
        `;
        toggleContainer.innerHTML = `
            <span style="margin-right: 10px; font-weight: bold; font-size: 14px;">Sharpness Enhancer</span>
            <label class="switch">
                <input type="checkbox" id="sharpness-toggle">
                <span class="slider round"></span>
            </label>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .switch {
                position: relative;
                display: inline-block;
                width: 45px;
                height: 25.5px;
            }
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 19.5px;
                width: 19.5px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .4s;
            }
            input:checked + .slider {
                background-color: #2196F3;
            }
            input:checked + .slider:before {
                transform: translateX(19.5px);
            }
            .slider.round {
                border-radius: 25.5px;
            }
            .slider.round:before {
                border-radius: 50%;
            }
        `;

        document.head.appendChild(style);
        playerControls.appendChild(toggleContainer);

        const toggle = toggleContainer.querySelector('#sharpness-toggle');
        const video = document.querySelector('video');

        // Lade den gespeicherten Zustand
        const savedState = GM_getValue('sharpnessEnhancerEnabled', false);
        toggle.checked = savedState;
        applySharpnessFilter(video, savedState);

        toggle.addEventListener('change', function() {
            GM_setValue('sharpnessEnhancerEnabled', this.checked);
            applySharpnessFilter(video, this.checked);
        });
    }

    function waitForVideo() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            addSVGFilter();
            addSharpnessToggle();
        } else {
            setTimeout(waitForVideo, 1000);
        }
    }

    // Überwache Seitenwechsel
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(waitForVideo, 1000);
        }
    }).observe(document, {subtree: true, childList: true});

    waitForVideo();
})();