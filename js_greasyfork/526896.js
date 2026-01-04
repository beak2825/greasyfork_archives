// ==UserScript==
// @name         Cartel Empire Online Tracker
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Track online status of Cartel Empire players
// @author       Kwyy [2054]
// @license      MIT
// @match        https://cartelempire.online/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526896/Cartel%20Empire%20Online%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/526896/Cartel%20Empire%20Online%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const API_KEY = 'YOURAPIKEY';
    const ONLINE_THRESHOLD = 300; // 5 minutes in seconds
    const PROPERTY_ID = '3577';
    
    // Item IDs
    const ITEM_IDS = {
        BANDAGE: '189A423F-FB36-41B1-8EDA-D27C0D01D228',
        COCAINE: '5FB12EB5-C544-4264-9CB9-1370601BFCBD',
        TAINTED: '68E8CCFC-A5CF-44C5-A661-F58B96CC5350',
        ANEJO: '591C0203-8ECD-46C8-8417-CFAAC2D19252',
        RAICILLA: '4AEB3A68-3A23-41A7-9FD7-2EAABF0D0545'
    };

    // Add styles for the tracker panel
    GM_addStyle(`
        #online-tracker {
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 5px;
            z-index: 9999;
            min-width: 400px;
            resize: none;
            overflow: visible;
        }
        #resize-handle {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 15px;
            height: 15px;
            cursor: se-resize;
            background: linear-gradient(135deg, transparent 50%, #666 50%);
            border-radius: 0 0 5px 0;
            opacity: 0.5;
            transition: opacity 0.2s;
        }
        #resize-handle:hover {
            opacity: 1;
        }
        #users-list {
            overflow-y: auto;
            max-height: calc(100% - 40px);
        }
        .user-entry {
            padding: 8px;
            margin: 4px 0;
            border-radius: 3px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .online { 
            background: rgba(76, 175, 80, 0.2);
            border-left: 3px solid #4CAF50;
        }
        .offline { 
            background: rgba(244, 67, 54, 0.2);
            border-left: 3px solid #f44336;
        }
        .user-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .user-info {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .user-stats {
            font-size: 0.9em;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 4px;
        }
        .status-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 5px;
        }
        .status-online { background-color: #4CAF50; }
        .status-offline { background-color: #f44336; }
        .in-hospital { color: #ff9800; }
        .in-jail { color: #f44336; }
        .subscriber { color: #2196F3; }
        .status-away { background-color: #ff9800; }
        .away { 
            background: rgba(255, 152, 0, 0.2);
            border-left: 3px solid #ff9800;
        }
    `);

    // Add styles for API counter
    GM_addStyle(`
        #api-counter {
            position: absolute;
            bottom: 2px;
            right: 5px;
            font-size: 0.8em;
            color: #666;
            text-align: right;
        }
    `);

    // Add styles for user management
    GM_addStyle(`
        #user-management {
            position: absolute;
            bottom: 5px;
            left: 5px;
            display: flex;
            gap: 5px;
            align-items: center;
            background: rgba(0, 0, 0, 0.8);
            padding: 5px;
            border-radius: 3px;
        }
        #add-user-input {
            width: 60px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            color: white;
            padding: 2px 5px;
            -moz-appearance: textfield;
        }
        #add-user-input::-webkit-outer-spin-button,
        #add-user-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        .management-btn {
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.2s;
            color: white;
            font-size: 1.2em;
            background: none;
            border: none;
            padding: 0 3px;
        }
        .management-btn:hover {
            opacity: 1;
        }
        #users-list {
            margin-bottom: 30px;
        }
        #api-counter {
            position: absolute;
            bottom: 5px;
            right: 25px;
        }
        .remove-user {
            color: #f44336;
            cursor: pointer;
            opacity: 0.4;
            font-size: 16px;
            padding: 0 5px;
            position: absolute;
            top: 5px;
            right: 5px;
        }
        .remove-user:hover {
            opacity: 1;
        }
        .user-entry {
            position: relative;
            padding-right: 25px;
        }
        .user-header {
            padding-right: 15px;
        }
    `);

    // Add styles for action buttons
    GM_addStyle(`
        .attack-btn, .hospital-btn, .mug-btn {
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 8px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0.8;
            transition: opacity 0.2s, background-color 0.2s;
            width: 32px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
        }
        .attack-btn:hover:not(:disabled), 
        .hospital-btn:hover:not(:disabled),
        .mug-btn:hover:not(:disabled) {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
        }
        .attack-btn:disabled, 
        .hospital-btn:disabled,
        .mug-btn:disabled {
            background: transparent;
            cursor: not-allowed;
            opacity: 0.3;
        }
        .user-actions {
            display: flex;
            gap: 5px;
            align-items: center;
            margin-top: 4px;
        }
    `);

    // Add styles for war toggle
    GM_addStyle(`
        #war-toggle {
            background: transparent;
            color: #f44336;
            border: 1px solid #f44336;
            border-radius: 3px;
            padding: 2px 8px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0.8;
            transition: all 0.2s;
        }
        #war-toggle.active {
            background: #f44336;
            color: white;
        }
        .user-actions {
            display: none;
        }
        .show-war-actions .user-actions {
            display: flex;
        }
    `);

    // Add styles for toolbar
    GM_addStyle(`
        #tracker-toolbar {
            display: flex;
            gap: 5px;
            padding: 5px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 5px;
        }
        .toolbar-btn {
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            padding: 2px 8px;
            cursor: pointer;
            font-size: 14px;
            opacity: 0.8;
            transition: all 0.2s;
        }
        .toolbar-btn:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
        }
    `);

    // Add styles for deposit form
    GM_addStyle(`
        #deposit-form {
            padding: 5px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 5px;
        }
        #deposit-form .input-group {
            display: flex;
            gap: 5px;
        }
        #deposit-form .input-group.mt-auto + .input-group.mt-auto {
            margin-top: 5px;
        }
        #deposit-form .input-group-text {
            background: transparent;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            padding: 2px 8px;
            cursor: pointer;
        }
        #deposit-form .form-control {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 3px;
            color: white;
            padding: 2px 8px;
        }
        #deposit-form .btn-success {
            background: #4CAF50;
            border: none;
            border-radius: 3px;
            color: white;
            cursor: pointer;
            padding: 2px 16px;
            opacity: 0.9;
            transition: opacity 0.2s;
        }
        #deposit-form .btn-success:hover {
            opacity: 1;
        }
    `);

    // Add styles for timestamp
    GM_addStyle(`
        #timestamp {
            color: #888;
            font-size: 0.9em;
            padding: 5px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: right;
            padding-right: 25px;
        }
    `);

    // Add styles for cash display
    GM_addStyle(`
        #cash-display {
            color: #358000;
            padding: 5px;
            text-align: right;
            font-weight: bold;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 28px;
            padding-right: 25px;
            line-height: 1.2;
            transition: color 0.3s ease;
        }
        #cash-display.flash {
            animation: flashMultiple 5s;
        }
        @keyframes flashMultiple {
            0%, 20%, 40%, 60%, 80% { color: #f44336; }
            10%, 30%, 50%, 70%, 100% { color: #358000; }
        }
    `);

    // Add Discord webhook
    const DISCORD_WEBHOOK = 'YOUR_DISCORD_WEBHOOK_URL';

    // Track hospital states
    let hospitalStates = new Map();

    // Track hospital times
    let hospitalTimes = new Map();

    // Track online states
    let onlineStates = new Map();

    // Track API calls
    let apiCalls = [];

    // Track last notification times
    function getLastNotificationTime(type, userId) {
        try {
            const notifications = JSON.parse(localStorage.getItem('lastNotifications')) || {};
            return notifications[`${type}_${userId}`] || 0;
        } catch (error) {
            return 0;
        }
    }

    function setLastNotificationTime(type, userId) {
        try {
            const notifications = JSON.parse(localStorage.getItem('lastNotifications')) || {};
            notifications[`${type}_${userId}`] = Date.now();
            localStorage.setItem('lastNotifications', JSON.stringify(notifications));
        } catch (error) {
            console.error('Error saving notification time:', error);
        }
    }

    // Check if we should send notification (prevent duplicates across windows)
    function shouldSendNotification(type, userId) {
        const lastTime = getLastNotificationTime(type, userId);
        const now = Date.now();
        // Prevent notifications within 5 seconds of each other
        if (now - lastTime < 5000) {
            return false;
        }
        setLastNotificationTime(type, userId);
        return true;
    }

    // Load hospital states from localStorage
    function loadHospitalStates() {
        try {
            const stored = localStorage.getItem('hospitalStates');
            return stored ? new Map(JSON.parse(stored)) : new Map();
        } catch (error) {
            console.error('Error loading hospital states:', error);
            return new Map();
        }
    }

    // Save hospital states to localStorage
    function saveHospitalStates() {
        try {
            localStorage.setItem('hospitalStates', JSON.stringify(Array.from(hospitalStates)));
        } catch (error) {
            console.error('Error saving hospital states:', error);
        }
    }

    // Load hospital times from localStorage
    function loadHospitalTimes() {
        try {
            const stored = localStorage.getItem('hospitalTimes');
            return stored ? new Map(JSON.parse(stored)) : new Map();
        } catch (error) {
            console.error('Error loading hospital times:', error);
            return new Map();
        }
    }

    // Save hospital times to localStorage
    function saveHospitalTimes() {
        try {
            localStorage.setItem('hospitalTimes', JSON.stringify(Array.from(hospitalTimes)));
        } catch (error) {
            console.error('Error saving hospital times:', error);
        }
    }

    // Load online states from localStorage
    function loadOnlineStates() {
        try {
            const stored = localStorage.getItem('onlineStates');
            return stored ? new Map(JSON.parse(stored)) : new Map();
        } catch (error) {
            console.error('Error loading online states:', error);
            return new Map();
        }
    }

    // Save online states to localStorage
    function saveOnlineStates() {
        try {
            localStorage.setItem('onlineStates', JSON.stringify(Array.from(onlineStates)));
        } catch (error) {
            console.error('Error saving online states:', error);
        }
    }

    // Send hospital notification to Discord
    function sendHospitalizedNotification(userData) {
        const embed = {
            title: "User Hospitalized",
            description: `**${userData.name}** has been hospitalized!\nTime: ${formatTimeRemaining(userData.hospitalRelease)}`,
            color: 0xff9800, // Orange color
            timestamp: new Date().toISOString()
        };

        const payload = {
            embeds: [embed]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: DISCORD_WEBHOOK,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onerror: function(error) {
                console.error('Error sending Discord notification:', error);
            }
        });
    }

    // Check hospital status changes
    function checkHospitalStatus(userData) {
        const wasInHospital = hospitalStates.get(userData.userId);
        const isInHospital = userData.hospitalRelease > Math.floor(Date.now() / 1000);
        
        // Check if user just got hospitalized
        if (!wasInHospital && isInHospital && shouldSendNotification('hospitalized', userData.userId)) {
            // Browser notification
            if (Notification.permission === "granted") {
                const notification = new Notification(`${userData.name} Hospitalized`, {
                    body: `${userData.name} has been hospitalized!\nTime: ${formatTimeRemaining(userData.hospitalRelease)}`,
                    icon: '/favicon.ico'
                });
            }

            // Discord notification
            sendHospitalizedNotification(userData);
        }
        
        // Check if user just got released
        if (wasInHospital && !isInHospital && shouldSendNotification('released', userData.userId)) {
            // Browser notification
            if (Notification.permission === "granted") {
                const notification = new Notification(`${userData.name} Released`, {
                    body: `${userData.name} has been released from the hospital!`,
                    icon: '/favicon.ico'
                });
            }

            // Discord notification
            sendReleasedNotification(userData);
        }

        // Update state
        hospitalStates.set(userData.userId, isInHospital);
        saveHospitalStates();
    }

    // Rename existing hospital notification function
    function sendReleasedNotification(userData) {
        const embed = {
            title: "Hospital Release",
            description: `**${userData.name}** has been released from the hospital!`,
            color: 0x4CAF50, // Green color
            timestamp: new Date().toISOString()
        };

        const payload = {
            embeds: [embed]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: DISCORD_WEBHOOK,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onerror: function(error) {
                console.error('Error sending Discord notification:', error);
            }
        });
    }

    // Send med notification to Discord
    function sendMedNotification(userData, timeReduced) {
        const minutes = Math.floor(timeReduced / 60);
        const embed = {
            title: "Medical Items Used",
            description: `**${userData.name}** has reduced their hospital time by ${minutes} minutes!`,
            color: 0x2196F3, // Blue color
            timestamp: new Date().toISOString()
        };

        const payload = {
            embeds: [embed]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: DISCORD_WEBHOOK,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onerror: function(error) {
                console.error('Error sending Discord notification:', error);
            }
        });
    }

    // Check for hospital time changes
    function checkHospitalTimeChange(userData) {
        const now = Math.floor(Date.now() / 1000);
        const currentRemainingTime = Math.max(0, userData.hospitalRelease - now);
        const previousTime = hospitalTimes.get(userData.userId);

        if (previousTime && currentRemainingTime > 0) {
            // Calculate expected time difference
            const timePassed = now - (previousTime.timestamp || 0);
            const expectedRemaining = Math.max(0, previousTime.remaining - timePassed);
            
            // If time reduced by more than 5 minutes (300 seconds)
            if (expectedRemaining - currentRemainingTime > 300) {
                const timeReduced = expectedRemaining - currentRemainingTime;
                
                // Browser notification
                if (Notification.permission === "granted") {
                    const notification = new Notification(`${userData.name} Used Meds`, {
                        body: `${userData.name} reduced hospital time by ${Math.floor(timeReduced / 60)} minutes`,
                        icon: '/favicon.ico'
                    });
                }

                // Discord notification
                if (shouldSendNotification('meds', userData.userId)) {
                    sendMedNotification(userData, timeReduced);
                }
            }
        }

        // Update stored time
        hospitalTimes.set(userData.userId, {
            remaining: currentRemainingTime,
            timestamp: now
        });
        saveHospitalTimes();
    }

    // Send online notification to Discord
    function sendOnlineNotification(userData) {
        const embed = {
            title: "User Online",
            description: `**${userData.name}** is now online!`,
            color: 0x4CAF50, // Green color
            timestamp: new Date().toISOString()
        };

        const payload = {
            embeds: [embed]
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: DISCORD_WEBHOOK,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(payload),
            onerror: function(error) {
                console.error('Error sending Discord notification:', error);
            }
        });
    }

    // Check online status changes
    function checkOnlineStatus(userData) {
        const wasOnline = onlineStates.get(userData.userId);
        const isOnlineNow = isOnline(userData.lastActive);
        
        // If user wasn't online before but is online now
        if (!wasOnline && isOnlineNow && shouldSendNotification('online', userData.userId)) {
            // Browser notification
            if (Notification.permission === "granted") {
                const notification = new Notification(`${userData.name} Online`, {
                    body: `${userData.name} is now online!`,
                    icon: '/favicon.ico'
                });
            }

            // Discord notification
            sendOnlineNotification(userData);
        }

        // Update state
        onlineStates.set(userData.userId, isOnlineNow);
        saveOnlineStates();
    }

    // Initialize all states
    hospitalStates = loadHospitalStates();
    hospitalTimes = loadHospitalTimes();
    onlineStates = loadOnlineStates();

    // Update API call counter
    function updateApiCounter() {
        const trackedUsers = TRACKED_USERS.length;
        const updateInterval = 2; // seconds
        const projectedCallsPerMin = Math.round((60 / updateInterval) * trackedUsers);
        
        const counter = document.getElementById('api-counter');
        if (counter) {
            counter.textContent = `~${projectedCallsPerMin} API calls/min`;
        }
    }

    // Load tracked users from localStorage
    function loadTrackedUsers() {
        try {
            const stored = localStorage.getItem('trackedUsers');
            return stored ? JSON.parse(stored) : [2054];
        } catch (error) {
            console.error('Error loading tracked users:', error);
            return [2054];
        }
    }

    // Save tracked users to localStorage
    function saveTrackedUsers(users) {
        try {
            localStorage.setItem('trackedUsers', JSON.stringify(users));
        } catch (error) {
            console.error('Error saving tracked users:', error);
        }
    }

    // Create tracker panel
    function createTrackerPanel() {
        const mainCashDisplay = document.querySelector('.cashDisplay');
        const initialCash = mainCashDisplay ? parseInt(mainCashDisplay.textContent.replace(/[£,]/g, '')) : 0;

        const panel = document.createElement('div');
        panel.id = 'online-tracker';
        panel.innerHTML = `
            <div id="cash-display">£${initialCash.toLocaleString()}</div>
            <div id="deposit-form">
                <form class="input-group mt-auto" action="/Property/Deposit" method="POST" autocomplete="off">
                    <div class="input-group">
                        <span class="input-group-text autoMax clickable" id="maxPropertyDepositBtn" data-max="1" targetelement="#depositInput" enablebtn="#depositBtn">£</span>
                        <input class="form-control allowAbbreviation" name="Cash" type="text" placeholder="0" aria-label="0" max="1000000000" min="0" value="${initialCash}" aria-describedby="cashHelper" id="depositInput">
                        <input class="d-none" name="propertyId" type="text" value="${PROPERTY_ID}">
                        <div class="input-group-append">
                            <input class="btn btn-success h-100" type="submit" value="Deposit" style="min-width:100px" id="depositBtn">
                        </div>
                    </div>
                </form>
            </div>
            <div id="tracker-toolbar">
                <button class="toolbar-btn" id="use-bandage">S Med Kit</button>
                <button class="toolbar-btn" id="use-cocaine">Coke</button>
                <button class="toolbar-btn" id="use-tainted">Tainted</button>                
                <button class="toolbar-btn" id="use-anejo">Añejo</button>
                <button class="toolbar-btn" id="use-raicilla">Raicilla</button>
            </div>
            <div id="users-list"></div>
            <div id="timestamp">Current Time: --:--:--</div>
            <div id="api-counter">0 API calls/min</div>
            <div id="user-management">
                <input type="number" id="add-user-input" placeholder="ID">
                <button class="management-btn" id="add-user-btn">+</button>
                <button id="war-toggle">Attack Mode</button>
            </div>
            <div id="resize-handle"></div>
        `;
        document.body.appendChild(panel);
        makeResizable(panel);
        setupUserManagement(panel);
        setupToolbar(panel);
        updateTimestamp(); // Initial update
        setInterval(updateTimestamp, 1000); // Update every second
        updateCashDisplay(); // Initial update
        setInterval(updateCashDisplay, 1000); // Poll every second
        return panel;
    }

    // Setup user management handlers
    function setupUserManagement(panel) {
        const input = panel.querySelector('#add-user-input');
        const addBtn = panel.querySelector('#add-user-btn');
        const warToggle = panel.querySelector('#war-toggle');

        // Load war mode state
        const warMode = localStorage.getItem('warMode') === 'true';
        if (warMode) {
            warToggle.classList.add('active');
            panel.classList.add('show-war-actions');
        }

        warToggle.addEventListener('click', () => {
            warToggle.classList.toggle('active');
            panel.classList.toggle('show-war-actions');
            localStorage.setItem('warMode', warToggle.classList.contains('active'));
        });

        addBtn.addEventListener('click', () => {
            const userId = parseInt(input.value);
            if (userId && !TRACKED_USERS.includes(userId)) {
                TRACKED_USERS.push(userId);
                saveTrackedUsers(TRACKED_USERS);
                input.value = '';
                trackUser(userId);
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addBtn.click();
            }
        });
    }

    // Setup toolbar handlers
    function setupToolbar(panel) {
        const bandageBtn = panel.querySelector('#use-bandage');
        const anejoBtn = panel.querySelector('#use-anejo');
        const cocaineBtn = panel.querySelector('#use-cocaine');
        const raicillaBtn = panel.querySelector('#use-raicilla');
        const taintedBtn = panel.querySelector('#use-tainted');
        
        bandageBtn.addEventListener('click', () => {
            $.post(`/Inventory/Use?id=${ITEM_IDS.BANDAGE}`)
                .done(() => {
                    bandageBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        bandageBtn.style.backgroundColor = '';
                    }, 500);
                })
                .fail(() => {
                    bandageBtn.style.backgroundColor = '#f44336';
                    setTimeout(() => {
                        bandageBtn.style.backgroundColor = '';
                    }, 500);
                });
        });

        anejoBtn.addEventListener('click', () => {
            $.post(`/Inventory/Use?id=${ITEM_IDS.ANEJO}`)
                .done(() => {
                    anejoBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                })
                .fail(() => {
                    anejoBtn.style.backgroundColor = '#f44336';
                    setTimeout(() => {
                        anejoBtn.style.backgroundColor = '';
                    }, 500);
                });
        });

        cocaineBtn.addEventListener('click', () => {
            $.post(`/Inventory/Use?id=${ITEM_IDS.COCAINE}`)
                .done(() => {
                    cocaineBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                })
                .fail(() => {
                    cocaineBtn.style.backgroundColor = '#f44336';
                    setTimeout(() => {
                        cocaineBtn.style.backgroundColor = '';
                    }, 500);
                });
        });

        raicillaBtn.addEventListener('click', () => {
            $.post(`/Inventory/Use?id=${ITEM_IDS.RAICILLA}`)
                .done(() => {
                    raicillaBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        location.reload();
                    }, 500);
                })
                .fail(() => {
                    raicillaBtn.style.backgroundColor = '#f44336';
                    setTimeout(() => {
                        raicillaBtn.style.backgroundColor = '';
                    }, 500);
                });
        });

        taintedBtn.addEventListener('click', () => {
            $.post(`/Inventory/Use?id=${ITEM_IDS.TAINTED}`)
                .done(() => {
                    taintedBtn.style.backgroundColor = '#4CAF50';
                    setTimeout(() => {
                        taintedBtn.style.backgroundColor = '';
                    }, 500);
                })
                .fail(() => {
                    taintedBtn.style.backgroundColor = '#f44336';
                    setTimeout(() => {
                        taintedBtn.style.backgroundColor = '';
                    }, 500);
                });
        });
    }

    // Format time ago
    function formatTimeAgo(timestamp) {
        const seconds = Math.floor(Date.now() / 1000) - timestamp;
        if (seconds < 60) return `${seconds}s ago`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    // Format time remaining
    function formatTimeRemaining(timestamp) {
        const now = Math.floor(Date.now() / 1000);
        const seconds = timestamp - now;
        
        if (seconds <= 0) return 'Released';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        let timeString = '';
        if (hours > 0) timeString += `${hours}h `;
        if (minutes > 0 || hours > 0) timeString += `${minutes}m `;
        timeString += `${remainingSeconds}s`;
        
        return timeString;
    }

    // Check if user is online
    function isOnline(lastActive) {
        const now = Math.floor(Date.now() / 1000);
        return (now - lastActive) < ONLINE_THRESHOLD;
    }

    // Convert cartel name to initials
    function getCartelInitials(cartelName) {
        if (!cartelName) return '';
        return cartelName
            .split(' ')
            .map(word => word[0])
            .join('');
    }

    // Check user status (online/away/offline)
    function getUserStatus(lastActive) {
        const now = Math.floor(Date.now() / 1000);
        const inactiveTime = now - lastActive;
        
        if (inactiveTime < 120) return 'online';      // Less than 2 minutes
        if (inactiveTime < 300) return 'away';        // Between 2-5 minutes
        return 'offline';                             // More than 5 minutes
    }

    // Update user display with full information
    function updateUserDisplay(userData) {
        const usersList = document.getElementById('users-list');
        let userElement = document.getElementById(`user-${userData.userId}`);
        
        if (!userElement) {
            userElement = document.createElement('div');
            userElement.id = `user-${userData.userId}`;
            usersList.appendChild(userElement);
        }
        
        const userStatus = getUserStatus(userData.lastActive);
        const inHospital = userData.hospitalRelease > Math.floor(Date.now() / 1000);
        const inJail = userData.jailRelease > Math.floor(Date.now() / 1000);
        
        userElement.className = `user-entry ${userStatus}`;
        
        userElement.innerHTML = `
            <div class="user-header">
                <div class="user-info">
                    <span class="status-indicator status-${userStatus}"></span>
                    <a href="https://cartelempire.online/user/${userData.userId}" 
                       class="user-name" 
                       style="color: inherit; text-decoration: none; cursor: pointer;"
                       onmouseover="this.style.textDecoration='underline'"
                       onmouseout="this.style.textDecoration='none'"
                    >${userData.name}</a>
                    <span class="user-level">${userData.level}</span>
                    ${userData.cartelName ? `<span class="user-cartel" title="${userData.cartelName}">[${getCartelInitials(userData.cartelName)}]</span>` : ''}
                    <span class="remove-user">×</span>
                </div>
                <div class="last-seen">${formatTimeAgo(userData.lastActive)}</div>
            </div>
            <div class="user-stats">
                <div>Life: ${userData.currentLife}/${userData.maxLife}</div>
                ${inHospital ? `<div class="in-hospital">Hospital: ${formatTimeRemaining(userData.hospitalRelease)}</div>` : ''}
                ${inJail ? `<div class="in-jail">Jail: ${formatTimeRemaining(userData.jailRelease)}</div>` : ''}
                ${userData.currentBountyReward ? `<div>Bounty: $${userData.currentBountyReward.toLocaleString()}</div>` : ''}
            </div>
            <div class="user-actions">
                <form action="/User/AttackPlayer/${userData.userId}" method="post" style="display: inline;">
                    <button type="submit" class="attack-btn" ${inHospital ? 'disabled' : ''} title="${inHospital ? 'Player is in hospital' : 'Attack player'}">⚔️</button>
                </form>
                <form action="/User/Hospitalise/${userData.userId}" method="post" style="display: inline;">
                    <button type="submit" class="hospital-btn" ${inHospital ? 'disabled' : ''} title="${inHospital ? 'Player is already in hospital' : 'Hospitalize player'}">🏥</button>
                </form>
                <form action="/User/MugPlayer/${userData.userId}" method="post" style="display: inline;">
                    <button type="submit" class="mug-btn" ${inHospital ? 'disabled' : ''} title="${inHospital ? 'Player is in hospital' : 'Mug player'}">💰</button>
                </form>
            </div>
        `;

        // Add remove button click handler
        const removeBtn = userElement.querySelector('.remove-user');
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const index = TRACKED_USERS.indexOf(userData.userId);
            if (index > -1) {
                TRACKED_USERS.splice(index, 1);
                saveTrackedUsers(TRACKED_USERS);
                userElement.remove();
            }
        });

        // Check all statuses
        checkHospitalStatus(userData);
        checkHospitalTimeChange(userData);
        checkOnlineStatus(userData);
    }

    // Track specific user
    async function trackUser(userId) {
        try {
            apiCalls.push(Date.now());
            updateApiCounter();
            
            const response = await fetch(`https://cartelempire.online/api/user?type=advanced&key=${API_KEY}&id=${userId}`);
            const userData = await response.json();
            updateUserDisplay(userData);
            return userData;
        } catch (error) {
            console.error(`Error tracking user ${userId}:`, error);
            return null;
        }
    }

    // Initialize tracker with saved list
    const TRACKED_USERS = loadTrackedUsers();

    // Update all tracked users
    async function updateAllUsers() {
        for (const userId of TRACKED_USERS) {
            await trackUser(userId);
        }
    }

    // Load saved position from localStorage
    function loadPanelPosition() {
        try {
            const position = JSON.parse(localStorage.getItem('onlineTrackerPosition'));
            return position || { x: 20, y: 20 }; // Default position if none saved
        } catch (error) {
            console.error('Error loading panel position:', error);
            return { x: 20, y: 20 };
        }
    }

    // Save panel position to localStorage
    function savePanelPosition(x, y) {
        try {
            localStorage.setItem('onlineTrackerPosition', JSON.stringify({ x, y }));
        } catch (error) {
            console.error('Error saving panel position:', error);
        }
    }

    // Make the panel draggable with position saving
    function makePanelDraggable(panel) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        
        // Load saved position
        const savedPosition = loadPanelPosition();
        let xOffset = savedPosition.x;
        let yOffset = savedPosition.y;
        
        // Set initial position
        setTranslate(xOffset, yOffset, panel);

        function dragStart(e) {
            // Ignore if clicking a link, text selection, or resize handle
            if (e.target.tagName === 'A' || 
                window.getSelection().toString() || 
                e.target.id === 'resize-handle') {
                return;
            }

            if (e.type === "mousedown") {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;
            } else {
                initialX = e.touches[0].clientX - xOffset;
                initialY = e.touches[0].clientY - yOffset;
            }

            isDragging = true;
            panel.style.cursor = 'grabbing';
        }

        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            panel.style.cursor = 'grab';
            
            // Save position when dragging ends
            savePanelPosition(xOffset, yOffset);
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                if (e.type === "mousemove") {
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                } else {
                    currentX = e.touches[0].clientX - initialX;
                    currentY = e.touches[0].clientY - initialY;
                }

                xOffset = currentX;
                yOffset = currentY;
                setTranslate(currentX, currentY, panel);
            }
        }

        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        }

        // Add grab cursor to panel
        panel.style.cursor = 'grab';

        panel.addEventListener("mousedown", dragStart, false);
        document.addEventListener("mousemove", drag, false);
        panel.addEventListener("mouseup", dragEnd, false);
        panel.addEventListener("touchstart", dragStart, false);
        panel.addEventListener("touchmove", drag, false);
        panel.addEventListener("touchend", dragEnd, false);
    }

    // Make panel resizable
    function makeResizable(panel) {
        const handle = panel.querySelector('#resize-handle');
        let isResizing = false;
        let originalWidth;
        let originalHeight;
        let originalX;
        let originalY;

        handle.addEventListener('mousedown', function(e) {
            isResizing = true;
            originalWidth = panel.offsetWidth;
            originalHeight = panel.offsetHeight;
            originalX = e.clientX;
            originalY = e.clientY;
            
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', stopResize);
            e.preventDefault();
        });

        function resize(e) {
            if (!isResizing) return;

            const width = originalWidth + (e.clientX - originalX);
            const height = originalHeight + (e.clientY - originalY);

            if (width > 300) { // Minimum width
                panel.style.width = width + 'px';
            }
            if (height > 100) { // Minimum height
                panel.style.height = height + 'px';
            }
        }

        function stopResize() {
            isResizing = false;
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }
    }

    // Request notification permission on start
    async function initialize() {
        if ("Notification" in window && Notification.permission === "default") {
            await Notification.requestPermission();
        }
        
        const panel = createTrackerPanel();
        makePanelDraggable(panel);
        updateAllUsers();
        setInterval(updateAllUsers, 2000);
    }

    // Start the script
    initialize();

    // Update timestamp display
    function updateTimestamp() {
        const timestamp = document.getElementById('timestamp');
        if (timestamp) {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            timestamp.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }

    // Update cash display
    function updateCashDisplay() {
        const mainCashDisplay = document.querySelector('.cashDisplay');
        const trackerCashDisplay = document.getElementById('cash-display');
        const depositInput = document.getElementById('depositInput');
        
        if (mainCashDisplay && trackerCashDisplay) {
            const newAmount = parseInt(mainCashDisplay.textContent.replace(/[£,]/g, ''));
            const oldAmount = parseInt(trackerCashDisplay.getAttribute('data-previous') || newAmount);
            
            // Only flash if the new amount is higher than the old amount
            if (newAmount > oldAmount) {
                trackerCashDisplay.classList.remove('flash');
                void trackerCashDisplay.offsetWidth;
                trackerCashDisplay.classList.add('flash');
            }
            
            trackerCashDisplay.textContent = `£${newAmount.toLocaleString()}`;
            trackerCashDisplay.setAttribute('data-previous', newAmount);

            // Update deposit input value
            if (depositInput) {
                depositInput.value = newAmount;
            }
        }
    }
})(); 