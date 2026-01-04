// ==UserScript==
// @name         Teen-Chat Auto Message
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Auto message script with customizable sentence bank for teen-chat.org
// @author       rexeditz88
// @match        https://www.teen-chat.org/chat/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/529965/Teen-Chat%20Auto%20Message.user.js
// @updateURL https://update.greasyfork.org/scripts/529965/Teen-Chat%20Auto%20Message.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== STYLES =====
    GM_addStyle(`
        #auto-message-panel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background-color: #2c3e50;
            color: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
            font-family: Arial, sans-serif;
            transition: height 0.3s ease;
            overflow: hidden;
        }

        #auto-message-header {
            padding: 10px;
            background-color: #1abc9c;
            cursor: move;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 8px 8px 0 0;
        }

        #auto-message-title {
            font-weight: bold;
            margin: 0;
        }

        #auto-message-toggle {
            cursor: pointer;
            font-size: 18px;
        }

        #auto-message-content {
            padding: 15px;
            max-height: 400px;
            overflow-y: auto;
        }

        .auto-message-section {
            margin-bottom: 15px;
        }

        .auto-message-section-title {
            font-weight: bold;
            margin-bottom: 8px;
            color: #1abc9c;
        }

        .auto-message-input {
            width: 100%;
            padding: 8px;
            margin-bottom: 8px;
            border-radius: 4px;
            border: 1px solid #34495e;
            background-color: #34495e;
            color: white;
            box-sizing: border-box;
        }

        .auto-message-button {
            background-color: #1abc9c;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        .auto-message-button:hover {
            background-color: #16a085;
        }

        .auto-message-list {
            max-height: 150px;
            overflow-y: auto;
            margin-top: 10px;
            border: 1px solid #34495e;
            border-radius: 4px;
            padding: 5px;
            background-color: #34495e;
        }

        .auto-message-item {
            padding: 8px;
            margin-bottom: 5px;
            background-color: #2c3e50;
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .auto-message-item-text {
            flex-grow: 1;
            word-break: break-word;
        }

        .auto-message-item-delete {
            color: #e74c3c;
            cursor: pointer;
            margin-left: 8px;
        }

        .auto-message-status {
            margin-top: 10px;
            padding: 8px;
            border-radius: 4px;
            background-color: #34495e;
            text-align: center;
        }

        .auto-message-slider-container {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
        }

        .auto-message-slider {
            flex-grow: 1;
            margin-right: 10px;
        }

        .auto-message-slider-value {
            min-width: 40px;
        }

        .auto-message-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
        }

        .auto-message-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .auto-message-slider-toggle {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #34495e;
            transition: .4s;
            border-radius: 24px;
        }

        .auto-message-slider-toggle:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .auto-message-slider-toggle {
            background-color: #1abc9c;
        }

        input:checked + .auto-message-slider-toggle:before {
            transform: translateX(26px);
        }

        .auto-message-switch-label {
            margin-left: 10px;
        }

        .auto-message-collapsed {
            height: 40px !important;
        }
    `);

    // ===== VARIABLES =====
    let messages = GM_getValue('autoMessages', []);
    let settings = GM_getValue('autoMessageSettings', {
        interval: 30,
        enabled: false,
        randomize: true
    });
    let messageTimer = null;
    let currentMessageIndex = 0;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let panelCollapsed = false;

    // ===== FUNCTIONS =====
    function createPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-message-panel';

        panel.innerHTML = `
            <div id="auto-message-header">
                <h3 id="auto-message-title">Auto Message</h3>
                <span id="auto-message-toggle">-</span>
            </div>
            <div id="auto-message-content">
                <div class="auto-message-section">
                    <div class="auto-message-section-title">Message Bank</div>
                    <input type="text" class="auto-message-input" id="new-message-input" placeholder="Enter a new message...">
                    <button class="auto-message-button" id="add-message-button">Add Message</button>
                    <div class="auto-message-list" id="message-list"></div>
                </div>

                <div class="auto-message-section">
                    <div class="auto-message-section-title">Settings</div>

                    <div class="auto-message-slider-container">
                        <span>Interval:</span>
                        <input type="range" min="5" max="300" step="5" value="${settings.interval}" class="auto-message-slider" id="interval-slider">
                        <span class="auto-message-slider-value" id="interval-value">${settings.interval}s</span>
                    </div>

                    <div class="auto-message-slider-container">
                        <span>Randomize:</span>
                        <label class="auto-message-switch">
                            <input type="checkbox" id="randomize-toggle" ${settings.randomize ? 'checked' : ''}>
                            <span class="auto-message-slider-toggle"></span>
                        </label>
                    </div>

                    <div class="auto-message-slider-container">
                        <span>Auto Message:</span>
                        <label class="auto-message-switch">
                            <input type="checkbox" id="enabled-toggle" ${settings.enabled ? 'checked' : ''}>
                            <span class="auto-message-slider-toggle"></span>
                        </label>
                    </div>
                </div>

                <div class="auto-message-status" id="status-display">
                    Status: ${settings.enabled ? 'Running' : 'Stopped'}
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Make panel draggable
        const header = document.getElementById('auto-message-header');
        header.addEventListener('mousedown', startDrag);

        // Toggle panel collapse
        const toggle = document.getElementById('auto-message-toggle');
        toggle.addEventListener('click', togglePanel);

        // Add message button
        const addButton = document.getElementById('add-message-button');
        addButton.addEventListener('click', addMessage);

        // Enter key to add message
        const input = document.getElementById('new-message-input');
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addMessage();
            }
        });

        // Interval slider
        const slider = document.getElementById('interval-slider');
        const sliderValue = document.getElementById('interval-value');
        slider.addEventListener('input', function() {
            sliderValue.textContent = this.value + 's';
            settings.interval = parseInt(this.value);
            saveSettings();
            restartTimer();
        });

        // Randomize toggle
        const randomizeToggle = document.getElementById('randomize-toggle');
        randomizeToggle.addEventListener('change', function() {
            settings.randomize = this.checked;
            saveSettings();
        });

        // Enable toggle
        const enabledToggle = document.getElementById('enabled-toggle');
        enabledToggle.addEventListener('change', function() {
            settings.enabled = this.checked;
            saveSettings();
            updateStatus();
            if (settings.enabled) {
                startTimer();
            } else {
                stopTimer();
            }
        });

        // Populate message list
        updateMessageList();
    }

    function startDrag(e) {
        const panel = document.getElementById('auto-message-panel');
        isDragging = true;

        // Calculate the offset of the mouse pointer from the panel's top-left corner
        const rect = panel.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        // Add event listeners for mouse movement and release
        document.addEventListener('mousemove', dragPanel);
        document.addEventListener('mouseup', stopDrag);

        // Prevent text selection during drag
        e.preventDefault();
    }

    function dragPanel(e) {
        if (!isDragging) return;

        const panel = document.getElementById('auto-message-panel');

        // Calculate new position
        const newLeft = e.clientX - dragOffset.x;
        const newTop = e.clientY - dragOffset.y;

        // Apply new position
        panel.style.left = newLeft + 'px';
        panel.style.top = newTop + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', dragPanel);
        document.removeEventListener('mouseup', stopDrag);
    }

    function togglePanel() {
        const panel = document.getElementById('auto-message-panel');
        const toggle = document.getElementById('auto-message-toggle');

        panelCollapsed = !panelCollapsed;

        if (panelCollapsed) {
            panel.classList.add('auto-message-collapsed');
            toggle.textContent = '+';
        } else {
            panel.classList.remove('auto-message-collapsed');
            toggle.textContent = '-';
        }
    }

    function addMessage() {
        const input = document.getElementById('new-message-input');
        const message = input.value.trim();

        if (message) {
            messages.push(message);
            saveMessages();
            updateMessageList();
            input.value = '';
        }
    }

    function deleteMessage(index) {
        messages.splice(index, 1);
        saveMessages();
        updateMessageList();
    }

    function updateMessageList() {
        const list = document.getElementById('message-list');
        list.innerHTML = '';

        if (messages.length === 0) {
            const emptyItem = document.createElement('div');
            emptyItem.className = 'auto-message-item';
            emptyItem.textContent = 'No messages added yet';
            list.appendChild(emptyItem);
        } else {
            messages.forEach((message, index) => {
                const item = document.createElement('div');
                item.className = 'auto-message-item';

                const text = document.createElement('div');
                text.className = 'auto-message-item-text';
                text.textContent = message;

                const deleteBtn = document.createElement('span');
                deleteBtn.className = 'auto-message-item-delete';
                deleteBtn.textContent = '×';
                deleteBtn.addEventListener('click', () => deleteMessage(index));

                item.appendChild(text);
                item.appendChild(deleteBtn);
                list.appendChild(item);
            });
        }
    }

    function saveMessages() {
        GM_setValue('autoMessages', messages);
    }

    function saveSettings() {
        GM_setValue('autoMessageSettings', settings);
    }

    function updateStatus() {
        const status = document.getElementById('status-display');
        status.textContent = `Status: ${settings.enabled ? 'Running' : 'Stopped'}`;
    }

    function startTimer() {
        if (messageTimer) {
            clearInterval(messageTimer);
        }

        if (messages.length > 0) {
            messageTimer = setInterval(sendAutoMessage, settings.interval * 1000);
        }
    }

    function stopTimer() {
        if (messageTimer) {
            clearInterval(messageTimer);
            messageTimer = null;
        }
    }

    function restartTimer() {
        if (settings.enabled) {
            stopTimer();
            startTimer();
        }
    }

    function sendAutoMessage() {
        if (messages.length === 0) return;

        let messageToSend;

        if (settings.randomize) {
            // Select random message
            const randomIndex = Math.floor(Math.random() * messages.length);
            messageToSend = messages[randomIndex];
        } else {
            // Select next message in sequence
            messageToSend = messages[currentMessageIndex];
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        }

        // Find the input field and send button
        const inputField = document.getElementById('content');
        const sendButton = document.getElementById('submit_button');

        if (inputField && sendButton) {
            // Set the message in the input field
            inputField.value = messageToSend;

            // Trigger input event to ensure the chat recognizes the input
            const inputEvent = new Event('input', { bubbles: true });
            inputField.dispatchEvent(inputEvent);

            // Click the send button
            sendButton.click();
        }
    }

    // ===== INITIALIZATION =====
    // Wait for the page to fully load
    window.addEventListener('load', function() {
        // Create the panel after a short delay to ensure all elements are loaded
        setTimeout(function() {
            createPanel();

            // Start the timer if enabled
            if (settings.enabled) {
                startTimer();
            }
        }, 1500);
    });
})();
