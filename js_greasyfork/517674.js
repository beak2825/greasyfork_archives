// ==UserScript==
// @name         JST Clock msec
// @namespace    https://twitter.com/senanense
// @version      1.9.6
// @description  JST ClockのWebページを時報ツール化します
// @author       senanense
// @match        https://www.nict.go.jp/JST/JST5.html
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/517674/JST%20Clock%20msec.user.js
// @updateURL https://update.greasyfork.org/scripts/517674/JST%20Clock%20msec.meta.js
// ==/UserScript==

/* eslint-env es8 */
/* global Tesseract */

(function () {
    'use strict';

    document.body.innerHTML = '';

    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: "Times New Roman", serif;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 0 10%;
            margin: 0;
            transition: background-color 0.045s;
        }

        .white-box {
            width: 100%;
            background-color: white;
            transition: background-color 0.045s;
        }

        .white-box.large {
            height: 50px;
        }

        .white-box.medium {
            height: 50px;
        }

        .time-display {
            font-size: 3em;
            margin-top: 5%;
            margin-bottom: 0;
        }

        .offset-info {
            font-size: 2em;
            margin: 0;
        }

        .input-section {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
        }

        .input-section input[type="number"] {
            width: 50%;
            padding: 5px;
            font-size: 1em;
            margin-bottom: 0.5em;
        }

        .button-section {
            display: flex;
            align-items: center;
        }

        .button-section button {
            width: 100px;
            padding: 5px;
            font-size: 1em;
            margin-right: 10px;
        }

        .button-section label {
            margin-left: 10px;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.innerHTML = `
        <div class="white-box large"></div>
        <div class="time-display" id="timeDisplay">00:00:00.000</div>
        <div class="white-box large"></div>
        <div class="offset-info">offset : <span id="offset">0</span> ms</div>
        <div class="white-box medium"></div>
        <div class="input-section">
            <input type="number" id="timeAdjust" placeholder="ms">
            <div class="button-section">
                <button id="forwardButton">Forward</button>
                <button id="backwardButton">Backward</button>
                <label>
                    Flash:
                    <input type="checkbox" id="flashToggle">
                </label>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    let offset = 0;
    let serverTimeOffset = 0;
    let latencyCorrection = 0;
    const timeDisplay = document.getElementById('timeDisplay');
    const offsetDisplay = document.getElementById('offset');
    const flashToggle = document.getElementById('flashToggle');
    const whiteBoxes = document.querySelectorAll('.white-box');

    async function synchronizeWithServer() {
        try {
            const start = performance.now();
            const response = await fetch("https://worldtimeapi.org/api/timezone/Asia/Tokyo");
            const data = await response.json();
            const end = performance.now();

            const roundTripLatency = end - start;
            latencyCorrection = roundTripLatency / 2;

            const serverTime = new Date(data.utc_datetime).getTime();
            const localTime = Date.now();

            serverTimeOffset = serverTime - localTime + latencyCorrection;

        } catch (error) {
            console.error("Failed to synchronize with server time:", error);
            serverTimeOffset = 0;
        }
    }

    function updateDisplay() {
        const now = new Date(Date.now() + serverTimeOffset + offset);
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const milliseconds = now.getMilliseconds();

        timeDisplay.textContent = `${hours}:${minutes}:${seconds}.${String(milliseconds).padStart(3, '0')}`;

        if ((milliseconds > 908 && milliseconds < 989) && flashToggle.checked) {
            document.body.style.backgroundColor = "blue";
            whiteBoxes.forEach(box => box.style.backgroundColor = "blue");
        } else {
            document.body.style.backgroundColor = "white";
            whiteBoxes.forEach(box => box.style.backgroundColor = "white");
        }
    }

    function adjustTime(direction) {
        const inputField = document.getElementById('timeAdjust');
        const value = parseInt(inputField.value, 10);

        if (!isNaN(value)) {
            if (direction === 'forward') {
                offset += value;
            } else if (direction === 'backward') {
                offset -= value;
            }
            offsetDisplay.textContent = offset;
            updateDisplay();
        }
    }

    document.getElementById('forwardButton').addEventListener('click', () => adjustTime('forward'));
    document.getElementById('backwardButton').addEventListener('click', () => adjustTime('backward'));

    synchronizeWithServer().then(() => {
        setInterval(updateDisplay, 3);
    });
})();