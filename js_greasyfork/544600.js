// ==UserScript==
// @name         Torn Travel Widget
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Travel status widget with integrated API settings for Torn.com header, with robust API key management for desktop and Torn PDA.
// @author       TheProgrammer [2782979] - https://www.torn.com/profiles.php?XID=2782979
// @match        *://*.torn.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      api.torn.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544600/Torn%20Travel%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/544600/Torn%20Travel%20Widget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- PROMISE-BASED GM STORAGE & HELPERS ---
    const GM_get = (key, def) => new Promise(resolve => resolve(GM_getValue(key, def)));
    const GM_set = (key, val) => new Promise(resolve => resolve(GM_setValue(key, val)));
    const GM_del = (key) => new Promise(resolve => resolve(GM_deleteValue(key)));
    const API_KEY_STORAGE_KEY = 'torn_travel_widget_api_key';
    const PDA_API_KEY_PLACEHOLDER = '###PDA-APIKEY###';

    // --- PDA DETECTION ---
    const isPDA = typeof window.flutter_inappwebview !== 'undefined' &&
                  typeof window.flutter_inappwebview.callHandler === 'function';

    // --- STYLES ---
    GM_addStyle(`
        .ttw-header-button-li { position: relative; }
        .ttw-popup {
            position: fixed; top: 60px; right: 10px;
            width: 350px; background-color: #333; border: 1px solid #555;
            border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            z-index: 10000; color: #ccc; font-family: 'Signika', 'Verdana', sans-serif;
            padding: 10px; display: block;
        }
        .ttw-popup-hidden { display: none !important; }
        .ttw-popup-content { font-size: 12px; }
        .ttw-popup-content .error { color: #ff6347; }
        .ttw-popup-content .success { color: #90ee90; }

        .ttw-tab-container { margin-bottom: 10px; }
        .ttw-tab-buttons { display: flex; border-bottom: 1px solid #444; margin-bottom: 10px; }
        .ttw-tab-button {
            flex: 1; padding: 8px 12px; background: transparent; border: none;
            color: #ccc; cursor: pointer; font-size: 11px; border-bottom: 2px solid transparent;
        }
        .ttw-tab-button.active { color: #fff; border-bottom-color: #4CAF50; }
        .ttw-tab-button:hover { background-color: #444; }
        .ttw-tab-content { display: none; }
        .ttw-tab-content.active { display: block; }

        .ttw-settings-tab .tos-table { width: 100%; border-collapse: collapse; font-size: 10px; margin: 10px 0; }
        .ttw-settings-tab .tos-table th, .ttw-settings-tab .tos-table td { border: 1px solid #555; padding: 4px; text-align: left; }
        .ttw-settings-tab input[type="password"] {
            width: 100%; padding: 6px; border-radius: 3px; border: 1px solid #555;
            background-color: #222; color: white; margin-bottom: 10px; box-sizing: border-box;
        }
        .ttw-settings-tab .api-button-group { display: flex; gap: 8px; justify-content: flex-end; }
        .ttw-settings-tab .api-button { padding: 5px 10px; border: none; border-radius: 3px; cursor: pointer; font-size: 11px; }
        .ttw-settings-tab .save-key { background-color: #4CAF50; color: white; }
        .ttw-settings-tab .clear-key { background-color: #f44336; color: white; }
        .ttw-settings-tab .pda-note { color: #87ceeb; font-size: 11px; margin-top: -5px; margin-bottom: 10px; }
    `);

    // --- API & DATA MANAGER ---
    const ApiManager = {
        apiKey: null,
        async setup() {
            let storedKey = await GM_get(API_KEY_STORAGE_KEY, null);
            if (!storedKey && isPDA) {
                await GM_set(API_KEY_STORAGE_KEY, PDA_API_KEY_PLACEHOLDER);
                storedKey = PDA_API_KEY_PLACEHOLDER;
            }
            this.apiKey = storedKey;
        },
        fetchTornApi(selections, id = '') {
            return new Promise((resolve, reject) => {
                let keyToUse = this.apiKey;
                if (keyToUse === PDA_API_KEY_PLACEHOLDER) {
                    if (window.tornium && window.tornium.apiKey) {
                        keyToUse = window.tornium.apiKey;
                    } else { return reject(new Error("Torn PDA key not found.")); }
                }
                if (!keyToUse) { return reject(new Error("API Key not set. Use the Settings tab to add one.")); }
                const url = `https://api.torn.com/user/${id}?selections=${selections}&key=${keyToUse}`;
                GM_xmlhttpRequest({
                    method: 'GET', url: url,
                    onload: (response) => {
                        const json = JSON.parse(response.responseText);
                        if (json.error) return reject(json.error);
                        resolve(json);
                    },
                    onerror: (error) => reject(error)
                });
            });
        }
    };

    // --- HEADER BUTTON MANAGER ---
    const HeaderButtonManager = {
        buttons: [],
        activePopup: null,
        activeButton: null,
        register(buttonDef) { this.buttons.push(buttonDef); },
        async initialize() {
            const targetUl = await this.waitForElement('.header-buttons-wrapper ul.toolbar');
            if (!targetUl) return;
            const insertionPoint = targetUl.querySelector('.tc-clock');
            this.buttons.forEach(buttonDef => {
                const { li, button } = this.createButtonElements(buttonDef);
                targetUl.insertBefore(li, insertionPoint);
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.togglePopup(li.querySelector('.ttw-popup'), buttonDef, button);
                });
            });
        },
        createButtonElements(buttonDef) {
            const li = document.createElement('li');
            li.className = `ttw-header-button-li ${buttonDef.id}`;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `top_header_button button ${buttonDef.id}`;
            button.setAttribute('aria-label', `Open ${buttonDef.name}`);
            button.innerHTML = buttonDef.icon;
            const popup = document.createElement('div');
            popup.className = 'ttw-popup ttw-popup-hidden';
            popup.id = `ttw-popup-${buttonDef.id}`;
            popup.innerHTML = `<div class="ttw-popup-content">Loading...</div>`;
            popup.addEventListener('click', e => e.stopPropagation());
            li.appendChild(button);
            li.appendChild(popup);
            return { li, button };
        },
        togglePopup(popup, buttonDef, button) {
            const isOpening = popup.classList.contains('ttw-popup-hidden');

            if (isOpening) {
                // Opening popup
                this.hideAllPopups(); // Close any other popups first
                popup.classList.remove('ttw-popup-hidden');
                this.activePopup = popup;
                this.activeButton = button;
                if (typeof buttonDef.updateFunction === 'function') {
                    const contentElement = popup.querySelector('.ttw-popup-content');
                    buttonDef.updateFunction(contentElement);
                }
            } else {
                // Closing popup
                this.hideAllPopups();
            }
        },
        hideAllPopups() {
            document.querySelectorAll('.ttw-popup').forEach(p => p.classList.add('ttw-popup-hidden'));
            this.activePopup = null;
            this.activeButton = null;
        },
        waitForElement(selector) {
            return new Promise(resolve => {
                const el = document.querySelector(selector);
                if (el) return resolve(el);
                const observer = new MutationObserver(() => {
                    const el = document.querySelector(selector);
                    if (el) { resolve(el); observer.disconnect(); }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    };

    // --- BUTTON DEFINITIONS ---

    /**
     * Travel Widget with integrated API Settings
     * Uses the "airplane" icon and contains both travel info and settings tabs.
     */
    const travelWidget = {
        id: "ttw-travel-widget",
        name: "Travel Widget",
        countdown: null,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt" width="28" height="28" viewBox="0 0 30 30" fill="#fff"><path d="M22 2L15 22L11 13L2 9L22 2Z"></path></svg>`,
        async updateFunction(contentElement) {
            // Create tabbed interface without title
            contentElement.innerHTML = `
                <div class="ttw-tab-container">
                    <div class="ttw-tab-buttons">
                        <button class="ttw-tab-button active" data-tab="travel">Travel</button>
                        <button class="ttw-tab-button" data-tab="settings">Settings</button>
                    </div>
                    <div class="ttw-tab-content active" id="ttw-travel-tab">
                        <div id="ttw-travel-content">Loading travel status...</div>
                    </div>
                    <div class="ttw-tab-content ttw-settings-tab" id="ttw-settings-tab">
                        <div id="ttw-settings-content">Loading settings...</div>
                    </div>
                </div>
            `;

            // Set up tab switching
            const tabButtons = contentElement.querySelectorAll('.ttw-tab-button');
            const tabContents = contentElement.querySelectorAll('.ttw-tab-content');

            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tabName = button.dataset.tab;

                    // Update button states
                    tabButtons.forEach(b => b.classList.remove('active'));
                    button.classList.add('active');

                    // Update content visibility
                    tabContents.forEach(content => content.classList.remove('active'));
                    contentElement.querySelector(`#ttw-${tabName}-tab`).classList.add('active');

                    // Load content for the active tab
                    if (tabName === 'travel') {
                        this.loadTravelContent();
                    } else if (tabName === 'settings') {
                        this.loadSettingsContent();
                    }
                });
            });

            // Load initial travel content
            this.loadTravelContent();
        },

        async loadTravelContent() {
            const travelContent = document.querySelector('#ttw-travel-content');
            if (!travelContent) return;

            try {
                const data = await ApiManager.fetchTornApi('travel');

                // Check if user is in Torn City or already arrived
                if (data.travel.destination === "Torn" || data.travel.time_left === 0) {
                    travelContent.innerHTML = `<span class="success">Currently in Torn City.</span>`;
                    // Clear any existing countdown
                    if (this.countdown) {
                        clearInterval(this.countdown);
                        this.countdown = null;
                    }
                } else {
                    // Start live countdown using the timestamp (arrival time)
                    this.startLiveCountdown(travelContent, data.travel.timestamp, data.travel.destination);
                }
            } catch (error) {
                travelContent.innerHTML = `<span class="error">API Error: ${error.error || error.message}</span>`;
                // Clear any existing countdown on error
                if (this.countdown) {
                    clearInterval(this.countdown);
                    this.countdown = null;
                }
            }
        },

        startLiveCountdown(el, arrivalTimestamp, destination) {
            // Clear any existing countdown
            if (this.countdown) {
                clearInterval(this.countdown);
            }

            const updateCountdown = () => {
                // Get current time in seconds (Unix timestamp)
                const currentTime = Math.floor(Date.now() / 1000);

                // Calculate seconds remaining until arrival
                const secondsLeft = arrivalTimestamp - currentTime;

                if (secondsLeft <= 0) {
                    el.innerHTML = `<span class="success">Arrived in ${destination}!</span>`;
                    clearInterval(this.countdown);
                    this.countdown = null;
                } else {
                    // Convert seconds to hours, minutes, seconds
                    const hours = Math.floor(secondsLeft / 3600);
                    const minutes = Math.floor((secondsLeft % 3600) / 60);
                    const seconds = secondsLeft % 60;

                    // Format with leading zeros
                    const hoursStr = String(hours).padStart(2, '0');
                    const minutesStr = String(minutes).padStart(2, '0');
                    const secondsStr = String(seconds).padStart(2, '0');

                    el.innerHTML = `Flying to <b>${destination}</b>.<br>Arrives in: ${hoursStr}:${minutesStr}:${secondsStr}`;
                }
            };

            // Update immediately, then every second
            updateCountdown();
            this.countdown = setInterval(updateCountdown, 1000);
        },

        async loadSettingsContent() {
            const settingsContent = document.querySelector('#ttw-settings-content');
            if (!settingsContent) return;

            const currentKey = await GM_get(API_KEY_STORAGE_KEY, '');

            let contentHTML = `
                <p style="font-size: 11px;">Manage your API key. The key is stored locally in your browser and is never shared.</p>
                <table class="tos-table">
                    <thead><tr><th>Key Access Level</th><th>Purpose of Use</th></tr></thead>
                    <tbody><tr><td>Limited Access</td><td>Non-malicious statistical analysis for widgets</td></tr></tbody>
                </table>
                <input type="password" id="ttw-api-key-input" placeholder="Enter your Limited Access API Key" value="${currentKey === PDA_API_KEY_PLACEHOLDER ? '' : currentKey}">
            `;

            if (currentKey === PDA_API_KEY_PLACEHOLDER) {
                contentHTML += `<p class="pda-note">Using Torn PDA managed API key. No entry needed.</p>`;
            }

            contentHTML += `
                <div class="api-button-group">
                    <button class="api-button clear-key">Clear Key</button>
                    <button class="api-button save-key">Save Key</button>
                </div>
                <div id="ttw-api-status" style="font-size: 11px; margin-top: 8px;"></div>
            `;
            settingsContent.innerHTML = contentHTML;

            const input = settingsContent.querySelector('#ttw-api-key-input');
            const saveBtn = settingsContent.querySelector('.save-key');
            const clearBtn = settingsContent.querySelector('.clear-key');
            const statusDiv = settingsContent.querySelector('#ttw-api-status');

            if (currentKey === PDA_API_KEY_PLACEHOLDER) {
                input.disabled = true;
                saveBtn.disabled = true;
            }

            saveBtn.onclick = async () => {
                const newKey = input.value.trim();
                if (newKey) {
                    await GM_set(API_KEY_STORAGE_KEY, newKey);
                    ApiManager.apiKey = newKey;
                    statusDiv.innerHTML = `<span class="success">API Key saved successfully!</span>`;
                    // Refresh travel tab if it was showing an error
                    const activeTab = document.querySelector('.ttw-tab-button.active');
                    if (activeTab && activeTab.dataset.tab === 'travel') {
                        this.loadTravelContent();
                    }
                } else {
                    statusDiv.innerHTML = `<span class="error">API Key cannot be empty.</span>`;
                }
                setTimeout(() => statusDiv.innerHTML = '', 3000);
            };

            clearBtn.onclick = async () => {
                if (confirm('Are you sure you want to clear your stored API key?')) {
                    await GM_del(API_KEY_STORAGE_KEY);
                    ApiManager.apiKey = null;
                    input.value = '';
                    input.disabled = false;
                    saveBtn.disabled = false;
                    settingsContent.querySelector('.pda-note')?.remove();
                    statusDiv.innerHTML = `<span class="success">API Key cleared.</span>`;
                    setTimeout(() => statusDiv.innerHTML = '', 3000);
                }
            };
        }
    };

    // --- SCRIPT INITIALIZATION ---
    async function main() {
        await ApiManager.setup();
        HeaderButtonManager.register(travelWidget);
        HeaderButtonManager.initialize();
    }

    main();

})();