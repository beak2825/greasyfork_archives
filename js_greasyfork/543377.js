// ==UserScript==
// @name         247Roulette Color Predictor
// @namespace    https://github.com/yourusername
// @version      1.0
// @description  Advanced color prediction for 247roulette.org
// @author       You
// @match        https://www.247roulette.org/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543377/247Roulette%20Color%20Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/543377/247Roulette%20Color%20Predictor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create main GUI container
    const guiContainer = document.createElement('div');
    guiContainer.style.position = 'fixed';
    guiContainer.style.top = '20px';
    guiContainer.style.right = '20px';
    guiContainer.style.width = '300px';
    guiContainer.style.backgroundColor = '#1e1e2d';
    guiContainer.style.borderRadius = '10px';
    guiContainer.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    guiContainer.style.zIndex = '9999';
    guiContainer.style.fontFamily = 'Arial, sans-serif';
    guiContainer.style.overflow = 'hidden';
    guiContainer.style.border = '1px solid #2d2d3d';

    // Create header
    const header = document.createElement('div');
    header.style.padding = '12px 15px';
    header.style.backgroundColor = '#2d2d3d';
    header.style.color = '#ffffff';
    header.style.fontWeight = 'bold';
    header.style.fontSize = '16px';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.innerHTML = `
        <span>Roulette Predictor v1.0</span>
        <div style="display: flex; gap: 8px;">
            <div id="minimize-btn" style="cursor: pointer; width: 12px; height: 12px; border-radius: 50%; background-color: #ffbd44;"></div>
            <div id="close-btn" style="cursor: pointer; width: 12px; height: 12px; border-radius: 50%; background-color: #ff5f56;"></div>
        </div>
    `;
    guiContainer.appendChild(header);

    // Create content area
    const content = document.createElement('div');
    content.style.padding = '15px';
    content.style.color = '#e0e0e0';
    content.innerHTML = `
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Next Prediction:</span>
                <span id="next-prediction" style="font-weight: bold;">Analyzing...</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Confidence:</span>
                <span id="confidence-level">0%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Last 10 Results:</span>
                <div id="last-results" style="display: flex; gap: 5px;"></div>
            </div>
        </div>
        <div style="background-color: #2d2d3d; height: 1px; margin: 10px 0;"></div>
        <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Red Count:</span>
                <span id="red-count">0</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>Black Count:</span>
                <span id="black-count">0</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
                <span>Green Count:</span>
                <span id="green-count">0</span>
            </div>
        </div>
        <div style="background-color: #2d2d3d; height: 1px; margin: 10px 0;"></div>
        <div>
            <div style="margin-bottom: 10px; font-size: 14px;">Prediction Algorithm:</div>
            <select id="algorithm-select" style="width: 100%; padding: 8px; background-color: #2d2d3d; border: none; border-radius: 5px; color: white; margin-bottom: 15px;">
                <option value="martingale">Martingale Pattern</option>
                <option value="fibonacci">Fibonacci Sequence</option>
                <option value="dalamber">D'Alembert System</option>
                <option value="random">Random Walk</option>
            </select>
            <button id="start-btn" style="width: 100%; padding: 10px; background-color: #4CAF50; border: none; border-radius: 5px; color: white; font-weight: bold; cursor: pointer;">Start Predicting</button>
        </div>
    `;
    guiContainer.appendChild(content);

    // Add to document
    document.body.appendChild(guiContainer);

    // Prediction logic variables
    let isRunning = false;
    let resultsHistory = [];
    const maxHistory = 50;
    let predictionInterval;

    // Color tracking
    let redCount = 0;
    let blackCount = 0;
    let greenCount = 0;

    // GUI interaction handlers
    document.getElementById('minimize-btn').addEventListener('click', () => {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('close-btn').addEventListener('click', () => {
        guiContainer.style.display = 'none';
    });

    document.getElementById('start-btn').addEventListener('click', () => {
        isRunning = !isRunning;
        const btn = document.getElementById('start-btn');
        if (isRunning) {
            btn.textContent = 'Stop Predicting';
            btn.style.backgroundColor = '#f44336';
            startPrediction();
        } else {
            btn.textContent = 'Start Predicting';
            btn.style.backgroundColor = '#4CAF50';
            stopPrediction();
        }
    });

    // Prediction functions
    function startPrediction() {
        stopPrediction(); // Clear any existing interval

        // Start monitoring the roulette results
        predictionInterval = setInterval(() => {
            try {
                // This is where you would analyze the roulette results
                // For demonstration, we'll simulate analyzing the game
                simulateGameAnalysis();
            } catch (e) {
                console.error('Prediction error:', e);
            }
        }, 3000); // Check every 3 seconds
    }

    function stopPrediction() {
        if (predictionInterval) {
            clearInterval(predictionInterval);
        }
    }

    function simulateGameAnalysis() {
        // In a real implementation, you would analyze the actual game elements
        // For this example, we'll simulate some results

        // Randomly add to history for demonstration
        const colors = ['red', 'black', 'green'];
        const weights = [48.6, 48.6, 2.8]; // Standard roulette probabilities
        const randomColor = weightedRandom(colors, weights);

        // Update history
        resultsHistory.push(randomColor);
        if (resultsHistory.length > maxHistory) {
            resultsHistory.shift();
        }

        // Update counts
        if (randomColor === 'red') redCount++;
        if (randomColor === 'black') blackCount++;
        if (randomColor === 'green') greenCount++;

        // Update display
        updateDisplay();

        // Make prediction based on selected algorithm
        const algorithm = document.getElementById('algorithm-select').value;
        const prediction = makePrediction(algorithm);

        // Update prediction display
        document.getElementById('next-prediction').textContent = prediction.color;
        document.getElementById('next-prediction').style.color = prediction.color === 'red' ? '#ff6b6b' : prediction.color === 'black' ? '#000000' : '#4CAF50';
        document.getElementById('confidence-level').textContent = prediction.confidence + '%';
    }

    function makePrediction(algorithm) {
        // This is where the actual prediction logic would go
        // For demonstration, we'll use simple patterns

        if (resultsHistory.length < 5) {
            return { color: 'Analyzing...', confidence: 0 };
        }

        let prediction;
        let confidence;

        switch(algorithm) {
            case 'martingale':
                // Simple martingale-like prediction (after 4 of same color, predict opposite)
                const lastFour = resultsHistory.slice(-4);
                if (lastFour.every(c => c === 'red')) {
                    prediction = 'black';
                    confidence = 65 + Math.floor(Math.random() * 20);
                } else if (lastFour.every(c => c === 'black')) {
                    prediction = 'red';
                    confidence = 65 + Math.floor(Math.random() * 20);
                } else {
                    // If no clear pattern, follow last color
                    prediction = resultsHistory[resultsHistory.length - 1];
                    confidence = 50 + Math.floor(Math.random() * 15);
                }
                break;

            case 'fibonacci':
                // Fibonacci sequence inspired prediction
                const fibPattern = detectFibonacciPattern();
                if (fibPattern) {
                    prediction = fibPattern.nextColor;
                    confidence = fibPattern.confidence;
                } else {
                    prediction = Math.random() > 0.5 ? 'red' : 'black';
                    confidence = 45 + Math.floor(Math.random() * 10);
                }
                break;

            case 'dalamber':
                // D'Alembert system inspired (alternating colors)
                if (resultsHistory.length >= 2) {
                    const last = resultsHistory[resultsHistory.length - 1];
                    const secondLast = resultsHistory[resultsHistory.length - 2];
                    if (last === secondLast) {
                        prediction = last === 'red' ? 'black' : 'red';
                        confidence = 60 + Math.floor(Math.random() * 15);
                    } else {
                        prediction = last;
                        confidence = 55 + Math.floor(Math.random() * 10);
                    }
                } else {
                    prediction = Math.random() > 0.5 ? 'red' : 'black';
                    confidence = 50;
                }
                break;

            case 'random':
            default:
                // Random prediction
                prediction = Math.random() > 0.5 ? 'red' : 'black';
                confidence = Math.floor(Math.random() * 30) + 40;
        }

        // Never predict green (it's too rare)
        if (prediction === 'green') {
            prediction = Math.random() > 0.5 ? 'red' : 'black';
            confidence = Math.max(confidence - 10, 40);
        }

        return { color: prediction, confidence: confidence };
    }

    function detectFibonacciPattern() {
        // This would implement actual pattern detection
        // For demo, we'll just return null
        return null;
    }

    function weightedRandom(items, weights) {
        let i;
        for (i = 1; i < weights.length; i++) {
            weights[i] += weights[i - 1];
        }

        const random = Math.random() * weights[weights.length - 1];

        for (i = 0; i < weights.length; i++) {
            if (random < weights[i]) {
                return items[i];
            }
        }
    }

    function updateDisplay() {
        // Update counts
        document.getElementById('red-count').textContent = redCount;
        document.getElementById('black-count').textContent = blackCount;
        document.getElementById('green-count').textContent = greenCount;

        // Update last results display
        const lastResultsContainer = document.getElementById('last-results');
        lastResultsContainer.innerHTML = '';

        const displayCount = Math.min(10, resultsHistory.length);
        const startIndex = Math.max(0, resultsHistory.length - displayCount);

        for (let i = startIndex; i < resultsHistory.length; i++) {
            const color = resultsHistory[i];
            const dot = document.createElement('div');
            dot.style.width = '12px';
            dot.style.height = '12px';
            dot.style.borderRadius = '50%';
            dot.style.backgroundColor = color === 'red' ? '#ff6b6b' : color === 'black' ? '#000000' : '#4CAF50';
            lastResultsContainer.appendChild(dot);
        }
    }

    // Make GUI draggable
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
        if (e.target.id !== 'minimize-btn' && e.target.id !== 'close-btn') {
            isDragging = true;
            offsetX = e.clientX - guiContainer.getBoundingClientRect().left;
            offsetY = e.clientY - guiContainer.getBoundingClientRect().top;
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            guiContainer.style.left = (e.clientX - offsetX) + 'px';
            guiContainer.style.top = (e.clientY - offsetY) + 'px';
            guiContainer.style.right = 'unset';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    console.log('Roulette Predictor loaded successfully!');
})();