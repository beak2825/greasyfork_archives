// ==UserScript==
// @name         MRaura
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Click the video element with a stylish GUI and a start button
// @author       MRaura
// @match        https://jerkmate.com/jerkmate-ranked
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526628/MRaura.user.js
// @updateURL https://update.greasyfork.org/scripts/526628/MRaura.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clicksPerformed = 0;
    let maxClicks = 100000;
    let clickInterval = 100;
    let clicking = false;
    let intervalID;

    // Create GUI container
    const gui = document.createElement('div');
    gui.id = 'radiantGui';
    gui.innerHTML = `
        <h3>MRaura</h3>
        <p>Total Clicks: <span id="totalClicks">0</span></p>
        <p>Max Clicks: <input type="number" id="maxClicks" value="${maxClicks}" min="1"></p>
        <p>Click Interval (ms): <input type="number" id="clickInterval" value="${clickInterval}" min="1"></p>
        <button id="startStopBtn">Start</button>
        <button id="resetBtn">Reset</button>
    `;
    document.body.appendChild(gui);

    // Add Styles
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        #radiantGui {
            position: fixed;
            top: 10px;
            right: 10px;
            background: linear-gradient(45deg, #1e1e1e, #333, #111);
            background-size: 200% 200%;
            animation: gradientAnimation 5s ease infinite;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 9999;
            width: 300px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
            cursor: move;
            font-family: Arial, sans-serif;
            text-align: center;
        }

        #radiantGui input {
            width: 80%;
            padding: 5px;
            background: #222;
            border: 1px solid #444;
            color: white;
            margin: 5px 0;
            border-radius: 5px;
        }

        #radiantGui button {
            width: 45%;
            padding: 10px;
            margin: 5px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
            transition: 0.3s;
        }

        #startStopBtn {
            background: #28a745;
            color: white;
        }

        #startStopBtn:hover {
            background: #218838;
        }

        #resetBtn {
            background: #dc3545;
            color: white;
        }

        #resetBtn:hover {
            background: #c82333;
        }
    `;
    document.head.appendChild(style);

    // Draggable GUI
    let isDragging = false;
    let offsetX, offsetY;

    gui.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - gui.getBoundingClientRect().left;
        offsetY = e.clientY - gui.getBoundingClientRect().top;
        gui.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            gui.style.top = `${e.clientY - offsetY}px`;
            gui.style.left = `${e.clientX - offsetX}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        gui.style.cursor = 'move';
    });

    // Button Listeners
    document.getElementById('startStopBtn').addEventListener('click', () => {
        clicking ? stopClicking() : startClicking();
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        clicksPerformed = 0;
        updateClicksDisplay();
    });

    document.getElementById('maxClicks').addEventListener('input', (event) => {
        maxClicks = parseInt(event.target.value, 10);
    });

    document.getElementById('clickInterval').addEventListener('input', (event) => {
        clickInterval = parseInt(event.target.value, 10);
        if (clicking) {
            stopClicking();
            startClicking();
        }
    });

    // Clicking Logic
    function clickVideoElement() {
        const videoElement = document.querySelector('video[poster="/ui-contents/idleposter.jpg"]');
        if (videoElement) {
            videoElement.click();
            clicksPerformed++;
            if (clicksPerformed % 8 === 0) clickBuyButton();
            updateClicksDisplay();
        }
    }

    function clickBuyButton() {
        const buyButton = document.querySelector('button.buttonBuy');
        if (buyButton) buyButton.click();
    }

    function updateClicksDisplay() {
        document.getElementById('totalClicks').textContent = clicksPerformed;
    }

    function startClicking() {
        clicking = true;
        document.getElementById('startStopBtn').textContent = 'Stop';
        intervalID = setInterval(clickVideoElement, clickInterval);
    }

    function stopClicking() {
        clicking = false;
        document.getElementById('startStopBtn').textContent = 'Start';
        clearInterval(intervalID);
    }
})();
