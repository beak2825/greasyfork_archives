// ==UserScript==
// @name         | YouTube Music - Speed Control |
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a nice looking ah speed control bar to YouTube Music with real smooth playback adjustments
// @author       Emree.el
// @match        https://music.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520159/%7C%20YouTube%20Music%20-%20Speed%20Control%20%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/520159/%7C%20YouTube%20Music%20-%20Speed%20Control%20%7C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for modern dark UI
    const style = document.createElement('style');
    style.innerHTML = `
        .speed-control-container {
            position: fixed;
            top: 50%;
            right: 15px;
            z-index: 9999;
            transform: translateY(-50%);
            background: rgba(20, 20, 30, 0.95);
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(128, 0, 255, 0.8); /* Purple aura glow */
            display: none;
            flex-direction: column;
            align-items: center;
            animation: fadeIn 0.3s ease-in-out;
            font-family: 'Arial', sans-serif;
        }

        .speed-checkbox {
            position: fixed;
            top: 50%;
            right: 15px;
            width: 25px;
            height: 25px;
            cursor: pointer;
            background: #1c1c1c;
            border: 2px solid rgba(128, 0, 255, 0.8);
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 0 10px rgba(128, 0, 255, 0.5);
            transition: box-shadow 0.3s ease-in-out;
        }

        .speed-checkbox:hover {
            box-shadow: 0 0 20px rgba(128, 0, 255, 1); /* Glow effect on hover */
        }

        .speed-bar {
            width: 150px;
            height: 10px;
            margin-top: 10px;
            background: #333;
            border-radius: 10px;
            position: relative;
        }

        .speed-bar input[type="range"] {
            width: 100%;
            appearance: none;
            background: transparent;
            position: absolute;
            top: 0;
            margin: 0;
        }

        .speed-bar input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.9);
            cursor: pointer;
            border: 2px solid rgba(128, 0, 255, 0.8);
        }

        .speed-label {
            color: #fff;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 5px;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Create the checkbox
    const checkbox = document.createElement('div');
    checkbox.classList.add('speed-checkbox');
    document.body.appendChild(checkbox);

    // Create the control container
    const container = document.createElement('div');
    container.classList.add('speed-control-container');
    container.innerHTML = `
        <div class="speed-label">Playback Speed</div>
        <div class="speed-bar">
            <input type="range" min="0.5" max="2" step="0.1" value="1" id="speed-slider">
        </div>
    `;
    document.body.appendChild(container);

    // Toggle visibility
    checkbox.addEventListener('click', () => {
        container.style.display = container.style.display === 'flex' ? 'none' : 'flex';
    });

    // Handle speed changes
    const slider = document.getElementById('speed-slider');
    slider.addEventListener('input', () => {
        const player = document.querySelector('video, audio');
        if (player) {
            player.playbackRate = parseFloat(slider.value);
        }
    });
})();
