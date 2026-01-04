// ==UserScript==
// @name         POE2 Seller Status Check
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Monitor seller status on POE trade site and get notifications when they come online
// @author       WSDev
// @match        https://www.pathofexile.com/trade2/search/poe2/*
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523164/POE2%20Seller%20Status%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/523164/POE2%20Seller%20Status%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default configuration
    const DEFAULT_CONFIG = {
        checkInterval: 30000,
        volume: 0.7,
        soundType: 'alert1',
        soundDuration: 200,
        soundRepeat: 3
    };

    // Get current configuration
    let config = GM_getValue('config', DEFAULT_CONFIG);

    // Sound generation functions
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const SOUND_TYPES = {
        alert1: {
            frequency: 880,
            type: 'square'
        },
        alert2: {
            frequency: [440, 880],
            type: 'sine'
        },
        alert3: {
            frequency: [587.33, 880],
            type: 'triangle'
        }
    };

    function playNotification() {
        const soundConfig = SOUND_TYPES[config.soundType];
        const frequencies = Array.isArray(soundConfig.frequency) ? soundConfig.frequency : [soundConfig.frequency];
        
        frequencies.forEach(frequency => {
            for (let i = 0; i < config.soundRepeat; i++) {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = soundConfig.type;
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + (i * config.soundDuration * 2) / 1000);
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime + (i * config.soundDuration * 2) / 1000);
                gainNode.gain.linearRampToValueAtTime(config.volume, audioContext.currentTime + (i * config.soundDuration * 2 + 10) / 1000);
                gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (i * config.soundDuration * 2 + config.soundDuration) / 1000);
                
                oscillator.start(audioContext.currentTime + (i * config.soundDuration * 2) / 1000);
                oscillator.stop(audioContext.currentTime + (i * config.soundDuration * 2 + config.soundDuration) / 1000);
            }
        });
    }

    // Styles for the UI
    GM_addStyle(`
        .alert-button {
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 2px;
            cursor: pointer;
            border-radius: 3px;
        }
        .alert-button.active {
            background-color: #f44336;
        }
        #poeStatusConfig {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #2d2d2d;
            padding: 20px;
            border-radius: 5px;
            z-index: 10000;
            color: white;
            font-family: Arial, sans-serif;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            min-width: 300px;
        }
        #poeStatusConfig h2 {
            margin-top: 0;
            color: #4CAF50;
        }
        #poeStatusConfig label {
            display: block;
            margin: 10px 0 5px;
        }
        #poeStatusConfig input, #poeStatusConfig select {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
            background: #1a1a1a;
            border: 1px solid #4CAF50;
            color: white;
            border-radius: 3px;
        }
        #poeStatusConfig button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 3px;
            cursor: pointer;
            margin-right: 10px;
        }
        #poeStatusConfig button:hover {
            background: #45a049;
        }
        .config-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 9999;
        }
    `);

    // Create configuration panel
    function createConfigPanel() {
        const configOverlay = document.createElement('div');
        configOverlay.className = 'config-overlay';

        const configPanel = document.createElement('div');
        configPanel.id = 'poeStatusConfig';

        const configHtml = `
            <h2>POE2 Seller Status Check Configuration</h2>
            <label for="checkInterval">Check Interval (ms):</label>
            <input type="number" id="checkInterval" value="${config.checkInterval}" min="5000">
            
            <label for="soundType">Alert Sound:</label>
            <select id="soundType">
                <option value="alert1" ${config.soundType === 'alert1' ? 'selected' : ''}>Alert 1 (High Beep)</option>
                <option value="alert2" ${config.soundType === 'alert2' ? 'selected' : ''}>Alert 2 (Double Tone)</option>
                <option value="alert3" ${config.soundType === 'alert3' ? 'selected' : ''}>Alert 3 (Musical)</option>
            </select>

            <label for="volume">Volume:</label>
            <input type="number" id="volume" value="${config.volume}" step="0.1" min="0">
            <p style="color: yellow; margin-top: 5px;">Warning: Values above 1 may cause audio distortion.</p>
            
            <label for="soundDuration">Sound Duration (ms):</label>
            <input type="number" id="soundDuration" value="${config.soundDuration}" min="50" max="1000">
            
            <label for="soundRepeat">Repeat Count:</label>
            <input type="number" id="soundRepeat" value="${config.soundRepeat}" min="1" max="5">
            
            <div style="margin-top: 20px;">
                <button id="testSound">Test Sound</button>
                <button id="saveConfig">Save</button>
                <button id="closeConfig">Close</button>
            </div>
        `;

        configPanel.innerHTML = configHtml;
        configOverlay.appendChild(configPanel);
        document.body.appendChild(configOverlay);

        // Event listeners
        document.getElementById('testSound').addEventListener('click', () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
            playNotification();
        });

        document.getElementById('saveConfig').addEventListener('click', () => {
            config.checkInterval = Math.max(5000, parseInt(document.getElementById('checkInterval').value));
            config.soundType = document.getElementById('soundType').value;
            config.volume = Math.max(0, parseFloat(document.getElementById('volume').value));
            config.soundDuration = Math.max(50, Math.min(1000, parseInt(document.getElementById('soundDuration').value)));
            config.soundRepeat = Math.max(1, Math.min(5, parseInt(document.getElementById('soundRepeat').value)));

            GM_setValue('config', config);
            configOverlay.remove();
        });

        document.getElementById('closeConfig').addEventListener('click', () => {
            configOverlay.remove();
        });
    }

    // Register menu command
    GM_registerMenuCommand('POE2 Seller Status Check Configuration', createConfigPanel);

    // Store monitored items and their last alert time
    const monitoredItems = new Map();

    // Function to add alert button
    function addAlertButton(row) {
        if (row.querySelector('.alert-button')) return;

        const refreshButton = row.querySelector('.refresh');
        if (!refreshButton) return;

        const alertButton = document.createElement('button');
        alertButton.className = 'alert-button';
        alertButton.textContent = 'Alert';
        alertButton.title = 'Get notified when seller comes online';

        alertButton.addEventListener('click', () => {
            const itemId = row.getAttribute('data-id');
            if (monitoredItems.has(itemId)) {
                monitoredItems.delete(itemId);
                alertButton.classList.remove('active');
            } else {
                monitoredItems.set(itemId, {
                    row,
                    lastCheck: Date.now(),
                    lastAlert: null
                });
                alertButton.classList.add('active');
            }
        });

        refreshButton.parentNode.insertBefore(alertButton, refreshButton.nextSibling);
    }

    // Function to check seller status
    function checkSellerStatus(itemId, item) {
        const statusElement = item.row.querySelector('.status');
        if (!statusElement) return;

        const wasOffline = statusElement.classList.contains('status-offline');
        const wasAFK = statusElement.classList.contains('status-away');
        item.row.querySelector('.refresh').click();

        // Wait for status update
        setTimeout(() => {
            const isNowOnline = item.row.querySelector('.status').classList.contains('status-online');
            const now = Date.now();
            if ((wasOffline || wasAFK) && isNowOnline) {
                if (!item.lastAlert || now - item.lastAlert >= 300000) { // 5 minutes
                    playNotification();
                    GM_notification({
                        title: 'POE Seller Online',
                        text: 'A monitored seller has come online!',
                        timeout: 5000
                    });
                    item.lastAlert = now;
                }
            } else if (!isNowOnline) {
                item.lastAlert = null; // Reset last alert time if seller goes offline or AFK
            }
        }, 2000);
    }

    // Monitor items periodically
    setInterval(() => {
        const now = Date.now();
        monitoredItems.forEach((item, itemId) => {
            if (now - item.lastCheck >= config.checkInterval) {
                checkSellerStatus(itemId, item);
                item.lastCheck = now;
            }
        });
    }, 1000);

    // Add alert buttons to existing items
    function addAlertButtonsToExisting() {
        document.querySelectorAll('.row[data-id]').forEach(addAlertButton);
    }

    // Watch for new items being added
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.matches('.row[data-id]')) {
                    addAlertButton(node);
                }
            });
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial setup
    addAlertButtonsToExisting();
})();
