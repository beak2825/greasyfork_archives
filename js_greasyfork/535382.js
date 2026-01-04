// ==UserScript==
// @name         ForceChain v1.3
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Jedi-themed enhancements for chaining in Torn with overlays, alerts, and shortcuts.
// @author       BeauMcSwain
// @license      MIT 
// @match        https://www.torn.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/535382/ForceChain%20v13.user.js
// @updateURL https://update.greasyfork.org/scripts/535382/ForceChain%20v13.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = GM_getValue('torn_api_key');
    const API_BASE = 'https://api.torn.com';

    // Tab activity and API call management
    let isTabActive = !document.hidden;
    let baseInterval = 5000; // 5 seconds when active
    let inactiveInterval = 15000; // 15 seconds when inactive
    let updateIntervalId = null;
    let lastUpdateTime = 0;
    let backoffTime = 5000; // Initial backoff for rate limiting
    const maxBackoff = 60000; // Max 1 minute backoff

    // Alert configurations
    const soundOptions = {
        'Bad Feeling 1': 'https://files.catbox.moe/s65k23.mp3',
        'Bad Feeling 2': 'https://files.catbox.moe/1zdlk5.mp3',
        'Battle Alarm': 'https://files.catbox.moe/whrs8c.mp3',
        'Cantina': 'https://files.catbox.moe/gcrwgd.mp3',
        'Carbonite Freezer': 'https://files.catbox.moe/fhmik9.mp3',
        'Chewy': 'https://files.catbox.moe/kma2wx.mp3',
        'Duel of the Fates': 'https://files.catbox.moe/0tsfyz.mp3',
        'Falcon Flyby': 'https://files.catbox.moe/71n5u0.mp3',
        'Falcon vs TIE': 'https://files.catbox.moe/oorupd.mp3',
        'Hello There': 'https://files.catbox.moe/6igums.mp3',
        'No One to Stop Us': 'https://files.catbox.moe/ar0l50.mp3',
        'Help Me': 'https://files.catbox.moe/s9rhfh.mp3',
        'Hyperdrive Trouble': 'https://files.catbox.moe/p3fm0u.mp3',
        'I Have You Now': 'https://files.catbox.moe/y4yjbn.mp3',
        'Impressive': 'https://files.catbox.moe/3g4ppa.mp3',
        'Its a Trap': 'https://files.catbox.moe/a8zweu.mp3',
        'Jump to Lightspeed': 'https://files.catbox.moe/hm3tjb.mp3',
        'Laughing': 'https://files.catbox.moe/nmmgkd.mp3',
        'Lightsaber': 'https://files.catbox.moe/sa3rq4.mp3',
        'Asteroid Chase': 'https://files.catbox.moe/sziwsy.mp3',
        'Pay Attention': 'https://files.catbox.moe/scgzsq.mp3',
        'R2 Freak Out': 'https://files.catbox.moe/290h16.mp3',
        'R2': 'https://files.catbox.moe/nmbibj.mp3',
        'Speeder Bike Flyby': 'https://files.catbox.moe/4i0v49.mp3',
        'Strong with the Force': 'https://files.catbox.moe/aqf49w.mp3',
        'Use the Force': 'https://files.catbox.moe/des6hn.mp3',
        'Utini': 'https://files.catbox.moe/ltxsv5.mp3',
        'Were Doomed': 'https://files.catbox.moe/keyd04.mp3',
        'X-Wing Fire': 'https://files.catbox.moe/70mdz0.mp3',
        'Random': 'random'
    };

    // Hidden death sound
    const DEATH_SOUND = 'https://files.catbox.moe/4zkmvk.mp3';
    let lastLifeStatus = null; // Track last life status

    const colorOptions = {
        'Red': 'rgba(255,0,0,0.2)',
        'Blue': 'rgba(0,0,255,0.2)',
        'Green': 'rgba(0,255,0,0.2)',
        'Yellow': 'rgba(255,255,0,0.2)',
        'Purple': 'rgba(128,0,128,0.2)',
        'Orange': 'rgba(255,165,0,0.2)'
    };

    let alert1Config = GM_getValue('alert1_config', {
        enabled: true,
        time: 60,
        soundEnabled: true,
        soundName: 'Utini',
        visualEnabled: true,
        visualColor: 'Blue'
    });

    let alert2Config = GM_getValue('alert2_config', {
        enabled: false,
        time: 30,
        soundEnabled: true,
        soundName: 'Help Me',
        visualEnabled: true,
        visualColor: 'Red'
    });

    // Position configuration
    let positionConfig = GM_getValue('position_config', 'top-right');

    // Target configuration
    let targetConfig = GM_getValue('target_config', {
        hideHospital: true,
        hideTraveling: true,
        sortBy: 'level',
        limit: 5
    });

    let alertsTriggered = {
        alert1: false,
        alert2: false
    };

    // Cross-tab communication keys
    const SHARED_DATA_KEY = 'easychain_shared_data';
    const ALERTS_STATUS_KEY = 'easychain_alerts_status';

    // Share alert status with other tabs
    function shareAlertStatus() {
        try {
            localStorage.setItem(ALERTS_STATUS_KEY, JSON.stringify(alertsTriggered));
        } catch (e) {
            console.error("Error sharing alert status:", e);
        }
    }

    // Check for updated alert status from other tabs
    function checkAlertStatus() {
        const alertStatusStr = localStorage.getItem(ALERTS_STATUS_KEY);
        if (!alertStatusStr) return;

        try {
            const sharedAlertStatus = JSON.parse(alertStatusStr);
            // Update our local alert status
            alertsTriggered = sharedAlertStatus;
        } catch (e) {
            console.error("Error parsing shared alert status:", e);
        }
    }

    // Check for updates from other tabs
    function checkForSharedData() {
        const sharedDataStr = localStorage.getItem(SHARED_DATA_KEY);
        if (!sharedDataStr) return false;

        try {
            const sharedData = JSON.parse(sharedDataStr);

            // Only use shared data if it's fresh (less than 10 seconds old)
            if (Date.now() - sharedData.timestamp < 10000) {
                // Reduced logging for production
                console.log("Using shared data from another tab");
                updateFromSharedData(sharedData);
                return true;
            }
        } catch (e) {
            console.error("Error parsing shared data:", e);
        }

        return false;
    }

    // Share data with other tabs
    function shareDataWithTabs(userData, factionData, targetsData) {
        try {
            const sharedData = {
                timestamp: Date.now(),
                userData: userData,
                factionData: factionData,
                targetsData: targetsData
            };

            localStorage.setItem(SHARED_DATA_KEY, JSON.stringify(sharedData));
        } catch (e) {
            console.error("Error sharing data with other tabs:", e);
        }
    }

    // Update UI from shared data
    function updateFromSharedData(sharedData) {
        try {
            const bars = {
                energy: sharedData.userData.energy || sharedData.userData.bars?.energy || {},
                nerve: sharedData.userData.nerve || sharedData.userData.bars?.nerve || {},
                chain: sharedData.userData.chain || sharedData.userData.bars?.chain || {}
            };

            const profile = {
                player_id: sharedData.userData.player_id,
                name: sharedData.userData.name
            };

            updateUI({
                bars,
                profile,
                chain: sharedData.factionData.chain,
                isSharedData: true
            });

            updateTargetsList(sharedData.targetsData.list);

            // Update the last update time
            lastUpdateTime = sharedData.timestamp;
        } catch (e) {
            console.error("Error updating from shared data:", e);
        }
    }

    // Adjust update interval based on tab activity
    function adjustUpdateInterval() {
        if (updateIntervalId) {
            clearInterval(updateIntervalId);
        }

        const interval = isTabActive ? baseInterval : inactiveInterval;
        updateIntervalId = setInterval(() => {
            // Check for shared data first
            const usedSharedData = checkForSharedData();

            // Only make API call if we're active or it's been too long since last update
            if (isTabActive || !usedSharedData) {
                fetchAndUpdate();
            }
        }, interval);

        // If becoming active and it's been a while since the last update, fetch immediately
        if (isTabActive && Date.now() - lastUpdateTime > baseInterval) {
            fetchAndUpdate();
        }
    }

    // Handle API rate limiting
    function handleRateLimitError() {
        // Simplified logging for production
        console.log(`Rate limited. Backing off for ${backoffTime/1000} seconds`);

        if (updateIntervalId) {
            clearInterval(updateIntervalId);
        }

        setTimeout(() => {
            // Try again after backoff
            fetchAndUpdate();
            // Reset interval with potentially new backoff
            adjustUpdateInterval();
        }, backoffTime);

        // Increase backoff for next time (exponential)
        backoffTime = Math.min(backoffTime * 2, maxBackoff);

        // Update UI to show we're being rate limited
        const chainInfoEl = document.getElementById('chain-info');
        if (chainInfoEl) {
            chainInfoEl.innerText = `Rate limited. Retrying in ${backoffTime/1000}s...`;
        }
    }

    // Reset backoff after successful requests
    function resetBackoff() {
        backoffTime = 5000;
    }

    // Get the current synchronized server time
    function getServerTime() {
        // If we have a server time offset, use it to calculate current server time
        if (serverTimeUpdated > 0) {
            // Calculate how much time has passed since our last server time update
            const localTimeSinceUpdate = Math.floor(Date.now() / 1000) - serverTimeUpdated;
            // Add that to our last known server time
            // Add 1 second to compensate for processing delay
            return lastServerTime + localTimeSinceUpdate + 1;
        }

        // Fallback to local time if no server time available
        return Math.floor(Date.now() / 1000) + 1; // Add 1 second compensation
    }

    // Preload DOM elements
    let timerEl, chainInfoEl, lastUpdateEl;
    let countdownInterval;
    let currentChainEnd = 0;

    // Server time synchronization
    let serverTimeOffset = 0; // Difference between server time and local time
    let lastServerTime = 0;   // Last known server timestamp
    let serverTimeUpdated = 0; // When we last updated the server time

    function setupUI() {
        // Create a variable for test sound player
        let testSoundPlayer = null;
        let isTestPlaying = false;

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes animateGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            @keyframes lightsaberGlow {
                0% { box-shadow: 0 0 5px #4db7ff, 0 0 10px #4db7ff; }
                50% { box-shadow: 0 0 10px #4db7ff, 0 0 20px #4db7ff; }
                100% { box-shadow: 0 0 5px #4db7ff, 0 0 10px #4db7ff; }
            }
            @keyframes animateGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .alert-effect-red {
                position: relative;
                z-index: 900 !important;
            }
            .alert-effect-red::before {
                content: '';
                position: absolute;
                top: -5px; left: -5px; right: -5px; bottom: -5px;
                border-radius: 15px;
                background: linear-gradient(135deg, rgba(255,0,0,0.1), rgba(255,0,0,0.9), rgba(255,0,0,0.1));
                background-size: 300% 300%;
                animation: animateGradient 1s ease infinite;
                z-index: -1;
            }
            .alert-effect-blue {
                position: relative;
                z-index: 900 !important;
            }
            .alert-effect-blue::before {
                content: '';
                position: absolute;
                top: -5px; left: -5px; right: -5px; bottom: -5px;
                border-radius: 15px;
                background: linear-gradient(135deg, rgba(0,0,255,0.1), rgba(0,0,255,0.9), rgba(0,0,255,0.1));
                background-size: 300% 300%;
                animation: animateGradient 1s ease infinite;
                z-index: -1;
            }
            .alert-effect-green {
                position: relative;
                z-index: 900 !important;
            }
            .alert-effect-green::before {
                content: '';
                position: absolute;
                top: -5px; left: -5px; right: -5px; bottom: -5px;
                border-radius: 15px;
                background: linear-gradient(135deg, rgba(0,255,0,0.1), rgba(0,255,0,0.9), rgba(0,255,0,0.1));
                background-size: 300% 300%;
                animation: animateGradient 1s ease infinite;
                z-index: -1;
            }
            .alert-effect-yellow {
                position: relative;
                z-index: 900 !important;
            }
            .alert-effect-yellow::before {
                content: '';
                position: absolute;
                top: -5px; left: -5px; right: -5px; bottom: -5px;
                border-radius: 15px;
                background: linear-gradient(135deg, rgba(255,255,0,0.1), rgba(255,255,0,0.9), rgba(255,255,0,0.1));
                background-size: 300% 300%;
                animation: animateGradient 1s ease infinite;
                z-index: -1;
            }
            .alert-effect-purple {
                position: relative;
                z-index: 900 !important;
            }
            .alert-effect-purple::before {
                content: '';
                position: absolute;
                top: -5px; left: -5px; right: -5px; bottom: -5px;
                border-radius: 15px;
                background: linear-gradient(135deg, rgba(128,0,128,0.1), rgba(128,0,128,0.9), rgba(128,0,128,0.1));
                background-size: 300% 300%;
                animation: animateGradient 1s ease infinite;
                z-index: -1;
            }
            .alert-effect-orange {
                position: relative;
                z-index: 900 !important;
            }
            .alert-effect-orange::before {
                content: '';
                position: absolute;
                top: -5px; left: -5px; right: -5px; bottom: -5px;
                border-radius: 15px;
                background: linear-gradient(135deg, rgba(255,165,0,0.1), rgba(255,165,0,0.9), rgba(255,165,0,0.1));
                background-size: 300% 300%;
                animation: animateGradient 1s ease infinite;
                z-index: -1;
            }
            @keyframes pulseSize {
                0% { transform: scale(1); }
                25% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            @keyframes swordFlick {
                0% { transform: translateY(0) rotate(0deg); }
                25% { transform: translateY(-3px) rotate(5deg); }
                75% { transform: translateY(-1px) rotate(-3deg); }
                100% { transform: translateY(0) rotate(0deg); }
            }
            @keyframes timerPulse {
                0% { box-shadow: 0 0 5px rgba(77, 183, 255, 0.4); }
                50% { box-shadow: 0 0 12px rgba(77, 183, 255, 0.7); }
                100% { box-shadow: 0 0 5px rgba(77, 183, 255, 0.4); }
            }
            #chain-timer.pulsing {
                animation: pulseSize 1s infinite ease-in-out, timerPulse 2s infinite ease-in-out;
            }
            /* Jedi Theme */
            #torn-chain-helper {
                background-color: rgba(20, 22, 30, 0.92) !important;
                background-image: url('https://files.catbox.moe/0zibjr.jpg');
                background-position: top center;
                background-repeat: no-repeat;
                background-size: 530px 1500px;
                backdrop-filter: blur(3px);
                border: 1px solid rgba(77, 183, 255, 0.3);
                box-shadow: 0 0 10px rgba(77, 183, 255, 0.2);
                border-radius: 12px !important;
                transition: all 0.3s ease;
                padding: 12px !important;
            }
            #torn-chain-helper:hover {
                box-shadow: 0 0 15px rgba(77, 183, 255, 0.4);
            }
            #chain-timer {
                color: #4db7ff !important;
                font-family: 'Arial', sans-serif !important;
                letter-spacing: 1px;
                text-shadow: 0 0 5px rgba(77, 183, 255, 0.7);
                background: rgba(20, 25, 40, 0.9);
                border-radius: 8px;
                padding: 6px 12px;
                text-align: center;
                border: 1px solid rgba(77, 183, 255, 0.3);
                box-shadow: 0 0 8px rgba(77, 183, 255, 0.3);
                font-size: 28px !important;
                font-weight: bold;
            }
            #chain-info {
                color: #bfe0ff !important;
                background: rgba(20, 25, 40, 0.9);
                border-radius: 8px;
                padding: 6px 12px;
                margin: 8px 0;
                border: 1px solid rgba(77, 183, 255, 0.2);
            }
            #quick-actions {
                display: flex;
                justify-content: center;
                margin-bottom: 10px;
            }
            #quick-actions button {
                background: rgba(40, 75, 120, 0.85) !important;
                color: #e0f0ff !important;
                border: 1px solid rgba(77, 183, 255, 0.5) !important;
                border-radius: 6px !important;
                transition: all 0.2s ease;
                margin: 0 5px;
                padding: 7px 12px !important;
                font-weight: bold;
                font-size: 16px;
            }

            /* Settings button override - more specificity to override the above */
            #quick-actions button#open-settings {
                background: rgba(80, 80, 90, 0.75) !important;
                border: 1px solid rgba(150, 150, 170, 0.5) !important;
            }
            #quick-actions button:hover {
                background: rgba(77, 183, 255, 0.5) !important;
                box-shadow: 0 0 8px rgba(77, 183, 255, 0.7);
                transform: translateY(-2px);
            }
            /* Settings button styling moved to more specific selector above */
            #settings-popup {
                padding-top: 0;
                max-height: none;
                overflow-y: visible;
            }
            .settings-section {
                background: rgba(20, 25, 40, 0.92);
                border: 1px solid rgba(77, 183, 255, 0.3);
                border-radius: 8px;
                padding: 8px;
                margin-bottom: 12px;
                margin-top: 16px;
                overflow: hidden;
            }
            .settings-section h4 {
                color: #4db7ff;
                margin: 0 0 5px 0 !important; /* Override Torn CSS */
                padding: 4px 0;
                text-align: center;
                text-shadow: 0 0 5px rgba(77, 183, 255, 0.5);
                border-bottom: 1px solid rgba(77, 183, 255, 0.3);
                cursor: pointer;
                user-select: none;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .settings-section h4 .toggle-icon {
                margin-right: 8px;
                transition: transform 0.3s ease;
            }
            .settings-section h4 .toggle-icon.collapsed {
                transform: rotate(-90deg);
            }
            .settings-section .section-content {
                max-height: 0;
                opacity: 0;
                transition: max-height 0.4s ease, opacity 0.3s ease, padding 0.4s ease;
                overflow: hidden;
                padding: 0 8px;
            }
            .settings-section .section-content.expanded {
                max-height: 400px;
                opacity: 1;
                padding: 8px;
            }
            .setting-row {
                display: flex;
                align-items: center;
                margin-bottom: 8px;
            }
            .setting-row input[type="checkbox"] {
                margin-right: 8px;
            }
            .setting-row label {
                margin-right: 10px;
                white-space: nowrap;
            }
            .setting-row select,
            .setting-row input[type="number"] {
                width: 100px;
            }
            .setting-row select#alert1-sound-select,
            .setting-row select#alert2-sound-select {
                width: 150px;
            }
            .setting-row input[type="number"]#alert1-time,
            .setting-row input[type="number"]#alert2-time {
                width: 50px;
            }
            .settings-button {
                background: rgba(40, 75, 120, 0.85) !important;
                color: #e0f0ff !important;
                border: 1px solid rgba(77, 183, 255, 0.5) !important;
                border-radius: 6px !important;
                transition: all 0.2s ease;
                margin: 5px 5px 5px 0;
                padding: 5px 10px !important;
                cursor: pointer;
            }
            .settings-button:hover {
                background: rgba(77, 183, 255, 0.5) !important;
                box-shadow: 0 0 8px rgba(77, 183, 255, 0.7);
            }
            .alert-test-button {
                background: rgba(40, 75, 120, 0.85) !important;
                color: #e0f0ff !important;
                border: 1px solid rgba(77, 183, 255, 0.5) !important;
                border-radius: 6px !important;
                transition: all 0.2s ease;
                margin-top: 8px;
                padding: 3px 8px !important;
                font-size: 12px;
                cursor: pointer;
            }
            .alert-test-button:hover {
                background: rgba(77, 183, 255, 0.5) !important;
                box-shadow: 0 0 8px rgba(77, 183, 255, 0.7);
            }
            input[type="checkbox"] {
                accent-color: #4db7ff;
            }
            input[type="number"] {
                background: rgba(28, 30, 40, 0.8);
                color: #e0f0ff;
                border: 1px solid rgba(77, 183, 255, 0.3);
                border-radius: 4px;
                padding: 2px 5px;
            }
            select {
                background: rgba(28, 30, 40, 0.8) !important;
                color: #e0f0ff !important;
                border: 1px solid rgba(77, 183, 255, 0.3) !important;
                border-radius: 4px !important;
                padding: 2px 5px !important;
            }
            #targets-list {
                background: rgba(20, 25, 40, 0.92);
                border-radius: 8px;
                padding: 10px;
                margin-top: 0;
                border: 1px solid rgba(77, 183, 255, 0.3);
            }
            #targets-list hr {
                display: none;
            }
            #targets-list strong {
                color: #4db7ff;
                display: block;
                margin: 0 0 8px 0;
                text-align: center;
                text-shadow: 0 0 5px rgba(77, 183, 255, 0.5);
                border-bottom: 1px solid rgba(77, 183, 255, 0.3);
                padding-bottom: 5px;
                font-size: 16px;
            }
            #targets-list div {
                display: flex;
                align-items: center;
            }
            #targets-list button {
                background: rgba(80, 0, 0, 0.9) !important;
                color: #e0f0ff !important;
                border: 1px solid rgba(255, 77, 77, 0.5) !important;
                border-radius: 6px !important;
                transition: all 0.2s ease;
                width: 24px;
                height: 24px;
                padding: 0 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 8px;
                flex-shrink: 0;
            }
            #targets-list button:hover {
                background: rgba(120, 0, 0, 0.8) !important;
                box-shadow: 0 0 8px rgba(255, 77, 77, 0.7);
                animation: swordFlick 0.5s ease-in-out;
            }
            #last-update {
                color: rgba(255, 255, 255, 0.5) !important;
                text-align: center;
                margin-top: 8px;
            }
            /* Lightsaber icon */
            .lightsaber-image {
                width: 20px;
                height: 20px;
                display: block;
            }
            /* Test Sound Button Styles */
            .test-sound-button {
                background: rgba(40, 75, 120, 0.85) !important;
                color: #e0f0ff !important;
                border: 1px solid rgba(77, 183, 255, 0.5) !important;
                border-radius: 6px !important;
                transition: all 0.2s ease;
                padding: 5px 10px !important;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin-right: 5px;
            }
            .test-sound-button:hover {
                background: rgba(77, 183, 255, 0.5) !important;
                box-shadow: 0 0 8px rgba(77, 183, 255, 0.7);
            }
            .test-sound-button.stop-button {
                background: rgba(120, 40, 40, 0.85) !important;
                border: 1px solid rgba(255, 77, 77, 0.5) !important;
            }
            .test-sound-button.stop-button:hover {
                background: rgba(255, 77, 77, 0.5) !important;
                box-shadow: 0 0 8px rgba(255, 77, 77, 0.7);
            }
            .icon-stop {
                display: inline-block;
                width: 12px;
                height: 12px;
                background: #fff;
                margin-right: 5px;
            }
        `;
        document.head.appendChild(style);

        const container = document.createElement('div');
        container.id = 'torn-chain-helper';
        container.style.position = 'fixed';
        container.style.zIndex = '10000';
        container.style.padding = '12px';
        container.style.fontFamily = 'Arial, sans-serif';

        // Set position based on config
        updatePosition(container, positionConfig);

        container.innerHTML = `
            <div id="chain-timer" style="font-size: 24px; font-weight: bold; margin-bottom: 6px;">00:00</div>
            <div id="chain-info" style="font-size: 16px; font-weight: normal; margin-bottom: 10px;">Loading...</div>
            <div id="quick-actions">
                <button style="color:#fff; background:#444;" id="open-items" title="Items">📦</button>
                <button style="color:#fff; background:#444;" id="open-my-meds" title="My Meds">🩹</button>
                <button style="color:#fff; background:#444;" id="open-jcc-meds" title="JCC Meds">🚑</button>
                <button style="color:#fff; background:#444;" id="open-settings" title="Settings" class="settings-btn">⚙</button>
            </div>
            <div id="settings-popup" style="display:none; margin-top:10px; padding-top:0px;">
                <!-- EasyChain Main Settings -->
                <div class="settings-section">
                    <h4><span class="toggle-icon">▼</span>EasyChain Settings</h4>
                    <div class="section-content expanded">
                        <div style="display:flex;flex-wrap:wrap;gap:5px;">
                            <button class="settings-button" id="refresh-data">🔄 Refresh Data</button>
                            <button class="settings-button" id="test-sounds">🔊 Test Sound</button>
                            <button class="settings-button" id="set-api-key">🔑 Set API Key</button>
                        </div>
                        <div class="setting-row">
                            <label>Position:</label>
                            <select id="position-select">
                                <option value="top-right">Top Right</option>
                                <option value="top-left">Top Left</option>
                                <option value="bottom-left">Bottom Left</option>
                                <option value="bottom-right">Bottom Right</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Alert 1 Settings -->
                <div class="settings-section">
                    <h4><span class="toggle-icon">▼</span>Alert 1</h4>
                    <div class="section-content">
                        <div class="setting-row">
                            <input type="checkbox" id="alert1-enabled">
                            <label>Alert Time (seconds):</label>
                            <input type="number" id="alert1-time" min="0">
                        </div>
                        <div class="setting-row">
                            <input type="checkbox" id="alert1-sound">
                            <label>Sound Alert:</label>
                            <select id="alert1-sound-select">
                                <option value="Bad Feeling 1">Bad Feeling 1</option>
                                <option value="Bad Feeling 2">Bad Feeling 2</option>
                                <option value="Battle Alarm">Battle Alarm</option>
                                <option value="Cantina">Cantina</option>
                                <option value="Carbonite Freezer">Carbonite Freezer</option>
                                <option value="Chewy">Chewy</option>
                                <option value="Duel of the Fates">Duel of the Fates</option>
                                <option value="Falcon Flyby">Falcon Flyby</option>
                                <option value="Falcon vs TIE">Falcon vs TIE</option>
                                <option value="Hello There">Hello There</option>
                                <option value="No One to Stop Us">No One to Stop Us</option>
                                <option value="Help Me">Help Me</option>
                                <option value="Hyperdrive Trouble">Hyperdrive Trouble</option>
                                <option value="I Have You Now">I Have You Now</option>
                                <option value="Impressive">Impressive</option>
                                <option value="Its a Trap">Its a Trap</option>
                                <option value="Jump to Lightspeed">Jump to Lightspeed</option>
                                <option value="Laughing">Laughing</option>
                                <option value="Lightsaber">Lightsaber</option>
                                <option value="Asteroid Chase">Asteroid Chase</option>
                                <option value="Pay Attention">Pay Attention</option>
                                <option value="R2 Freak Out">R2 Freak Out</option>
                                <option value="R2">R2</option>
                                <option value="Speeder Bike Flyby">Speeder Bike Flyby</option>
                                <option value="Strong with the Force">Strong with the Force</option>
                                <option value="Use the Force">Use the Force</option>
                                <option value="Utini">Utini</option>
                                <option value="Were Doomed">Were Doomed</option>
                                <option value="X-Wing Fire">X-Wing Fire</option>
                                <option value="Random">Random (Any Sound)</option>
                            </select>
                        </div>
                        <div class="setting-row">
                            <input type="checkbox" id="alert1-visual">
                            <label>Color Alert:</label>
                            <select id="alert1-color-select">
                                <option value="Red">Red</option>
                                <option value="Blue">Blue</option>
                                <option value="Green">Green</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Purple">Purple</option>
                                <option value="Orange">Orange</option>
                            </select>
                        </div>
                        <button id="test-alert1" class="alert-test-button">Test Alert 1</button>
                    </div>
                </div>

                <!-- Alert 2 Settings -->
                <div class="settings-section">
                    <h4><span class="toggle-icon">▼</span>Alert 2</h4>
                    <div class="section-content">
                        <div class="setting-row">
                            <input type="checkbox" id="alert2-enabled">
                            <label>Alert Time (seconds):</label>
                            <input type="number" id="alert2-time" min="0">
                        </div>
                        <div class="setting-row">
                            <input type="checkbox" id="alert2-sound">
                            <label>Sound Alert:</label>
                            <select id="alert2-sound-select">
                                <option value="Bad Feeling 1">Bad Feeling 1</option>
                                <option value="Bad Feeling 2">Bad Feeling 2</option>
                                <option value="Battle Alarm">Battle Alarm</option>
                                <option value="Cantina">Cantina</option>
                                <option value="Carbonite Freezer">Carbonite Freezer</option>
                                <option value="Chewy">Chewy</option>
                                <option value="Duel of the Fates">Duel of the Fates</option>
                                <option value="Falcon Flyby">Falcon Flyby</option>
                                <option value="Falcon vs TIE">Falcon vs TIE</option>
                                <option value="Hello There">Hello There</option>
                                <option value="No One to Stop Us">No One to Stop Us</option>
                                <option value="Help Me">Help Me</option>
                                <option value="Hyperdrive Trouble">Hyperdrive Trouble</option>
                                <option value="I Have You Now">I Have You Now</option>
                                <option value="Impressive">Impressive</option>
                                <option value="Its a Trap">Its a Trap</option>
                                <option value="Jump to Lightspeed">Jump to Lightspeed</option>
                                <option value="Laughing">Laughing</option>
                                <option value="Lightsaber">Lightsaber</option>
                                <option value="Asteroid Chase">Asteroid Chase</option>
                                <option value="Pay Attention">Pay Attention</option>
                                <option value="R2 Freak Out">R2 Freak Out</option>
                                <option value="R2">R2</option>
                                <option value="Speeder Bike Flyby">Speeder Bike Flyby</option>
                                <option value="Strong with the Force">Strong with the Force</option>
                                <option value="Use the Force">Use the Force</option>
                                <option value="Utini">Utini</option>
                                <option value="Were Doomed">Were Doomed</option>
                                <option value="X-Wing Fire">X-Wing Fire</option>
                                <option value="Random">Random (Any Sound)</option>
                            </select>
                        </div>
                        <div class="setting-row">
                            <input type="checkbox" id="alert2-visual">
                            <label>Color Alert:</label>
                            <select id="alert2-color-select">
                                <option value="Red">Red</option>
                                <option value="Blue">Blue</option>
                                <option value="Green">Green</option>
                                <option value="Yellow">Yellow</option>
                                <option value="Purple">Purple</option>
                                <option value="Orange">Orange</option>
                            </select>
                        </div>
                        <button id="test-alert2" class="alert-test-button">Test Alert 2</button>
                    </div>
                </div>

                <!-- Target Settings -->
                <div class="settings-section">
                    <h4><span class="toggle-icon">▼</span>Target Settings</h4>
                    <div class="section-content">
                        <div class="setting-row">
                            <div class="label-group">
                                <input type="checkbox" id="filter-hospital" checked>
                                <label>Hide Hospital</label>
                            </div>
                        </div>
                        <div class="setting-row">
                            <div class="label-group">
                                <input type="checkbox" id="filter-traveling" checked>
                                <label>Hide Traveling</label>
                            </div>
                        </div>
                        <div class="setting-row">
                            <label>Sort By:</label>
                            <select id="target-sort">
                                <option value="level">Level</option>
                                <option value="name">Name</option>
                            </select>
                        </div>
                        <div class="setting-row">
                            <label>Max Targets:</label>
                            <select id="target-limit">
                                <option value="3">3</option>
                                <option value="5" selected>5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div id="targets-list" style="margin-top:10px;"></div>
            <div id="last-update" style="font-size: 10px; color: #888; margin-top: 5px;">Last update: -- | v1.3</div>`;

        document.body.appendChild(container);

        // Get DOM elements for frequent access
        timerEl = document.getElementById('chain-timer');
        chainInfoEl = document.getElementById('chain-info');
        lastUpdateEl = document.getElementById('last-update');

        document.getElementById('open-items').addEventListener('click', () => {
            window.location.href = 'https://www.torn.com/item.php';
        });

        document.getElementById('open-my-meds').addEventListener('click', () => {
            window.location.href = 'https://www.torn.com/item.php#medical-items';
        });

        document.getElementById('open-jcc-meds').addEventListener('click', () => {
            window.location.href = 'https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=medical';
        });

        document.getElementById('open-settings').addEventListener('click', () => {
            const settings = document.getElementById('settings-popup');
            settings.style.display = settings.style.display === 'none' ? 'block' : 'none';
        });

        document.getElementById('refresh-data').addEventListener('click', () => {
            fetchAndUpdate(true); // Force refresh
        });

        document.getElementById('set-api-key').addEventListener('click', () => {
            const key = prompt('Enter your Torn API key:');
            if (key) {
                GM_setValue('torn_api_key', key);
                location.reload();
            }
        });

                    // Setup collapsible sections
        const sections = document.querySelectorAll('.settings-section');
        sections.forEach(section => {
            const header = section.querySelector('h4');
            const content = section.querySelector('.section-content');
            const toggleIcon = header.querySelector('.toggle-icon');

            // Check if this is the EasyChain Settings section
            if (header.textContent.includes('EasyChain Settings')) {
                // Default to expanded for EasyChain Settings
                toggleIcon.classList.remove('collapsed');
            } else {
                // Default to collapsed for other sections
                toggleIcon.classList.add('collapsed');
                content.classList.remove('expanded');
            }

            header.addEventListener('click', () => {
                const isExpanded = content.classList.contains('expanded');

                // Toggle current section
                content.classList.toggle('expanded');
                toggleIcon.classList.toggle('collapsed');

                if (isExpanded) {
                    // Currently expanded, will be collapsed
                    toggleIcon.textContent = '▼';
                } else {
                    // Currently collapsed, will be expanded
                    toggleIcon.textContent = '▼';
                }
            });
        });

        // Alert 1 settings
        const alert1EnabledCheckbox = document.getElementById('alert1-enabled');
        const alert1TimeInput = document.getElementById('alert1-time');
        const alert1SoundCheckbox = document.getElementById('alert1-sound');
        const alert1SoundSelect = document.getElementById('alert1-sound-select');
        const alert1VisualCheckbox = document.getElementById('alert1-visual');
        const alert1ColorSelect = document.getElementById('alert1-color-select');

        alert1EnabledCheckbox.checked = alert1Config.enabled;
        alert1TimeInput.value = alert1Config.time;
        alert1SoundCheckbox.checked = alert1Config.soundEnabled;
        alert1SoundSelect.value = alert1Config.soundName;
        alert1VisualCheckbox.checked = alert1Config.visualEnabled;
        alert1ColorSelect.value = alert1Config.visualColor;

        alert1EnabledCheckbox.addEventListener('change', () => {
            alert1Config.enabled = alert1EnabledCheckbox.checked;
            GM_setValue('alert1_config', alert1Config);
        });

        alert1TimeInput.addEventListener('input', () => {
            alert1Config.time = parseInt(alert1TimeInput.value, 10);
            GM_setValue('alert1_config', alert1Config);
        });

        alert1SoundCheckbox.addEventListener('change', () => {
            alert1Config.soundEnabled = alert1SoundCheckbox.checked;
            GM_setValue('alert1_config', alert1Config);
        });

        alert1SoundSelect.addEventListener('change', () => {
            alert1Config.soundName = alert1SoundSelect.value;
            GM_setValue('alert1_config', alert1Config);
        });

        alert1VisualCheckbox.addEventListener('change', () => {
            alert1Config.visualEnabled = alert1VisualCheckbox.checked;
            GM_setValue('alert1_config', alert1Config);
        });

        alert1ColorSelect.addEventListener('change', () => {
            alert1Config.visualColor = alert1ColorSelect.value;
            GM_setValue('alert1_config', alert1Config);
        });

        // Alert 2 settings
        const alert2EnabledCheckbox = document.getElementById('alert2-enabled');
        const alert2TimeInput = document.getElementById('alert2-time');
        const alert2SoundCheckbox = document.getElementById('alert2-sound');
        const alert2SoundSelect = document.getElementById('alert2-sound-select');
        const alert2VisualCheckbox = document.getElementById('alert2-visual');
        const alert2ColorSelect = document.getElementById('alert2-color-select');

        alert2EnabledCheckbox.checked = alert2Config.enabled;
        alert2TimeInput.value = alert2Config.time;
        alert2SoundCheckbox.checked = alert2Config.soundEnabled;
        alert2SoundSelect.value = alert2Config.soundName;
        alert2VisualCheckbox.checked = alert2Config.visualEnabled;
        alert2ColorSelect.value = alert2Config.visualColor;

        alert2EnabledCheckbox.addEventListener('change', () => {
            alert2Config.enabled = alert2EnabledCheckbox.checked;
            GM_setValue('alert2_config', alert2Config);
        });

        alert2TimeInput.addEventListener('input', () => {
            alert2Config.time = parseInt(alert2TimeInput.value, 10);
            GM_setValue('alert2_config', alert2Config);
        });

        alert2SoundCheckbox.addEventListener('change', () => {
            alert2Config.soundEnabled = alert2SoundCheckbox.checked;
            GM_setValue('alert2_config', alert2Config);
        });

        alert2SoundSelect.addEventListener('change', () => {
            alert2Config.soundName = alert2SoundSelect.value;
            GM_setValue('alert2_config', alert2Config);
        });

        alert2VisualCheckbox.addEventListener('change', () => {
            alert2Config.visualEnabled = alert2VisualCheckbox.checked;
            GM_setValue('alert2_config', alert2Config);
        });

        alert2ColorSelect.addEventListener('change', () => {
            alert2Config.visualColor = alert2ColorSelect.value;
            GM_setValue('alert2_config', alert2Config);
        });

        // Position settings
        const positionSelect = document.getElementById('position-select');
        positionSelect.value = positionConfig;

        positionSelect.addEventListener('change', () => {
            positionConfig = positionSelect.value;
            GM_setValue('position_config', positionConfig);
            updatePosition(container, positionConfig);
        });

        // Test alert buttons
        document.getElementById('test-alert1').addEventListener('click', () => {
            triggerAlert(alert1Config);
        });

        document.getElementById('test-alert2').addEventListener('click', () => {
            triggerAlert(alert2Config);
        });

        // Add event listener for test sounds button
        // Updated test sounds button with stop functionality
        document.getElementById('test-sounds').addEventListener('click', () => {
            const testSoundBtn = document.getElementById('test-sounds');

            if (isTestPlaying) {
                // Stop the current audio
                if (testSoundPlayer) {
                    testSoundPlayer.pause();
                    testSoundPlayer.currentTime = 0;
                    testSoundPlayer = null;
                }

                // Reset button
                testSoundBtn.innerHTML = '🔊 Test Sound';
                testSoundBtn.classList.remove('stop-button');
                isTestPlaying = false;
            } else {
                // Start playing the disco version
                testSoundPlayer = new Audio('https://www.dan-dare.org/Dan%20Saber/StarWarsMusicDiscoVersion.mp3');
                testSoundPlayer.volume = 0.7; // Set volume to 70%

                testSoundPlayer.play().then(() => {
                    // Minimal console logs for production
                    console.log("Test sound playing");

                    // Change button to stop button
                    testSoundBtn.innerHTML = '<span class="icon-stop"></span> Stop Test';
                    testSoundBtn.classList.add('stop-button');
                    isTestPlaying = true;

                    // Add ended event to reset button when sound finishes
                    testSoundPlayer.addEventListener('ended', () => {
                        testSoundBtn.innerHTML = '🔊 Test Sound';
                        testSoundBtn.classList.remove('stop-button');
                        isTestPlaying = false;
                        testSoundPlayer = null;
                    });

                }).catch(error => {
                    console.error("Error playing test sound:", error);
                    alert("Please enable audio in your browser settings to use sound alerts.");
                    isTestPlaying = false;
                });
            }
        });

        // Target filter settings
        const filterHospitalCheckbox = document.getElementById('filter-hospital');
        const filterTravelingCheckbox = document.getElementById('filter-traveling');
        const targetSortSelect = document.getElementById('target-sort');
        const targetLimitSelect = document.getElementById('target-limit');

        filterHospitalCheckbox.checked = targetConfig.hideHospital;
        filterTravelingCheckbox.checked = targetConfig.hideTraveling;
        targetSortSelect.value = targetConfig.sortBy;
        targetLimitSelect.value = targetConfig.limit.toString();

        filterHospitalCheckbox.addEventListener('change', () => {
            targetConfig.hideHospital = filterHospitalCheckbox.checked;
            GM_setValue('target_config', targetConfig);
            fetchAndUpdate(true); // Force refresh to apply new filter
        });

        filterTravelingCheckbox.addEventListener('change', () => {
            targetConfig.hideTraveling = filterTravelingCheckbox.checked;
            GM_setValue('target_config', targetConfig);
            fetchAndUpdate(true); // Force refresh to apply new filter
        });

        targetSortSelect.addEventListener('change', () => {
            targetConfig.sortBy = targetSortSelect.value;
            GM_setValue('target_config', targetConfig);
            fetchAndUpdate(true); // Force refresh to apply new sorting
        });

        targetLimitSelect.addEventListener('change', () => {
            targetConfig.limit = parseInt(targetLimitSelect.value, 10);
            GM_setValue('target_config', targetConfig);
            fetchAndUpdate(true); // Force refresh to apply new limit
        });
    }

    function updatePosition(element, position) {
        // Reset all position styles
        element.style.top = '';
        element.style.right = '';
        element.style.bottom = '';
        element.style.left = '';

        // Set new position
        switch(position) {
            case 'top-right':
                element.style.top = '10px';
                element.style.right = '10px';
                break;
            case 'top-left':
                element.style.top = '10px';
                element.style.left = '10px';
                break;
            case 'bottom-left':
                element.style.bottom = '10px';
                element.style.left = '10px';
                break;
            case 'bottom-right':
                element.style.bottom = '10px';
                element.style.right = '10px';
                break;
            default:
                element.style.top = '10px';
                element.style.right = '10px';
        }
    }

    function updateCountdown() {
        if (!timerEl) {
            timerEl = document.getElementById('chain-timer');
        }

        if (!timerEl || currentChainEnd === 0) return;

        // Use our synchronized server time to calculate remaining time
        const currentServerTime = getServerTime();
        const remainingTime = Math.max(0, currentChainEnd - currentServerTime);

        // Update timer text without the hourglass emoji
        const min = Math.floor(remainingTime / 60);
        const sec = remainingTime % 60;
        timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;

        // Color coding and pulsing
        if (remainingTime > 120) timerEl.style.color = 'white';
        else if (remainingTime > 60) timerEl.style.color = 'orange';
        else if (remainingTime > 0) timerEl.style.color = 'red';
        else timerEl.style.color = 'white';

        // Only pulse during the last minute
        timerEl.classList.toggle('pulsing', remainingTime > 0 && remainingTime <= 60);

        // Check for alerts during countdown
        if (remainingTime > 0) {
            // Check for shared alert status first to avoid duplicate alerts
            checkAlertStatus();

            // Alert 1 - checking within 1.5 second range to ensure we don't miss it
            if (alert1Config.enabled &&
                remainingTime <= alert1Config.time + 0.5 &&
                remainingTime >= alert1Config.time - 1 &&
                !alertsTriggered.alert1) {
                // Minimal log for important events
                console.log(`Alert 1 triggered at ${remainingTime}s`);
                triggerAlert(alert1Config);
                alertsTriggered.alert1 = true;
                // Immediately share updated status
                shareAlertStatus();
            }

            // Alert 2 - checking within 1.5 second range
            if (alert2Config.enabled &&
                remainingTime <= alert2Config.time + 0.5 &&
                remainingTime >= alert2Config.time - 1 &&
                !alertsTriggered.alert2) {
                // Minimal log for important events
                console.log(`Alert 2 triggered at ${remainingTime}s`);
                triggerAlert(alert2Config);
                alertsTriggered.alert2 = true;
                // Immediately share updated status
                shareAlertStatus();
            }
        }

        if (remainingTime === 0) {
            clearInterval(countdownInterval);
            currentChainEnd = 0;

            // Ensure a clean display at 0
            timerEl.textContent = '0:00';

            // Reset alerts when timer hits 0
            alertsTriggered.alert1 = false;
            alertsTriggered.alert2 = false;

            // Share the reset status
            shareAlertStatus();

            // Force an update to get new chain status
            setTimeout(() => {
                fetchAndUpdate(true);
            }, 2000);
        }
    }

    function triggerAlert(alertConfig) {
        // Minimal logging for production
        // console.log("Triggering alert with config:", alertConfig);

        // For test buttons, we don't want to update status or check if triggered
        const isTestAlert = document.activeElement &&
                          (document.activeElement.id === 'test-alert1' ||
                           document.activeElement.id === 'test-alert2');

        // Only check/update alert status if this is not a test
        if (!isTestAlert) {
            // Update alert status first
            if (alertConfig === alert1Config) {
                // Check if it's already been triggered
                if (alertsTriggered.alert1) {
                    return; // Don't trigger again
                }
                alertsTriggered.alert1 = true;
            } else if (alertConfig === alert2Config) {
                // Check if it's already been triggered
                if (alertsTriggered.alert2) {
                    return; // Don't trigger again
                }
                alertsTriggered.alert2 = true;
            }

            // Share alert status with other tabs
            shareAlertStatus();
        }

        // Trigger visual alert if enabled
        if (alertConfig.visualEnabled) {
            // Get the main container element
            const mainContainer = document.getElementById('mainContainer');

            // Apply the pulsing border effect to main elements
            if (mainContainer) {
                const colorClass = `alert-effect-${alertConfig.visualColor.toLowerCase()}`;
                mainContainer.classList.add(colorClass);

                // Remove the class after 5 seconds
                setTimeout(() => {
                    mainContainer.classList.remove(colorClass);
                }, 5000);
            }
        }

        // Trigger sound alert if enabled
        if (alertConfig.soundEnabled) {
            let soundUrl;

            // Handle random sound selection
            if (alertConfig.soundName === 'Random') {
                // Get all sound keys except 'Random'
                const soundKeys = Object.keys(soundOptions).filter(key => key !== 'Random');
                // Choose a random sound key
                const randomKey = soundKeys[Math.floor(Math.random() * soundKeys.length)];
                soundUrl = soundOptions[randomKey];
                console.log(`Random sound selected: ${randomKey}`);
            } else {
                soundUrl = soundOptions[alertConfig.soundName] || soundOptions['Utini'];
            }

            const audio = new Audio(soundUrl);
            audio.volume = 0.7; // Set volume to 70%
            audio.play().then(() => {
                // Minimal logging for production
                // console.log("Alert sound played successfully");
            }).catch(error => {
                console.error("Error playing alert sound:", error);
                alert("Please enable audio in your browser settings to use sound alerts.");
            });
        }
    }

    function updateUI(data) {
        // Minimal logging for production
        // console.log("UI Update Received:", data);

        // Destructure data safely
        const { bars = {}, profile = {}, chain = {}, isSharedData = false } = data || {};

        const updateTime = new Date();
        // Minimal logging for production
        // console.log("Update timestamp:", updateTime.toLocaleTimeString());

        const energy = Number.isFinite(bars.energy?.current) ? bars.energy.current : 0;
        const chainCount = Number.isFinite(chain?.current) ? chain.current : 0;
        const hitsRemaining = Math.floor(energy / 25);

        // Minimal logging for production
        // console.log(`Energy: ${energy}, Hits: ${hitsRemaining}`);

        if (!timerEl || !chainInfoEl || !lastUpdateEl) {
            timerEl = document.getElementById('chain-timer');
            chainInfoEl = document.getElementById('chain-info');
            lastUpdateEl = document.getElementById('last-update');
        }

        if (chainInfoEl) {
            chainInfoEl.innerHTML = `Hits Remaining: ${hitsRemaining} | Chain: ${chainCount}`;
        }

                    if (lastUpdateEl) {
            lastUpdateEl.textContent = `Last update: ${updateTime.toLocaleTimeString()} ${isSharedData ? '(shared)' : ''} | v1.3`;
        }

        // Clear existing countdown
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        // Calculate remaining time for chain
        let remainingTime = 0;
        if (chain && chain.current > 0) {
            // If there's an active chain, use end time
            if (chain.end > 0) {
                // Always update the end time from the API to ensure accuracy
                currentChainEnd = chain.end;
                const currentServerTime = getServerTime();
                remainingTime = Math.max(0, chain.end - currentServerTime);

                if (timerEl) {
                    // Start countdown - no hourglass here
                    const min = Math.floor(remainingTime / 60);
                    const sec = remainingTime % 60;
                    timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;

                    // Color coding and pulsing
                    if (remainingTime > 120) timerEl.style.color = 'white';
                    else if (remainingTime > 60) timerEl.style.color = 'orange';
                    else if (remainingTime > 0) timerEl.style.color = 'red';
                    else timerEl.style.color = 'white';

                    // Only pulse during the last minute
                    timerEl.classList.toggle('pulsing', remainingTime > 0 && remainingTime <= 60);
                }

                // Clear any existing countdown first to prevent multiple intervals
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                }

                // Start countdown with a more frequent update (every 500ms)
                countdownInterval = setInterval(updateCountdown, 500);
            }
        } else if (chain && chain.cooldown > 0) {
            // If in cooldown, show cooldown time
            remainingTime = chain.cooldown;
            currentChainEnd = 0;

            if (timerEl) {
                // Just time, no hourglass
                const min = Math.floor(remainingTime / 60);
                const sec = remainingTime % 60;
                timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
                timerEl.style.color = 'gray';
            }
        } else {
            currentChainEnd = 0;

            if (timerEl) {
                // Just zeros, no hourglass
                timerEl.textContent = `0:00`;
                timerEl.style.color = 'white';
            }
        }
    }

    async function updateTargetsList(targets) {
        const targetsList = document.getElementById('targets-list');
        targetsList.innerHTML = '<div style="margin: 0 0 8px 0;"><strong>Recommended Targets:</strong></div>';

        if (!targets) {
            targetsList.innerHTML += '<div style="color: #888;">No targets available</div>';
            return;
        }

        // Apply filters and sorting
        let availableTargets = targets.filter(target => {
            // Apply hospital filter
            if (targetConfig.hideHospital && target.status.state === 'Hospital') {
                return false;
            }
            // Apply traveling filter
            if (targetConfig.hideTraveling && target.status.state === 'Traveling') {
                return false;
            }
            return true;
        });

        // Sort targets
        switch (targetConfig.sortBy) {
            case 'level':
                availableTargets.sort((a, b) => b.level - a.level);
                break;
            case 'name':
                availableTargets.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Default sorting by level
                availableTargets.sort((a, b) => b.level - a.level);
                break;
        }

        // Limit the number of targets
        availableTargets = availableTargets.slice(0, targetConfig.limit);

        if (availableTargets.length === 0) {
            targetsList.innerHTML += '<div style="color: #888;">No available targets match your filters</div>';
            return;
        }

        for (const target of availableTargets) {
            const targetDiv = document.createElement('div');
            targetDiv.style.marginBottom = '5px';

            const attackButton = document.createElement('button');
            attackButton.style.background = '#844';
            attackButton.style.color = '#fff';
            attackButton.style.border = 'none';
            attackButton.style.cursor = 'pointer';
            attackButton.style.marginRight = '8px';
            attackButton.style.borderRadius = '4px';

            // Create lightsaber image
            const lightsaberImg = document.createElement('img');
            lightsaberImg.src = 'https://files.catbox.moe/aea8vl.webp';
            lightsaberImg.className = 'lightsaber-image';
            lightsaberImg.alt = 'Attack';
            attackButton.appendChild(lightsaberImg);

            attackButton.addEventListener('click', () => {
                GM_openInTab(`https://www.torn.com/loader.php?sid=attack&user2ID=${target.id}`, { active: true });
            });

            const targetInfo = document.createElement('span');

            // Check if target is in hospital or traveling and apply grey color
            const isUnavailable =
                (target.status.state === 'Hospital' || target.status.state === 'Traveling');

            if (isUnavailable) {
                targetInfo.style.color = '#aaaaaa';
            }

            targetInfo.innerHTML = `${target.name} [${target.level}] - ${target.status.description}`;

            targetDiv.appendChild(attackButton);
            targetDiv.appendChild(targetInfo);
            targetsList.appendChild(targetDiv);
        }
    }

    async function fetchAndUpdate(forceRefresh = false) {
        // If not forcing refresh and we're inactive, try to use shared data first
        if (!forceRefresh && !isTabActive && checkForSharedData()) {
            return; // Successfully used shared data, no need to make API calls
        }

        try {
            // Add cache-busting timestamp
            const timestamp = Date.now();

            // Fetch all user data including bars in one request
            const userResponse = await fetch(`${API_BASE}/user?selections=profile,bars,personalstats,attacksfull&key=${API_KEY}&timestamp=${timestamp}`);
            const userData = await userResponse.json();

            if (userData && userData.error) {
                // Handle rate limiting specifically
                if (userData.error.code === 5) { // Too many requests
                    handleRateLimitError();
                    return;
                }
                throw new Error(`User API error: ${userData?.error?.error} (${userData?.error?.code})`);
            }

            // Synchronize server time with our local time
            if (userData && userData.server_time) {
                const localTimeNow = Math.floor(Date.now() / 1000);
                lastServerTime = userData.server_time;
                serverTimeUpdated = localTimeNow;
                serverTimeOffset = lastServerTime - localTimeNow;
                // Log only when time offset is significant (more than 2 seconds)
                if (Math.abs(serverTimeOffset) > 2) {
                    console.log(`Server time offset: ${serverTimeOffset}s`);
                }
            }

            // Fetch faction chain data
            const factionResponse = await fetch(`${API_BASE}/faction?selections=chain&key=${API_KEY}&timestamp=${timestamp}`);
            const factionData = await factionResponse.json();

            if (factionData && factionData.error) {
                if (factionData.error.code === 5) { // Too many requests
                    handleRateLimitError();
                    return;
                }
                throw new Error(`Faction API error: ${factionData?.error?.error} (${factionData?.error?.code})`);
            }

            // Fetch targets list using API v2
            let targetsData = {};
            try {
                const targetsResponse = await fetch('https://api.torn.com/v2/user/list?cat=Targets&limit=10&sort=DESC', {
                    headers: {
                        'Authorization': `ApiKey ${API_KEY}`,
                        'Accept': 'application/json'
                    }
                });

                if (!targetsResponse.ok) {
                    if (targetsResponse.status === 429) { // Too many requests
                        handleRateLimitError();
                        return;
                    }
                    throw new Error(`API responded with status: ${targetsResponse.status}`);
                }

                targetsData = await targetsResponse.json();
                // Minimal logging for production
                console.log("Targets fetched successfully");
            } catch (e) {
                console.error('Failed to fetch targets:', e);
                targetsData = { error: { message: e.message } };
            }

            // Minimal logging for production - remove large data dumps
            console.log("API data fetched successfully");

            // Reset backoff after successful requests
            resetBackoff();

            // Extract data
            const bars = {
                energy: userData.energy || userData.bars?.energy || {},
                nerve: userData.nerve || userData.bars?.nerve || {},
                chain: userData.chain || userData.bars?.chain || {}
            };

            const profile = {
                player_id: userData.player_id,
                name: userData.name
            };

            // Update UI with fetched data
            updateUI({ bars, profile, chain: factionData.chain });
            updateTargetsList(targetsData.list);

            // Share data with other tabs if we're making API calls
            shareDataWithTabs(userData, factionData, targetsData);

            // Include alert status in shared data
            shareAlertStatus();

            // Update last update time
            lastUpdateTime = Date.now();

        } catch (e) {
            console.error('Error fetching Torn data:', e);
            if (chainInfoEl) {
                chainInfoEl.innerText = 'Error loading data. Check API key.';
            }
        }
    }

    function init() {
        setupUI();
        if (!API_KEY) {
            const chainInfoEl = document.getElementById('chain-info');
            if (chainInfoEl) {
                chainInfoEl.innerHTML = 'Please enter your Torn API key in settings ⚙️<br>then click \'Test Sound\' to ensure sounds are enabled.';
            }
            return;
        }

        // Listen for tab visibility changes
        document.addEventListener("visibilitychange", function() {
            isTabActive = !document.hidden;
            adjustUpdateInterval();
        });

        // Listen for shared data from other tabs
        window.addEventListener('storage', function(event) {
            if (event.key === SHARED_DATA_KEY) {
                checkForSharedData();
            } else if (event.key === ALERTS_STATUS_KEY) {
                checkAlertStatus();
            }
        });

        // Start update cycle
        fetchAndUpdate();
        adjustUpdateInterval();
    }

    window.addEventListener('load', init);
})();