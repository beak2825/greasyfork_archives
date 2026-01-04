// ==UserScript==
// @name         Dice Color RNG Predictor 
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Persistent RNG dice color predictor with dark purple UI
// @author       theo
// @match        https://www.online-dice.com/roll-color-dice/3/*
// @include      https://www.online-dice.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @description  join our discord https://discord.gg/MuUCebSYSD
// @downloadURL https://update.greasyfork.org/scripts/531750/Dice%20Color%20RNG%20Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/531750/Dice%20Color%20RNG%20Predictor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if we've already injected the UI
    if (document.getElementById('dicePredictorContainer')) {
        return;
    }

    // Dark purple UI styles
    const css = `
        #dicePredictorContainer {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background-color: #2a0a3a;
            border: 2px solid #8a2be2;
            border-radius: 10px;
            padding: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #e6d5ff;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        #dicePredictorTitle {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            color: #b388ff;
            border-bottom: 1px solid #8a2be2;
            padding-bottom: 8px;
            position: relative;
        }

        .discord-icon {
            position: absolute;
            right: 0;
            top: 0;
            width: 24px;
            height: 24px;
            cursor: pointer;
            transition: transform 0.2s;
        }

        .discord-icon:hover {
            transform: scale(1.1);
        }

        /* [Rest of your existing CSS remains exactly the same] */
    `;

    // Add styles to head
    GM_addStyle(css);

    // Color definitions
    const COLORS = {
        'red': '#ff5252',
        'orange': '#ff9800',
        'yellow': '#ffeb3b',
        'green': '#0f9d58',
        'blue': '#4285f4',
        'purple': '#9c27b0'
    };

    // Color names for display
    const COLOR_NAMES = {
        'red': 'Red',
        'orange': 'Orange',
        'yellow': 'Yellow',
        'green': 'Green',
        'blue': 'Blue',
        'purple': 'Purple'
    };

    // Create container for our predictor
    function createUI() {
        const container = document.createElement('div');
        container.id = 'dicePredictorContainer';
        container.innerHTML = `
            <div id="dicePredictorTitle">
                Dice Color RNG Predictor
                <svg class="discord-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
                    <path fill="#5865F2" d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
                </svg>
            </div>

            <div class="inputSection">
                <label class="inputLabel" for="dice1Color">First Dice Color:</label>
                <select class="colorSelect" id="dice1Color">
                    ${Object.entries(COLORS).map(([value, color]) =>
                        `<option value="${value}">${COLOR_NAMES[value]}</option>`
                    ).join('')}
                </select>

                <label class="inputLabel" for="dice2Color">Second Dice Color:</label>
                <select class="colorSelect" id="dice2Color">
                    ${Object.entries(COLORS).map(([value, color]) =>
                        `<option value="${value}">${COLOR_NAMES[value]}</option>`
                    ).join('')}
                </select>

                <label class="inputLabel" for="dice3Color">Third Dice Color:</label>
                <select class="colorSelect" id="dice3Color">
                    ${Object.entries(COLORS).map(([value, color]) =>
                        `<option value="${value}">${COLOR_NAMES[value]}</option>`
                    ).join('')}
                </select>

                <button id="predictButton">Generate Random Prediction</button>
            </div>

            <div id="predictionResult">
                <div id="predictionText">Random prediction will appear here</div>
                <div id="nextColorPrediction">?</div>
            </div>

            <div id="historyTitle">Prediction History</div>
            <div id="historyList"></div>
        `;

        // Add to body
        document.body.appendChild(container);

        // Add click handler for Discord icon
        document.querySelector('.discord-icon').addEventListener('click', () => {
            window.open('https://discord.gg/MuUCebSYSD', '_blank');
        });

        // Load saved state
        loadState();

        // Set up predict button
        document.getElementById('predictButton').addEventListener('click', makeRandomPrediction);
    }

    // [Rest of your existing functions remain exactly the same]
    // Save current state
    function saveState() {
        const state = {
            dice1: document.getElementById('dice1Color').value,
            dice2: document.getElementById('dice2Color').value,
            dice3: document.getElementById('dice3Color').value,
            history: predictionHistory
        };
        GM_setValue('dicePredictorState', JSON.stringify(state));
    }

    // Load saved state
    function loadState() {
        const savedState = GM_getValue('dicePredictorState');
        if (savedState) {
            try {
                const state = JSON.parse(savedState);

                // Restore dropdown values
                document.getElementById('dice1Color').value = state.dice1;
                document.getElementById('dice2Color').value = state.dice2;
                document.getElementById('dice3Color').value = state.dice3;

                // Restore history
                predictionHistory = state.history || [];
                updateHistoryDisplay();
            } catch (e) {
                console.error('Failed to load state:', e);
            }
        }
    }

    // Track history of predictions
    let predictionHistory = [];
    const MAX_HISTORY = 15;

    // Pure RNG prediction
    function makeRandomPrediction() {
        const color1 = document.getElementById('dice1Color').value;
        const color2 = document.getElementById('dice2Color').value;
        const color3 = document.getElementById('dice3Color').value;

        const currentColors = [color1, color2, color3];
        const allColors = Object.keys(COLORS);
        const prediction = allColors[Math.floor(Math.random() * allColors.length)];

        // Update prediction display
        const predictionElement = document.getElementById('nextColorPrediction');
        predictionElement.textContent = COLOR_NAMES[prediction];
        predictionElement.style.backgroundColor = COLORS[prediction];
        predictionElement.style.color = (prediction === 'yellow') ? '#000' : '#fff';

        // Add to history
        const time = new Date().toLocaleTimeString();
        const historyEntry = {
            time: time,
            colors: currentColors,
            prediction: prediction
        };

        predictionHistory.unshift(historyEntry);
        if (predictionHistory.length > MAX_HISTORY) {
            predictionHistory.pop();
        }

        updateHistoryDisplay();
        saveState();
    }

    // Update history display
    function updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;

        historyList.innerHTML = '';

        if (predictionHistory.length === 0) {
            historyList.innerHTML = '<div style="text-align: center; color: #ba55d3; padding: 10px;">No predictions yet</div>';
            return;
        }

        predictionHistory.forEach((entry, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'historyItem';

            historyItem.innerHTML = `
                <div class="historyTime">${index + 1}. ${entry.time}</div>
                <div class="historyColors">
                    ${entry.colors.map(color => `
                        <div class="colorBox" style="background-color: ${COLORS[color]}; color: ${(color === 'yellow') ? '#000' : '#fff'}">
                            ${COLOR_NAMES[color]}
                        </div>
                    `).join('')}
                </div>
                <div class="historyPrediction">
                    <span>Prediction:</span>
                    <div class="colorBox" style="background-color: ${COLORS[entry.prediction]}; color: ${(entry.prediction === 'yellow') ? '#000' : '#fff'}">
                        ${COLOR_NAMES[entry.prediction]}
                    </div>
                </div>
            `;

            historyList.appendChild(historyItem);
        });
    }

    // Initialize with random selections
    function randomizeInputs() {
        const colors = Object.keys(COLORS);
        document.getElementById('dice1Color').value = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('dice2Color').value = colors[Math.floor(Math.random() * colors.length)];
        document.getElementById('dice3Color').value = colors[Math.floor(Math.random() * colors.length)];
    }

    // Create the UI
    createUI();

    // Set up mutation observer to re-inject UI if removed
    const observer = new MutationObserver(function(mutations) {
        if (!document.getElementById('dicePredictorContainer')) {
            createUI();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Save state before page unload
    window.addEventListener('beforeunload', saveState);
})();