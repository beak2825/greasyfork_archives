// ==UserScript==
// @name         Yiffspot Chat Helper
// @namespace    http://tampermonkey.net/
// @version      3.1
// @license      MIT
// @description  Auto message, auto disconnect/reconnect, and blacklist for Yiffspot with enhanced UI and debugging
// @match        https://www.Yiffspot.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://www.Yiffspot.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515439/Yiffspot%20Chat%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/515439/Yiffspot%20Chat%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug mode (set to true to enable debug window)
    const DEBUG_MODE = false; // Change to true to enable debugging

    // Variables for the bot settings
    let settings = {
        autoMessage: GM_getValue('autoMessage', ''),
        disconnectTimer: GM_getValue('disconnectTimer', 0),
        autoReconnect: GM_getValue('autoReconnect', 0),
        blacklist: GM_getValue('blacklist', [])
    };

    let isChatConnected = false;   // Tracks if a chat is currently active
    let messageSent = false;       // Tracks if the bot has sent its auto-message
    let disconnectTimeout = null;  // Timer for auto-disconnect
    let reconnectTimeout = null;   // Timer for auto-reconnect
    let isPaused = false;          // Pauses all timers/actions
    let blacklistTriggered = false; // Tracks if a blacklist term was triggered
    let blacklistTerm = '';        // Stores the triggered blacklist term
    let disconnectTimeRemaining = 0;
    let reconnectTimeRemaining = 0;
    let blacklistTimeout = null;   // Timer for blacklist-triggered disconnect
    let blacklistTimeRemaining = 0;

    // Variable to track the active timer controlling the UI
    let currentActiveTimer = null;

    // Store the previous number of child elements in #messages
    let previousChildCount = 0;

    // Function to save settings using GM_setValue
    function saveSettings() {
        GM_setValue('autoMessage', settings.autoMessage);
        GM_setValue('disconnectTimer', settings.disconnectTimer);
        GM_setValue('autoReconnect', settings.autoReconnect);
        GM_setValue('blacklist', settings.blacklist);
    }

    // Function to process a node and its children
    function processNodeAndChildren(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            checkBlacklistOnElement(node);

            // Recursively process child nodes
            node.querySelectorAll('*').forEach(childNode => {
                if (childNode.nodeType === Node.ELEMENT_NODE) {
                    checkBlacklistOnElement(childNode);
                }
            });
        } else if (node.nodeType === Node.TEXT_NODE) {
            checkBlacklistOnText(node.textContent);
        }
    }

    // Function to check for blacklist terms in an element's text content
    function checkBlacklistOnElement(element) {
        const textContent = element.textContent || '';
        checkBlacklistOnText(textContent);
    }

    // Function to check for blacklist terms in text
    function checkBlacklistOnText(text) {
        if (settings.blacklist.length === 0 || blacklistTriggered) return;

        const lowerCaseText = text.toLowerCase();
        let termFound = null;
        for (let term of settings.blacklist) {
            if (lowerCaseText.includes(term.toLowerCase())) {
                // Blacklist term found
                termFound = term;
                break;
            }
        }

        if (termFound) {
            if (DEBUG_MODE) console.log(`Blacklist term "${termFound}" found in text: "${text.trim()}"`);
            // Start the blacklist disconnect timer
            blacklistTriggered = true;
            blacklistTerm = termFound;
            startBlacklistDisconnectTimer();
            if (DEBUG_MODE) updateDebugInfo();
        } else {
            if (DEBUG_MODE) console.log(`No blacklist terms found in text: "${text.trim()}"`);
        }
    }

    // Function to start the blacklist disconnect timer
    function startBlacklistDisconnectTimer() {
        clearInterval(blacklistTimeout);
        if (!isPaused) {
            blacklistTimeRemaining = 5;  // Hardcoded 5-second timer
            currentActiveTimer = 'blacklist';  // Set blacklist as the active timer
            updateCountdownDisplay(blacklistTimeRemaining, 'Disconnecting in', '#dc3545');  // Red color
            blacklistTimeout = setInterval(() => {
                if (!isPaused) {
                    blacklistTimeRemaining--;
                    if (currentActiveTimer === 'blacklist') {
                        updateCountdownDisplay(blacklistTimeRemaining, 'Disconnecting in', '#dc3545');
                    }
                    if (blacklistTimeRemaining <= 0) {
                        clearInterval(blacklistTimeout);
                        handleDisconnect();
                    }
                }
            }, 1000);
        }
    }

    // Function to cancel the blacklist disconnect
    function cancelBlacklistDisconnect() {
        if (blacklistTriggered) {
            clearInterval(blacklistTimeout);
            blacklistTriggered = false;
            blacklistTerm = '';
            blacklistTimeRemaining = 0;
            hideCountdownDisplay();
            currentActiveTimer = null;  // Clear active timer
            if (isChatConnected) {
                startDisconnectTimer();  // Resume normal disconnect timer
            }
            if (DEBUG_MODE) updateDebugInfo();
        }
    }

    // Function to manually monitor changes in the #messages element
    function monitorMessagesManually() {
        const messagesElement = document.querySelector('#messages');  // Assuming the chat messages container ID is '#messages'
        if (!messagesElement) {
            // Retry after a short delay if the element is not found
            setTimeout(monitorMessagesManually, 1000);
            return;
        }

        // Check if the child count has changed
        const currentChildCount = messagesElement.childElementCount;

        // Subtract 1 for the "partner is typing..." element if it's present
        const adjustedChildCount = currentChildCount > 0 ? currentChildCount - 1 : 0;

        if (adjustedChildCount > previousChildCount) {
            // Process only the new elements (up to the second to last element, excluding the "partner is typing...")
            for (let i = previousChildCount; i < adjustedChildCount; i++) {
                const newChild = messagesElement.children[i];
                processNodeAndChildren(newChild);
            }

            // Reset the disconnect timer on new message
            if (isChatConnected) {
                startDisconnectTimer();  // Reset the disconnect timer
            }
        }

        // Update the previous child count
        previousChildCount = adjustedChildCount;

        // Re-check periodically (you can adjust the interval as needed)
        setTimeout(monitorMessagesManually, 1000);  // Check every second
    }

    // Function to handle disconnect
    function handleDisconnect() {
        clearInterval(disconnectTimeout);
        clearInterval(blacklistTimeout);
        hideCountdownDisplay();

        const disconnectButton = document.querySelector('#disconnect');
        if (disconnectButton) {
            disconnectButton.click();
            isChatConnected = false;
            messageSent = false;
            currentActiveTimer = null;  // Clear active timer
            if (DEBUG_MODE) console.log('Disconnected from chat');
            startAutoReconnectTimer();
        }
    }

    // Function to start the disconnect timer
    function startDisconnectTimer() {
        clearInterval(disconnectTimeout);
        if (currentActiveTimer !== 'blacklist') {  // Only start if blacklist is not active
            clearInterval(reconnectTimeout); // Pause reconnect timer
            clearInterval(blacklistTimeout);  // Pause blacklist timer
            if (settings.disconnectTimer > 0 && !isPaused && isChatConnected && !blacklistTriggered) {
                disconnectTimeRemaining = settings.disconnectTimer;
                currentActiveTimer = 'disconnect';  // Set disconnect as the active timer
                updateCountdownDisplay(disconnectTimeRemaining, 'Disconnect in', '#28a745');
                disconnectTimeout = setInterval(() => {
                    if (!isPaused && currentActiveTimer === 'disconnect') {
                        disconnectTimeRemaining--;
                        updateCountdownDisplay(disconnectTimeRemaining, 'Disconnect in', '#28a745');
                        if (disconnectTimeRemaining <= 0) {
                            clearInterval(disconnectTimeout);
                            handleDisconnect();
                        }
                    }
                }, 1000);
            }
        }
    }

    // Function to start auto reconnect timer
    function startAutoReconnectTimer() {
        clearInterval(reconnectTimeout);
        if (currentActiveTimer !== 'blacklist') {  // Only start if blacklist is not active
            if (settings.autoReconnect > 0 && !isPaused) {
                reconnectTimeRemaining = settings.autoReconnect;
                currentActiveTimer = 'reconnect';  // Set reconnect as the active timer
                updateCountdownDisplay(reconnectTimeRemaining, 'Reconnecting in', '#28a745');
                reconnectTimeout = setInterval(() => {
                    if (!isPaused && currentActiveTimer === 'reconnect') {
                        reconnectTimeRemaining--;
                        updateCountdownDisplay(reconnectTimeRemaining, 'Reconnecting in', '#28a745');
                        if (reconnectTimeRemaining <= 0) {
                            clearInterval(reconnectTimeout);
                            attemptReconnect();
                        }
                    }
                }, 1000);
            }
        }
    }

    // Function to attempt reconnect
    function attemptReconnect() {
        clearInterval(reconnectTimeout);
        hideCountdownDisplay();
        currentActiveTimer = null;  // Clear active timer

        const findPartnerButton = document.querySelector('#find-partner');
        if (findPartnerButton) {
            findPartnerButton.click();
            if (DEBUG_MODE) console.log('Attempting to reconnect...');
        }
    }

    // Function to observe chat status
    function observeChatStatus() {
        function setupObserver() {
            const disconnectRow = document.querySelector('#disconnect-row');
            if (disconnectRow) {
                // Set up a MutationObserver on the 'class' attribute
                const observer = new MutationObserver((mutationsList) => {
                    mutationsList.forEach((mutation) => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const isHidden = disconnectRow.classList.contains('hide-ele');

                            if (!isHidden && !isChatConnected) {
                                // Chat connected
                                isChatConnected = true;
                                messageSent = false;
                                blacklistTriggered = false;
                                blacklistTerm = '';
                                if (DEBUG_MODE) console.log('Chat connected');
                                sendAutoMessage();
                                startDisconnectTimer();
                                if (DEBUG_MODE) updateDebugInfo();
                            } else if (isHidden && isChatConnected) {
                                // Chat disconnected
                                isChatConnected = false;
                                messageSent = false;
                                clearInterval(disconnectTimeout);
                                clearInterval(reconnectTimeout);
                                hideCountdownDisplay();
                                if (DEBUG_MODE) console.log('Chat disconnected');
                                startAutoReconnectTimer();
                                if (DEBUG_MODE) updateDebugInfo();
                            }
                        }
                    });
                });

                // Start observing 'disconnectRow'
                observer.observe(disconnectRow, { attributes: true, attributeFilter: ['class'] });

                // Check the initial state
                const isHidden = disconnectRow.classList.contains('hide-ele');
                if (!isHidden && !isChatConnected) {
                    isChatConnected = true;
                    messageSent = false;
                    blacklistTriggered = false;
                    blacklistTerm = '';
                    if (DEBUG_MODE) console.log('Chat connected (initial)');
                    sendAutoMessage();
                    startDisconnectTimer();
                    if (DEBUG_MODE) updateDebugInfo();
                }
            } else {
                // Wait until 'disconnectRow' becomes available
                setTimeout(setupObserver, 1000);
            }
        }

        setupObserver();
    }

    // Function to send the auto message
    function sendAutoMessage() {
        if (settings.autoMessage.trim() === '' || messageSent || !isChatConnected) return;

        const messageBox = document.querySelector('#message');
        if (messageBox) {
            messageBox.value = settings.autoMessage;
            messageSent = true;

            simulateEnterKey(messageBox);
            if (DEBUG_MODE) console.log('Auto message sent:', settings.autoMessage);
        }
    }

    // Helper function to fully simulate the Enter keypress
    function simulateEnterKey(inputElement) {
        const keydownEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13
        });

        const keypressEvent = new KeyboardEvent('keypress', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13
        });

        const keyupEvent = new KeyboardEvent('keyup', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13
        });

        inputElement.dispatchEvent(keydownEvent);
        inputElement.dispatchEvent(keypressEvent);
        inputElement.dispatchEvent(keyupEvent);
    }

    // Function to create the control menu, countdown display, and debug window
    function createUI() {
        // Add custom styles
        GM_addStyle(`
            #chatHelperMenu {
                position: fixed;
                top: 60px;
                left: 10px;
                z-index: 10000;
                background-color: rgba(30, 30, 30, 0.95);
                border: 1px solid #555;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.5);
                display: none;
                max-width: 300px;
                font-family: Arial, sans-serif;
                font-size: 14px;
                color: #ddd;
            }
            #chatHelperMenu h2 {
                margin-top: 0;
                font-size: 18px;
                color: #fff;
            }
            #chatHelperMenu label {
                display: block;
                margin-top: 10px;
                color: #ccc;
            }
            #chatHelperMenu input, #chatHelperMenu textarea {
                width: 100%;
                margin-top: 5px;
                padding: 5px;
                box-sizing: border-box;
                font-size: 14px;
                background-color: #444;
                color: #eee;
                border: 1px solid #666;
            }
            #chatHelperMenu button {
                padding: 8px 12px;
                margin-top: 15px;
                font-size: 14px;
                cursor: pointer;
                background-color: #007BFF;
                color: white;
                border: none;
                border-radius: 5px;
            }
            #chatHelperMenuClose {
                position: absolute;
                top: 5px;
                right: 5px;
                cursor: pointer;
                font-size: 16px;
                color: #fff;
            }
            #chatHelperButton {
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 10000;
                padding: 10px;
                font-size: 20px;
                background-color: #007BFF;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            #chatHelperCountdown {
                position: fixed;
                top: 15px;
                left: 70px;
                z-index: 10000;
                padding: 8px 12px;
                font-size: 14px;
                background-color: #28a745;
                color: white;
                border-radius: 5px;
                cursor: pointer;
                display: none;
            }
            #chatHelperDebug {
                position: fixed;
                bottom: 10px;
                left: 10px;
                z-index: 10000;
                background-color: rgba(0, 0, 0, 0.8);
                color: #fff;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                display: none;
                max-width: 300px;
                word-wrap: break-word;
                white-space: pre-line;
            }
        `);

        // Create menu container
        const menuContainer = document.createElement('div');
        menuContainer.id = 'chatHelperMenu';

        // Create menu content
        menuContainer.innerHTML = `
            <span id="chatHelperMenuClose">&times;</span>
            <h2>Chat Helper Settings</h2>
            <label for="autoMessage">Auto Message:</label>
            <textarea id="autoMessage" rows="3"></textarea>
            <label for="disconnectTimer">Disconnect Timer (sec):</label>
            <input type="number" id="disconnectTimer" min="0">
            <label for="autoReconnect">Auto Reconnect Timer (sec):</label>
            <input type="number" id="autoReconnect" min="0">
            <label for="blacklist">Blacklist (comma-separated, quote-wrapped):</label>
            <textarea id="blacklist" rows="3" placeholder='"term1", "term2", "term3"'></textarea>
            <button id="saveSettings">Save</button>
        `;

        document.body.appendChild(menuContainer);

        // Create menu toggle button
        const menuButton = document.createElement('button');
        menuButton.id = 'chatHelperButton';
        menuButton.textContent = '⚙️';
        document.body.appendChild(menuButton);

        // Create countdown display
        const countdownDisplay = document.createElement('div');
        countdownDisplay.id = 'chatHelperCountdown';
        countdownDisplay.textContent = '';
        document.body.appendChild(countdownDisplay);

        // Create debug window if DEBUG_MODE is true
        if (DEBUG_MODE) {
            const debugWindow = document.createElement('div');
            debugWindow.id = 'chatHelperDebug';
            document.body.appendChild(debugWindow);
        }

        // Load settings into UI
        document.getElementById('autoMessage').value = settings.autoMessage;
        document.getElementById('disconnectTimer').value = settings.disconnectTimer;
        document.getElementById('autoReconnect').value = settings.autoReconnect;
        document.getElementById('blacklist').value = settings.blacklist.map(term => `"${term}"`).join(', ');

        // Menu button click event (toggle)
        menuButton.addEventListener('click', () => {
            if (menuContainer.style.display === 'none' || menuContainer.style.display === '') {
                menuContainer.style.display = 'block';
            } else {
                menuContainer.style.display = 'none';
            }
        });

        // Close menu button click event
        document.getElementById('chatHelperMenuClose').addEventListener('click', () => {
            menuContainer.style.display = 'none';
        });

        // Save settings button click event
        document.getElementById('saveSettings').addEventListener('click', () => {
            settings.autoMessage = document.getElementById('autoMessage').value.trim();
            settings.disconnectTimer = parseInt(document.getElementById('disconnectTimer').value, 10) || 0;
            settings.autoReconnect = parseInt(document.getElementById('autoReconnect').value, 10) || 0;

            const blacklistInput = document.getElementById('blacklist').value.trim();
            settings.blacklist = parseBlacklistInput(blacklistInput);

            saveSettings();
            menuContainer.style.display = 'none';

            // Apply settings immediately
            if (isChatConnected) {
                startDisconnectTimer();
                // Other settings will naturally take effect
            }
            if (DEBUG_MODE) updateDebugInfo();
        });

        // Countdown display click event (toggle pause or cancel blacklist disconnect)
        countdownDisplay.addEventListener('click', () => {
            if (currentActiveTimer === 'blacklist') {
                cancelBlacklistDisconnect();
            } else {
                // Toggle pause
                isPaused = !isPaused;
                if (isPaused) {
                    clearInterval(disconnectTimeout);
                    clearInterval(reconnectTimeout);
                    clearInterval(blacklistTimeout);
                    countdownDisplay.style.backgroundColor = '#ffc107'; // Yellow for paused
                    countdownDisplay.textContent = 'Paused';  // Show "Paused" text
                } else {
                    countdownDisplay.style.backgroundColor = '#28a745'; // Green for active
                    if (blacklistTriggered) {
                        startBlacklistDisconnectTimer();
                    } else if (isChatConnected) {
                        startDisconnectTimer();
                    } else {
                        startAutoReconnectTimer();
                    }
                }
                if (DEBUG_MODE) updateDebugInfo();
            }
        });

        // Store references for later use
        uiElements = {
            menuContainer,
            menuButton,
            countdownDisplay,
            debugWindow: DEBUG_MODE ? document.getElementById('chatHelperDebug') : null
        };
    }

    // Function to parse the blacklist input
    function parseBlacklistInput(input) {
        const regex = /"([^"]+)"/g;
        let terms = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            terms.push(match[1]);
        }
        return terms;
    }

    // UI elements reference
    let uiElements = {};

    // Function to update countdown display
    function updateCountdownDisplay(timeRemaining, text, color) {
        const display = uiElements.countdownDisplay;
        if (display) {
            display.textContent = `${text} ${timeRemaining}s`;
            display.style.display = 'block';
            display.style.backgroundColor = color;
        }
        if (DEBUG_MODE) updateDebugInfo();
    }

    // Function to hide countdown display
    function hideCountdownDisplay() {
        const display = uiElements.countdownDisplay;
        if (display) {
            display.style.display = 'none';
        }
    }

    // Function to update debug information
    function updateDebugInfo() {
        if (DEBUG_MODE && uiElements.debugWindow) {
            let debugText = `Chat Helper Debug Info:\n`;
            debugText += `Chat Connected: ${isChatConnected}\n`;
            debugText += `Paused: ${isPaused}\n`;
            debugText += `Blacklist Triggered: ${blacklistTriggered}\n`;
            if (blacklistTriggered) {
                debugText += `Blacklist Term: "${blacklistTerm}"\n`;
                debugText += `Blacklist Timer: ${blacklistTimeRemaining}s\n`;
            }
            if (!blacklistTriggered && isChatConnected) {
                debugText += `Disconnect Timer: ${disconnectTimeRemaining}s\n`;
            }
            if (!isChatConnected) {
                debugText += `Reconnect Timer: ${reconnectTimeRemaining}s\n`;
            }
            uiElements.debugWindow.textContent = debugText;
            uiElements.debugWindow.style.display = 'block';
        }
    }

    // Initialize the script
    function init() {
        createUI();

        // Start manually monitoring messages
        monitorMessagesManually();

        // Start observing chat status
        observeChatStatus();
    }

    // Run the initialization function
    init();
})();