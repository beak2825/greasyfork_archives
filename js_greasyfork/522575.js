// ==UserScript==
// @name         Live AWT Calculator with Editable AHT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically calculates and displays AWT live with adjustable AHT.
// @author       Ahmed
// @match        https://support-frontend.console3.com/*
// @grant        GM_xmlhttpRequest
// @connect      slack.com
// @downloadURL https://update.greasyfork.org/scripts/522575/Live%20AWT%20Calculator%20with%20Editable%20AHT.user.js
// @updateURL https://update.greasyfork.org/scripts/522575/Live%20AWT%20Calculator%20with%20Editable%20AHT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const DEFAULT_AHT = 720; // 12 minutes in seconds
    const SLACK_CHANNEL_ID = 'C05LHNZ9Q2V';
    const SLACK_TOKEN = 'xoxb-4709085058-8207219493253-OE26AYctFyfwfQjxvOVyOs5c';
    const SELECTORS = {
        uq: '#root > div > div.gbqddh4 > div > div > div.s1t3gqky > div > div.s3m5axs > div:nth-child(2) > div.s11rxn21 > div:nth-child(1) > div:nth-child(1)',
        capacity: '#root > div > div.gbqddh4 > div > div > div.s1t3gqky > div > div.s3m5axs > div:nth-child(1) > div.s11rxn21 > div > div.t1ekqefo',
        awtDisplay: '#root > div > div.gbqddh4 > div > div > div.s1t3gqky > div > div.s3m5axs > div:nth-child(3)',
        onlineStatus: 'div.t1ekqefo',
        filters: 'div.stqww2s div.t1ekqefo',
        statsContainer: '.s3m5axs'  // Parent container for stats
    };

    // Phase thresholds in seconds
    const PHASE_THRESHOLDS = {
        PHASE_1: 180,  // 3 minutes
        PHASE_2: 300,  // 5 minutes
        PHASE_3: 600   // 10 minutes
    };

    // Track which phases have been notified
    let notificationsSent = {
        PHASE_2: false,
        PHASE_3: false
    };

    // Phase tracking
    let phaseStartTimes = {
        PHASE_2: null,
        PHASE_3: null
    };

    const PHASE_NOTIFICATION_DELAY = 15 * 60 * 1000; // 15 minutes in milliseconds

    // Reset phase notifications when moving to a lower phase
    function resetPhaseNotifications(currentAwt, previousAwt) {
        if (previousAwt === null) return;

        // Reset Phase 3 notification when dropping from Phase 3 to Phase 2
        if (currentAwt <= PHASE_THRESHOLDS.PHASE_3 && previousAwt > PHASE_THRESHOLDS.PHASE_3) {
            notificationsSent.PHASE_3 = false;
            notificationsSent.PHASE_2 = false; // Reset Phase 2 to allow new notification
        }
        // Reset Phase 2 notification when dropping below Phase 2
        else if (currentAwt <= PHASE_THRESHOLDS.PHASE_2 && previousAwt > PHASE_THRESHOLDS.PHASE_2) {
            notificationsSent.PHASE_2 = false;
        }
    }

    // Reset notification flags when AWT improves
    function resetNotificationFlags(awt) {
        if (awt < PHASE_THRESHOLDS.PHASE_2) {
            notificationsSent.PHASE_2 = false;
            notificationsSent.PHASE_3 = false;
            console.log('Reset all notification flags - AWT below Phase 2');
        } else if (awt < PHASE_THRESHOLDS.PHASE_3) {
            notificationsSent.PHASE_3 = false;
            console.log('Reset Phase 3 notification flag - AWT below Phase 3');
        }
    }

    // Track previous AWT value
    let previousAwt = null;

    // Function to get the appropriate country based on filters
    function getSelectedCountry() {
        const allElements = document.querySelectorAll(SELECTORS.filters);
        let isUserOnline = false;
        let foundFilters = null;
        let foundFirstOnline = false;

        allElements.forEach(element => {
            const text = element.textContent.toLowerCase().trim();
            console.log('Processing element text:', text);

            // If we already found filters for first online user, skip
            if (foundFilters) return;

            // Check for online status
            if (text === 'online' && !foundFirstOnline) {
                isUserOnline = true;
                foundFirstOnline = true;
                console.log('Found first online user');
            }

            // Only look for filters if we found our first online user
            // and the text contains filter keywords
            if (foundFirstOnline && text.includes('client entity') && (
                text.includes('egypt') ||
                text.includes('morocco') ||
                text.includes('tunisia') ||
                text.includes('algeria')
            )) {
                foundFilters = text;
                console.log('Found filters for first online user:', foundFilters);
            }
        });

        console.log('First online user filters:', foundFilters);
        console.log('Is user online:', isUserOnline);

        // Only proceed if user is online
        if (!isUserOnline) {
            console.log('User is not online');
            return 'No matching country configuration';
        }

        // Only proceed if we found filters
        if (!foundFilters) {
            console.log('No filters found for online user');
            return 'No matching country configuration';
        }

        // Check for Morocco/Algeria/Tunisia first
        const hasMorocco = foundFilters.includes('morocco');
        const hasAlgeria = foundFilters.includes('algeria');
        const hasTunisia = foundFilters.includes('tunisia');

        console.log('North Africa check:', {
            hasMorocco,
            hasAlgeria,
            hasTunisia,
            matchedTexts: foundFilters
        });

        if ((hasMorocco || hasAlgeria || hasTunisia) && isUserOnline) {
            console.log('Detected Morocco configuration with online user');
            return 'Morocco';
        }

        // Then check for Egypt + Arabic combination
        const hasEgypt = foundFilters.includes('egypt');
        const hasArabic = foundFilters.includes('arabic');
        console.log('Egypt check:', {
            hasEgypt,
            hasArabic,
            matchedTexts: foundFilters
        });

        if (hasEgypt && hasArabic) {
            console.log('Detected Egypt configuration with online user');
            return 'Egypt';
        }

        console.log('No matching country configuration found');
        return 'No matching country configuration';
    }

    // Function to check if a word exists as a whole word
    function hasExactWord(text, word) {
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        return regex.test(text);
    }

    // Function to send Slack notification
    function sendSlackNotification(phase, awt) {
        // Check if notifications are enabled
        if (localStorage.getItem('slack_notifications_enabled') === 'false') {
            console.log('Slack notifications are disabled');
            return;
        }

        const slackApiUrl = 'https://slack.com/api/chat.postMessage';
        const country = getSelectedCountry();
        let message = '';

        // Format AWT time
        const awtMinutes = Math.floor(awt / 60);
        const awtSeconds = Math.floor(awt % 60);
        const awtFormatted = `${awtMinutes}m:${awtSeconds}s`;

        if (country === 'Morocco') {
            const phaseMessages = {
                1: `🚨 Phase 1 Alert for 🇲🇦 Morocco\n<!channel>\nActions Required:\n• All agents focus ONLY on chats\n• Quality team handles calls\n• Increase each agent's chat capacity to 10\n• Stop asking "Do you have another question I can help with?"\n• Focus solely on reducing AWT\n• Assign someone on other tasks based on SLA (Email/appeals/reviews)\n\nImportant:\n• Monitor SLA: Emails (24h), Appeals/Reviews (2h)\n• Use unified tagging system\n• Keep tutors/supervisors informed\n\nCurrent AWT: ${awtFormatted}`,
                2: `🔥 Phase 2 Alert for 🇲🇦 Morocco\n<!channel>\nActions Required:\n• All agents focus ONLY on chats\n• Quality team handles calls\n• Increase each agent's chat capacity to 10\n• Stop asking "Do you have another question I can help with?"\n• Focus solely on reducing AWT\n• Assign someone on other tasks based on SLA (Email/appeals/reviews)\n\nImportant:\n• Monitor SLA: Emails (24h), Appeals/Reviews (2h)\n• Use unified tagging system\n• Keep tutors/supervisors informed\n\nCurrent AWT: ${awtFormatted}`,
                3: `⚠️ Phase 3 Critical Alert for 🇲🇦 Morocco\n<!channel>\nActions Required:\n• All agents focus ONLY on chats\n• Quality team handles calls\n• Increase each agent's chat capacity to 10\n• Stop asking "Do you have another question I can help with?"\n• Focus solely on reducing AWT\n• Assign someone on other tasks based on SLA (Email/appeals/reviews)\n\nImportant:\n• Monitor SLA: Emails (24h), Appeals/Reviews (2h)\n• Use unified tagging system\n• Keep tutors/supervisors informed\n\nCurrent AWT: ${awtFormatted}`
            };
            message = phaseMessages[phase];
        } else if (country === 'Egypt') {
            const phaseMessages = {
                1: `🚨 Phase 1 Alert for 🇪🇬 Egypt\n<!channel>\nActions Required:\n• All agents focus ONLY on chats except:\n  - One agent remains on calls\n  - One agent handles client queue\n• Increase each agent's chat capacity to 10\n• Stop asking "Do you have another question I can help with?"\n• Focus solely on reducing AWT\n• Assign someone on other tasks based on SLA (Email/appeals/reviews)\n\nImportant:\n• Monitor SLA: Emails (24h), Appeals/Reviews (2h)\n• Use unified tagging system\n• Keep tutors/supervisors informed\n\nCurrent AWT: ${awtFormatted}`,
                2: `🔥 Phase 2 Alert for 🇪🇬 Egypt\n<!channel>\nActions Required:\n• All agents focus ONLY on chats except:\n  - One agent remains on calls\n  - One agent handles client queue\n• Increase each agent's chat capacity to 10\n• Stop asking "Do you have another question I can help with?"\n• Focus solely on reducing AWT\n• Assign someone on other tasks based on SLA (Email/appeals/reviews)\n\nImportant:\n• Monitor SLA: Emails (24h), Appeals/Reviews (2h)\n• Use unified tagging system\n• Keep tutors/supervisors informed\n\nCurrent AWT: ${awtFormatted}`,
                3: `⚠️ Phase 3 Critical Alert for 🇪🇬 Egypt\n<!channel>\nActions Required:\n• All agents focus ONLY on chats except:\n  - One agent remains on calls\n  - One agent handles client queue\n• Increase each agent's chat capacity to 10\n• Stop asking "Do you have another question I can help with?"\n• Focus solely on reducing AWT\n• Assign someone on other tasks based on SLA (Email/appeals/reviews)\n\nImportant:\n• Monitor SLA: Emails (24h), Appeals/Reviews (2h)\n• Use unified tagging system\n• Keep tutors/supervisors informed\n\nCurrent AWT: ${awtFormatted}`
            };
            message = phaseMessages[phase];
        } else {
            console.log('No matching country configuration for Slack notification');
            return;
        }

        console.log('Attempting to send Slack notification:', {
            channel: SLACK_CHANNEL_ID,
            message: message
        });

        GM_xmlhttpRequest({
            method: 'POST',
            url: slackApiUrl,
            headers: {
                'Authorization': `Bearer ${SLACK_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                channel: SLACK_CHANNEL_ID,
                text: message,
                as_user: true
            }),
            onload: function(response) {
                console.log('Slack API Response:', response.responseText);
                const data = JSON.parse(response.responseText);
                if (!data.ok) {
                    console.error('Failed to send Slack notification:', data.error);
                } else {
                    console.log('Successfully sent Slack notification for Phase ' + phase);
                }
            },
            onerror: function(error) {
                console.error('Error sending Slack notification:', error);
            }
        });
    }

    // Function to check phases and send notifications
    function checkPhasesAndNotify(awt) {
        const currentPhase = determinePhase(awt);
        const now = Date.now();

        // Reset phase timers if AWT drops below their threshold
        if (awt < PHASE_THRESHOLDS.PHASE_2) {
            phaseStartTimes.PHASE_2 = null;
            phaseStartTimes.PHASE_3 = null;
            return;
        }

        if (awt < PHASE_THRESHOLDS.PHASE_3) {
            phaseStartTimes.PHASE_3 = null;
        }

        // Start tracking Phase 2
        if (awt >= PHASE_THRESHOLDS.PHASE_2 && !phaseStartTimes.PHASE_2) {
            phaseStartTimes.PHASE_2 = now;
            console.log('Started tracking Phase 2 at:', new Date(phaseStartTimes.PHASE_2).toLocaleTimeString());
        }

        // Start tracking Phase 3
        if (awt >= PHASE_THRESHOLDS.PHASE_3 && !phaseStartTimes.PHASE_3) {
            phaseStartTimes.PHASE_3 = now;
            console.log('Started tracking Phase 3 at:', new Date(phaseStartTimes.PHASE_3).toLocaleTimeString());
        }

        // Check if notifications should be sent
        if (phaseStartTimes.PHASE_3 && (now - phaseStartTimes.PHASE_3) >= PHASE_NOTIFICATION_DELAY) {
            if (!notificationsSent.PHASE_3) {
                sendSlackNotification(3, awt);
                notificationsSent.PHASE_3 = true;
                notificationsSent.PHASE_2 = true; // Prevent Phase 2 notification
                console.log('Sending Phase 3 notification after 15 minutes of sustained conditions');
            }
        } else if (phaseStartTimes.PHASE_2 && (now - phaseStartTimes.PHASE_2) >= PHASE_NOTIFICATION_DELAY) {
            if (!notificationsSent.PHASE_2 && !notificationsSent.PHASE_3) {
                sendSlackNotification(2, awt);
                notificationsSent.PHASE_2 = true;
                console.log('Sending Phase 2 notification after 15 minutes of sustained conditions');
            }
        }
    }

    // Function to determine the current phase
    function determinePhase(awt) {
        if (awt > PHASE_THRESHOLDS.PHASE_3) {
            if (!phaseStartTimes.PHASE_3) {
                phaseStartTimes.PHASE_3 = new Date().getTime();
            }
            return 3;
        } else if (awt > PHASE_THRESHOLDS.PHASE_2) {
            if (!phaseStartTimes.PHASE_2) {
                phaseStartTimes.PHASE_2 = new Date().getTime();
            }
            return 2;
        } else if (awt > PHASE_THRESHOLDS.PHASE_1) {
            return 1;
        }
        return 0;
    }

    // Add countdown tracking function
    function updatePhaseCountdown() {
        const now = new Date().getTime();

        if (phaseStartTimes.PHASE_3) {
            const elapsedTime = Math.floor((now - phaseStartTimes.PHASE_3) / 1000);
            console.log(`⚠️ Time in Phase 3: ${Math.floor(elapsedTime / 60)}m:${elapsedTime % 60}s`);
        } else if (phaseStartTimes.PHASE_2) {
            const elapsedTime = Math.floor((now - phaseStartTimes.PHASE_2) / 1000);
            console.log(`🔥 Time in Phase 2: ${Math.floor(elapsedTime / 60)}m:${elapsedTime % 60}s`);
        }
    }

    // Function to format time
    function formatTimeCounter(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Update UI with phase time
    function updatePhaseTimerUI() {
        const now = new Date().getTime();
        let phaseTimerDiv = document.querySelector('.phase-timer');
        const container = document.querySelector('.awt-container');

        if (!phaseTimerDiv && container) {
            phaseTimerDiv = document.createElement('div');
            phaseTimerDiv.className = 'phase-timer';
            container.appendChild(phaseTimerDiv);
        }

        if (phaseStartTimes.PHASE_3) {
            const elapsedTime = Math.floor((now - phaseStartTimes.PHASE_3) / 1000);
            phaseTimerDiv.textContent = `Time Spent in Phase 3: ${formatTimeCounter(elapsedTime)}`;
            phaseTimerDiv.className = 'phase-timer phase3';
        } else if (phaseStartTimes.PHASE_2) {
            const elapsedTime = Math.floor((now - phaseStartTimes.PHASE_2) / 1000);
            phaseTimerDiv.textContent = `Time Spent in Phase 2: ${formatTimeCounter(elapsedTime)}`;
            phaseTimerDiv.className = 'phase-timer phase2';
        } else {
            phaseTimerDiv.textContent = '';
        }
    }

    // Get AHT from localStorage or use default
    let AHT = parseInt(localStorage.getItem('awt_calculator_aht')) || DEFAULT_AHT;

    // Styles
    const STYLES = `
        :root {
            --background-color: #1C2024;
            --text-color: #9DD80C;
            --border-color: #2C3E50;
            --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            --transition-speed: 0.3s;
            --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .awt-calculator {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: var(--background-color);
            padding: 15px;
            border-radius: 8px;
            border: 2px solid var(--border-color);
            color: var(--text-color);
            font-family: 'Courier New', monospace;
            z-index: 10000;
            min-width: 200px;
        }

        .phase-timer {
            margin-top: 8px;
            font-size: 14px;
            color: var(--text-color);
            padding: 4px 0;
        }

        .phase-timer.phase2 {
            color: #FFA500;
        }

        .phase-timer.phase3 {
            color: #FF4444;
        }

        .awt-container {
            position: relative;
            background-color: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 10px;
            margin: 8px;
            color: var(--text-color);
            font-family: var(--font-family);
            width: 160px;
            height: 123px;
            box-shadow: var(--box-shadow);
            transition: all var(--transition-speed);
            display: flex;
            flex-direction: column;
        }

        .awt-container:hover {
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }

        .awt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0;
            margin-bottom: 4px;
            position: relative;
            height: 24px;
        }

        .awt-header span {
            font-size: 14px;
            font-weight: 500;
            letter-spacing: 0.3px;
            margin-left: 2px;
        }

        .header-controls {
            display: flex;
            align-items: center;
            gap: 4px;
            margin-right: 2px;
        }

        .notification-toggle {
            display: flex;
            align-items: center;
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 28px;
            height: 16px;
            min-width: 28px;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(204, 204, 204, 0.3);
            transition: .4s;
            border-radius: 16px;
        }

        .toggle-slider:before {
            position: absolute;
            content: "";
            height: 12px;
            width: 12px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .toggle-slider {
            background-color: #2196F3;
        }

        input:checked + .toggle-slider:before {
            transform: translateX(12px);
        }

        .awt-prediction {
            font-size: 24px;
            text-align: center;
            padding: 4px;
            color: var(--text-color);
            font-weight: 500;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 4px;
            letter-spacing: 0.5px;
            flex: 1;
        }

        .awt-prediction .unit {
            font-size: 16px;
            opacity: 0.8;
            font-weight: 400;
            margin: 0 1px;
        }

        .red-dot {
            width: 6px;
            height: 6px;
            background-color: #ff4444;
            border-radius: 50%;
            display: inline-block;
            margin-left: 4px;
            animation: blink 1s infinite;
        }

        @keyframes blink {
            0% { opacity: 0.3; }
            50% { opacity: 1; }
            100% { opacity: 0.3; }
        }

        .edit-icon {
            font-size: 14px;
            color: var(--text-color);
            opacity: 0.7;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all var(--transition-speed);
            background-color: transparent;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 2px;
        }

        .edit-icon:hover {
            opacity: 1;
            background-color: rgba(44, 62, 80, 0.3);
        }

        .aht-editor {
            display: none;
            position: absolute;
            top: 0;
            right: -180px;
            background-color: var(--background-color);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            padding: 12px;
            z-index: 1000;
            opacity: 0;
            transition: all var(--transition-speed);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            width: 160px;
            transform: translateX(20px);
        }

        .aht-editor.active {
            display: block;
            opacity: 1;
            transform: translateX(0);
        }

        .aht-editor input {
            width: 100%;
            padding: 8px;
            margin-bottom: 12px;
            background-color: rgba(255, 255, 255, 0.1);
            border: 1px solid var(--border-color);
            border-radius: 4px;
            color: var(--text-color);
            font-size: 14px;
            text-align: center;
            font-family: var(--font-family);
        }

        .buttons-container {
            display: flex;
            gap: 8px;
            justify-content: space-between;
        }

        .buttons-container button {
            flex: 1;
            padding: 6px 12px;
            background-color: var(--border-color);
            border: none;
            border-radius: 4px;
            color: var(--text-color);
            cursor: pointer;
            transition: all var(--transition-speed);
            font-size: 12px;
            font-weight: 500;
            font-family: var(--font-family);
        }

        .buttons-container button:hover {
            background-color: rgba(44, 62, 80, 0.8);
        }
    `;

    // Add styles to document
    function addStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = STYLES;
        document.head.appendChild(styleSheet);
    }

    // Function to create AHT editor
    function createAHTEditor() {
        const editor = document.createElement('div');
        editor.className = 'aht-editor';
        editor.innerHTML = `
            <input type="text" id="aht-input" placeholder="00:00">
            <div class="buttons-container">
                <button id="save-btn">Save</button>
                <button id="cancel-btn">Cancel</button>
            </div>
        `;
        return editor;
    }

    // Function to create the toggle switch
    function createNotificationToggle() {
        const toggle = document.createElement('div');
        toggle.className = 'notification-toggle';

        // Create icon and label
        const icon = document.createElement('span');
        icon.className = 'notification-icon';
        icon.textContent = '🔔';

        // Create the switch
        const label = document.createElement('label');
        label.className = 'toggle-switch';

        const input = document.createElement('input');
        input.type = 'checkbox';
        // Default to false if not set
        input.checked = localStorage.getItem('slack_notifications_enabled') === 'true';

        const slider = document.createElement('span');
        slider.className = 'toggle-slider';

        label.appendChild(input);
        label.appendChild(slider);

        toggle.appendChild(icon);
        toggle.appendChild(label);

        // Add event listener
        input.addEventListener('change', function() {
            localStorage.setItem('slack_notifications_enabled', this.checked.toString());
            console.log('Slack notifications:', this.checked ? 'enabled' : 'disabled');
        });

        return toggle;
    }

    // Function to calculate AWT
    function calculateAWT() {
        console.group('AWT Calculation Process');

        const uqElement = document.querySelector(SELECTORS.uq);
        const capacityElement = document.querySelector(SELECTORS.capacity);
        const awtDisplayElement = document.querySelector(SELECTORS.awtDisplay);
        const statsContainer = document.querySelector(SELECTORS.statsContainer);

        if (!uqElement || !capacityElement || !statsContainer) {
            console.log('Required elements not found');
            console.groupEnd();
            return;
        }

        // Create or get the AWT container
        let container = document.querySelector('.awt-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'awt-container';

            // Insert it as a new stat box in the stats container
            statsContainer.appendChild(container);

            const header = document.createElement('div');
            header.className = 'awt-header';

            const title = document.createElement('span');
            title.textContent = 'AWT';

            const headerControls = document.createElement('div');
            headerControls.className = 'header-controls';

            headerControls.appendChild(createNotificationToggle());

            const editIcon = document.createElement('span');
            editIcon.className = 'edit-icon';
            editIcon.innerHTML = '✎';
            editIcon.title = 'Edit AHT';
            headerControls.appendChild(editIcon);

            header.appendChild(title);
            header.appendChild(headerControls);
            container.appendChild(header);

            const awtLabel = document.createElement('div');
            awtLabel.className = 'awt-prediction';
            container.appendChild(awtLabel);

            // Create and add AHT editor
            const editor = createAHTEditor();
            container.appendChild(editor);

            // Add edit icon click handler
            editIcon.addEventListener('click', (e) => {
                e.stopPropagation();
                const currentAHTMinutes = Math.floor(AHT / 60);
                editor.querySelector('#aht-input').value = currentAHTMinutes;
                editor.classList.add('active');
                editor.querySelector('input').focus();
            });

            // Add editor event handlers
            editor.querySelector('#save-btn').addEventListener('click', () => {
                const newAHT = parseInt(editor.querySelector('#aht-input').value) * 60;
                if (!isNaN(newAHT) && newAHT > 0) {
                    AHT = newAHT;
                    localStorage.setItem('awt_calculator_aht', newAHT);
                    calculateAWT();
                }
                editor.classList.remove('active');
            });

            editor.querySelector('#cancel-btn').addEventListener('click', () => {
                editor.querySelector('#aht-input').value = '';
                editor.classList.remove('active');
            });

            // Close editor when clicking outside
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target)) {
                    editor.classList.remove('active');
                }
            });
        }
        let awtLabel = container.querySelector('.awt-prediction');
        if (!awtLabel) {
            awtLabel = document.createElement('div');
            awtLabel.className = 'awt-prediction';
        }
        const uq = parseFloat(uqElement.textContent);
        const capacity = parseFloat(capacityElement.textContent);

        console.log('Values:', { uq, capacity, AHT });

        if (isNaN(uq) || isNaN(capacity) || capacity === 0) {
            console.error('Invalid numbers detected');
            console.groupEnd();
            return;
        }

        const awt = (uq * AHT) / capacity;

        // Check phases and send notifications if needed
        checkPhasesAndNotify(awt);

        // Reset notification flags if AWT improves
        resetNotificationFlags(awt);

        const minutes = Math.floor(awt / 60);
        const seconds = Math.floor(awt % 60);
        const formattedTime = `${minutes}<span class="unit">m</span>:${seconds.toString().padStart(2, '0')}<span class="unit">s</span><span class="red-dot"></span>`;

        console.log('Calculation:', `(${uq} × ${AHT}) / ${capacity} = ${formattedTime}`);

        awtLabel.innerHTML = formattedTime;

        updatePhaseTimerUI();
        updatePhaseCountdown();

        console.groupEnd();
    }

    // Start periodic updates
    function startPeriodicUpdates() {
        calculateAWT(); // Initial calculation
        setInterval(calculateAWT, 1000); // Update every second
    }

    // Initialize the script
    function initialize() {
        if (document.querySelector(SELECTORS.uq) &&
            document.querySelector(SELECTORS.capacity) &&
            document.querySelector(SELECTORS.statsContainer)) {
            console.log('Initializing AWT Calculator');
            addStyles();
            startPeriodicUpdates();
        } else {
            console.log('Elements not found, retrying...');
            setTimeout(initialize, 1000);
        }
    }

    initialize();
})();
