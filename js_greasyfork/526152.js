// ==UserScript==
// @name         Powerline.io Data Logger
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Track and analyze your Powerline.io gameplay with real time statistics, name performance, and exportable data for deep insights
// @author       ᴀʏʟɪᴠᴀ  ⋆｡°·☁
// @match        https://powerline.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526152/Powerlineio%20Data%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/526152/Powerlineio%20Data%20Logger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default script name constant
    const defaultScriptName = "Powerline.io Data Logger";

    // Initialize storage if it doesn't exist
    if (!localStorage.getItem('powerlineData')) {
        localStorage.setItem('powerlineData', JSON.stringify({
            metadata: {
                playerName: '',
                startDate: new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            },
            playerNames: {},
            games: [],
            statistics: {
                totalGames: 0,
                averageTimeAlive: '0s',
                averageScore: 0,
                totalKills: 0,
                bestKillStreak: 0,
                bestScore: 0,
                deathTypes: {}
            }
        }));
    }

    let lastGameTime = null;
    let uiVisible = true;
    let currentGameName = null;

    // Constants for kill reasons
    const KILL_REASONS = {
        LEFT_SCREEN: 'LEFT_SCREEN',
        KILLED: 'KILLED',
        BOUNDARY: 'BOUNDARY',
        SUICIDE: 'SUICIDE',
        UNKNOWN: 'UNKNOWN'
    };

    // Monitors the player's name from the input field and in-game UI
    function monitorPlayerName() {
        const nickInput = document.getElementById('nick');
        if (nickInput && nickInput.value) {
            const name = nickInput.value.trim();
            if (name && name !== currentGameName) {
                updateCurrentName(name);
            }
        }
        const nameElements = document.querySelectorAll('.name');
        nameElements.forEach(elem => {
            const name = elem.textContent.trim();
            if (name && document.getElementById('nick') && name === document.getElementById('nick').value.trim()) {
                updateCurrentName(name);
            }
        });
    }

    // Updates the current game name and logs its usage in localStorage
    function updateCurrentName(newName) {
        if (!newName || newName === currentGameName || newName.length < 1 || newName.length > 15) return;

        currentGameName = newName;
        console.log("Current game name updated:", currentGameName);

        let data = JSON.parse(localStorage.getItem('powerlineData'));
        if (!data.playerNames[newName]) {
            data.playerNames[newName] = 1;
        } else {
            data.playerNames[newName]++;
        }
        data.metadata.lastUpdated = new Date().toISOString();
        localStorage.setItem('powerlineData', JSON.stringify(data));
        updateCounter();
    }

    // Returns the effective player name based on current game name or default
    function getEffectivePlayerName() {
        const data = JSON.parse(localStorage.getItem('powerlineData'));
        return currentGameName || data.metadata.playerName || 'Unknown';
    }

    // Listen for play button clicks and Enter key events in the nickname field
    document.addEventListener('DOMContentLoaded', function() {
        const playButton = document.querySelector('button[onclick*="clickPlay"]');
        if (playButton) {
            playButton.addEventListener('click', function() {
                const nickInput = document.getElementById('nick');
                if (nickInput && nickInput.value) {
                    updateCurrentName(nickInput.value.trim());
                }
            });
        }
        const nickInput = document.getElementById('nick');
        if (nickInput) {
            nickInput.addEventListener('keydown', function(event) {
                if (event.keyCode === 13) { // Enter key
                    updateCurrentName(this.value.trim());
                }
            });
        }
    });

    // Saves game data when changes are detected in gameplay elements
    function saveGameData() {
        const currentTime = document.getElementById('stat-time')?.textContent.trim();
        if (!currentTime || currentTime === lastGameTime || currentTime === '0s') {
            return;
        }
        lastGameTime = currentTime;

        const deathTitle = document.getElementById('stat-title')?.textContent.trim() || '';

        let killReason = KILL_REASONS.UNKNOWN;
        if (deathTitle.includes('COLLIDED')) {
            killReason = KILL_REASONS.BOUNDARY;
        } else if (deathTitle.includes('KILLED BY')) {
            killReason = KILL_REASONS.KILLED;
        } else if (deathTitle.includes('LEFT SCREEN')) {
            killReason = KILL_REASONS.LEFT_SCREEN;
        } else if (deathTitle.includes('SUICIDE')) {
            killReason = KILL_REASONS.SUICIDE;
        }

        let data = JSON.parse(localStorage.getItem('powerlineData'));
        monitorPlayerName();

        const currentKillStreak = parseInt(document.getElementById('stat-bks')?.textContent.trim() || '0');
        const currentScore = parseInt(document.getElementById('stat-blength')?.textContent.trim() || '0');
        const bestKillStreak = Math.max(currentKillStreak, data.statistics.bestKillStreak || 0);
        const bestScore = Math.max(currentScore, data.statistics.bestScore || 0);

        const gameData = {
            timestamp: new Date().toISOString(),
            timeAlive: currentTime,
            topPosition: document.getElementById('stat-top')?.textContent.trim() || '0',
            score: document.getElementById('stat-length')?.textContent.trim() || '0',
            currentKills: document.getElementById('stat-ks')?.textContent.trim() || '0',
            bestKillStreak: bestKillStreak.toString(),
            bestScore: bestScore.toString(),
            deathType: killReason,
            killedBy: deathTitle.includes('KILLED BY') ? deathTitle.split('KILLED BY')[1].trim() : 'none',
            playerName: currentGameName || 'Unknown',  // The actual in-game name used
            defaultName: data.metadata.playerName  // The player's default/main name
        };

        data.games.push(gameData);

        const scoreLimitInput = document.getElementById('score-limit-input');
        const infinityToggle = document.getElementById('infinity-toggle');
        const scoreLimit = parseInt(scoreLimitInput?.value || '0');
        if (!infinityToggle.checked && scoreLimit > 0 && data.games.length > scoreLimit) {
            data.games.sort((a, b) => parseInt(b.score) - parseInt(a.score));
            data.games = data.games.slice(0, scoreLimit);
        }

        data.metadata.lastUpdated = new Date().toISOString();
        data.statistics.bestKillStreak = bestKillStreak;
        data.statistics.bestScore = bestScore;
        data = updateStatistics(data);

        localStorage.setItem('powerlineData', JSON.stringify(data, null, 4));
        updateCounter();
    }

    // Update statistics based on logged games
    function updateStatistics(data) {
        data.statistics.totalGames = data.games.length;
        let totalTime = 0;
        let totalScore = 0;
        let totalKills = 0;

        data.games.forEach(game => {
            let time = parseFloat(game.timeAlive);
            if (!isNaN(time)) totalTime += time;

            let score = parseInt(game.score);
            if (!isNaN(score)) totalScore += score;

            let kills = parseInt(game.currentKills);
            if (!isNaN(kills)) totalKills += kills;
        });

        data.statistics.averageTimeAlive = data.games.length ? (totalTime / data.games.length).toFixed(1) + 's' : '0s';
        data.statistics.averageScore = data.games.length ? Math.round(totalScore / data.games.length) : 0;
        data.statistics.totalKills = totalKills;

        data.statistics.deathTypes = {};
        data.games.forEach(game => {
            if (!data.statistics.deathTypes[game.deathType]) {
                data.statistics.deathTypes[game.deathType] = 1;
            } else {
                data.statistics.deathTypes[game.deathType]++;
            }
        });

        return data;
    }

    // Create control panel element with styling
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.8);
        padding: 15px;
        border-radius: 8px;
        color: #00FFFF;
        transition: opacity 0.3s ease;
        font-family: Arial, sans-serif;
        box-shadow: 0 0 10px rgba(0, 0, 255, 0.3);
    `;

    // Header displaying the script name
    const headerDisplay = document.createElement('div');
    headerDisplay.style.cssText = `
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
    `;
    headerDisplay.textContent = defaultScriptName;

    // Info section for controls
    const controlsInfo = document.createElement('div');
    controlsInfo.style.cssText = `
        font-size: 11px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #00FFFF;
        opacity: 0.8;
    `;
    controlsInfo.innerHTML = `
        Controls:<br>
        ENTER - Hide panel<br>
        \` (Backtick) - Toggle panel
    `;

    // Current name display
    const nameDisplay = document.createElement('div');
    nameDisplay.style.cssText = `
        margin: 10px 0;
        padding: 10px 0;
        border-bottom: 1px solid #00FFFF;
        font-size: 12px;
    `;
    nameDisplay.innerHTML = `Current Name: <span id="current-name-display">None</span>`;

    // Default name input
    const nameInput = document.createElement('div');
    nameInput.style.cssText = `
        margin: 10px 0;
        padding: 10px 0;
        border-bottom: 1px solid #00FFFF;
    `;
    nameInput.innerHTML = `
        <label style="display: block; margin-bottom: 5px; font-size: 12px;">Default Player Name:</label>
        <input type="text" id="player-name-input" style="
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00FFFF;
            color: #00FFFF;
            padding: 5px;
            width: 100%;
            border-radius: 4px;
            font-size: 12px;
        ">
    `;

    // Score Limit Controls
    const scoreLimitDiv = document.createElement('div');
    scoreLimitDiv.style.cssText = `
        margin: 10px 0;
        padding: 10px 0;
        border-bottom: 1px solid #00FFFF;
    `;
    scoreLimitDiv.innerHTML = `
        <label style="display: block; margin-bottom: 5px; font-size: 12px;">Top Scores Limit:</label>
        <input type="number" id="score-limit-input" style="
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00FFFF;
            color: #00FFFF;
            padding: 5px;
            width: 100%;
            border-radius: 4px;
            font-size: 12px;
        " placeholder="e.g., 100">
        <label style="font-size: 12px; display: block; margin-top: 5px;">
            <input type="checkbox" id="infinity-toggle" style="margin-right: 5px;">
            Unlimited Records
        </label>
    `;

    const buttonStyle = `
        background-color: #004444;
        color: #00FFFF;
        border: 1px solid #00FFFF;
        padding: 8px 15px;
        margin: 5px;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 14px;
    `;

    // Export Data button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Data';
    exportButton.style.cssText = buttonStyle;
    exportButton.onclick = function() {
        const data = localStorage.getItem('powerlineData');
        const blob = new Blob([data], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const date = new Date().toISOString().split('T')[0];
        a.download = `powerline-data-${date}.json`;
        a.click();
    };

    // Clear Data button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear Data';
    clearButton.style.cssText = buttonStyle;
    clearButton.onclick = function() {
        if (confirm('Are you sure you want to clear all logged data?')) {
            const defaultName = JSON.parse(localStorage.getItem('powerlineData')).metadata.playerName;
            localStorage.setItem('powerlineData', JSON.stringify({
                metadata: {
                    playerName: defaultName,  // Preserve the default name
                    startDate: new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                },
                playerNames: {},
                games: [],
                statistics: {
                    totalGames: 0,
                    averageTimeAlive: '0s',
                    averageScore: 0,
                    totalKills: 0,
                    bestKillStreak: 0,
                    bestScore: 0,
                    deathTypes: {}
                }
            }));
            updateCounter();
        }
    };

    // Statistics display
    const statsDisplay = document.createElement('div');
    statsDisplay.style.cssText = `
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #00FFFF;
        font-size: 12px;
        text-align: left;
    `;

   function updateCounter() {
    const data = JSON.parse(localStorage.getItem('powerlineData'));
    const namesUsed = Object.keys(data.playerNames).length;
    const mostUsedName = Object.entries(data.playerNames)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    statsDisplay.innerHTML = `
        <div>Games logged: ${data.statistics.totalGames}</div>
        <div>Avg time: ${data.statistics.averageTimeAlive}</div>
        <div>Avg score: ${data.statistics.averageScore}</div>
        <div>Total kills: ${data.statistics.totalKills}</div>
        <div>Best streak: ${data.statistics.bestKillStreak}</div>
        <div>Best score: ${data.statistics.bestScore}</div>
        <div>Names used: ${namesUsed}</div>
        <div>Most used: ${mostUsedName}</div>
        <div>Default Name: ${data.metadata.playerName || 'None'}</div>
        <div>Current Name: ${currentGameName || 'None'}</div>
    `;

    const nameDisplaySpan = document.getElementById('current-name-display');
    if (nameDisplaySpan) {
        nameDisplaySpan.textContent = currentGameName || 'None';
    }
}

// Assemble the control panel
controlPanel.appendChild(headerDisplay);
controlPanel.appendChild(controlsInfo);
controlPanel.appendChild(nameDisplay);
controlPanel.appendChild(nameInput);
controlPanel.appendChild(scoreLimitDiv);
controlPanel.appendChild(exportButton);
controlPanel.appendChild(clearButton);
controlPanel.appendChild(statsDisplay);
document.body.appendChild(controlPanel);

// Set up the default name input
const defaultNameInput = nameInput.querySelector('#player-name-input');
defaultNameInput.value = JSON.parse(localStorage.getItem('powerlineData')).metadata.playerName;
defaultNameInput.addEventListener('change', function(e) {
    const data = JSON.parse(localStorage.getItem('powerlineData'));
    data.metadata.playerName = e.target.value;
    localStorage.setItem('powerlineData', JSON.stringify(data));
});

// Toggle control panel visibility
function toggleUIVisibility(force = null) {
    uiVisible = force !== null ? force : !uiVisible;
    controlPanel.style.opacity = uiVisible ? '1' : '0';
    controlPanel.style.pointerEvents = uiVisible ? 'auto' : 'none';
}

// Keyboard event listeners to hide/toggle the panel
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        toggleUIVisibility(false);
    } else if (e.key === '`') {
        toggleUIVisibility();
    }
});

// MutationObserver
const timeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'characterData' || mutation.type === 'childList') {
            saveGameData();
        }
    });
});

// Start observing the game time element
const startObserving = () => {
    const timeElement = document.getElementById('stat-time');
    if (timeElement) {
        timeObserver.observe(timeElement, {
            characterData: true,
            childList: true,
            subtree: true
        });
    }
};

// Initialize observation when the stat-time element is available
const checkInterval = setInterval(() => {
    if (document.getElementById('stat-time')) {
        startObserving();
        clearInterval(checkInterval);
    }
}, 1000);

// Additional observers for updating the player name from various UI elements
const setupNameObservers = () => {
    const leaderboard = document.getElementById('leaderboard');
    if (leaderboard) {
        new MutationObserver(monitorPlayerName).observe(leaderboard, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    const scoreDisplay = document.querySelector('.stats');
    if (scoreDisplay) {
        new MutationObserver(monitorPlayerName).observe(scoreDisplay, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
    const deathScreen = document.getElementById('stat-title');
    if (deathScreen) {
        new MutationObserver(monitorPlayerName).observe(deathScreen, {
            childList: true,
            characterData: true
        });
    }
};

const setupInterval = setInterval(() => {
    if (document.getElementById('leaderboard') ||
        document.querySelector('.stats') ||
        document.getElementById('stat-title')) {
        setupNameObservers();
        clearInterval(setupInterval);
    }
}, 1000);

updateCounter();
console.log('Enhanced Powerline.io Data Logger initialized with improved name tracking');
})();