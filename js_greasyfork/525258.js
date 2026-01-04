// ==UserScript==
// @name         CheatGuessr | WorldGuessr Cheat
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Extremely customizable WorldGuessr cheating client. Click 3 to open the settings menu.
// @author       CheatGuessr
// @match        https://www.worldguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldguessr.com
// @grant        none
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/525258/CheatGuessr%20%7C%20WorldGuessr%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/525258/CheatGuessr%20%7C%20WorldGuessr%20Cheat.meta.js
// ==/UserScript==
     
    (function() {
        'use strict';

        if (window.location.pathname === '/banned') {
            const handleBannedPage = () => {
                const backdrop = document.createElement('div');
                backdrop.style.position = 'fixed';
                backdrop.style.top = '0';
                backdrop.style.left = '0';
                backdrop.style.right = '0';
                backdrop.style.bottom = '0';
                backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)';
                backdrop.style.zIndex = '10000';
    
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '50%';
                modal.style.left = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
                modal.style.backgroundColor = '#1f2937';
                modal.style.padding = '20px';
                modal.style.borderRadius = '8px';
                modal.style.color = 'white';
                modal.style.zIndex = '10001';
    
                const message = document.createElement('p');
                message.textContent = 'The Cheat has been detected!\nPlease Enter 10-20 random characters to bypass the anti-cheat.\n\nExample (do not use the example):\ndf89aj3n4r98nd9';
                message.style.margin = '0 0 15px 0';
    
                const input = document.createElement('input');
                input.type = 'text';
                input.style.width = '100%';
                input.style.marginBottom = '15px';
                input.style.padding = '8px';
                input.style.borderRadius = '4px';
                input.style.border = '1px solid #4b5563';
                input.style.backgroundColor = '#374151';
                input.style.color = 'white';
    
                const submitButton = document.createElement('button');
                submitButton.textContent = 'Submit';
                submitButton.style.padding = '8px 16px';
                submitButton.style.backgroundColor = '#3b82f6';
                submitButton.style.color = 'white';
                submitButton.style.border = 'none';
                submitButton.style.borderRadius = '4px';
                submitButton.style.cursor = 'pointer';
                submitButton.onmouseenter = () => submitButton.style.backgroundColor = '#2563eb';
                submitButton.onmouseleave = () => submitButton.style.backgroundColor = '#3b82f6';
    
                submitButton.onclick = () => {
                    const chars = input.value.trim();
                    if (chars) {
                        if (chars === 'df89aj3n4r98nd9') {
                            alert('You cannot use the example!');
                            return;
                        }
    
                        const history = JSON.parse(localStorage.getItem('mapDivClassHistory') || []);
                        if (history.includes(chars)) {
                            alert('You cannot reuse a previous map div name!');
                            return;
                        }
    
                        localStorage.removeItem('banned');
                        localStorage.setItem('mapDivClass', chars);
                        history.push(chars);
                        localStorage.setItem('mapDivClassHistory', JSON.stringify(history));
                        window.location.href = 'https://www.worldguessr.com/';
                    }
                };
    
                modal.appendChild(message);
                modal.appendChild(input);
                modal.appendChild(submitButton);
                document.body.appendChild(backdrop);
                document.body.appendChild(modal);
            };
    
            handleBannedPage();
            return;
        }
     
        let googleMapsIframe = null;
        let lastLocation = null;
        let loadingIndicator = null;
        let dotInterval = null;
        let settings = null;
        let settingsModal = null;
        let mapDivClass = localStorage.getItem('mapDivClass') || 'map-div';
     
        const DEFAULT_SETTINGS = {
            keybinds: {
                toggleMap: '1',
                newTab: '2',
                settings: '3',
                detailedLocation: '4'
            },
            mapPosition: 'top-left',
            mapSize: {
                width: 400,
                height: 300
            },
            loadingPosition: 'bottom',
            refreshInterval: 1000,
            blockAds: true
        };
     
        const style = document.createElement('style');
        style.textContent = `
            .${mapDivClass} {
                position: fixed;
                z-index: 9999;
                border: 2px solid #333;
                border-radius: 4px;
            }
            .close-button {
                position: absolute;
                top: -15px;
                right: -15px;
                width: 30px;
                height: 30px;
                background: red;
                border: 2px solid white;
                border-radius: 50%;
                color: white;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .loading-indicator {
                position: fixed;
                left: 10px;
                padding: 5px 10px;
                background: rgba(0,0,0,0.7);
                color: white;
                border-radius: 4px;
                z-index: 9999;
            }
            .settings-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1f2937;
                padding: 20px;
                border-radius: 8px;
                z-index: 10001;
                width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                color: white;
            }
            .settings-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
            }
            .settings-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .settings-section {
                background: #374151;
                padding: 15px;
                border-radius: 6px;
            }
            .settings-row {
                margin: 10px 0;
            }
            .settings-row label {
                display: block;
                margin-bottom: 5px;
                color: #e5e7eb;
            }
            .settings-input {
                width: 100%;
                padding: 8px;
                border: 1px solid #4b5563;
                border-radius: 4px;
                background: #1f2937;
                color: white;
            }
            .settings-button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin: 5px;
                background: #3b82f6;
                color: white;
            }
            .settings-button:hover {
                background: #2563eb;
            }
        `;
        document.head.appendChild(style);
     
        function loadSettings() {
            try {
                const saved = localStorage.getItem('worldGuessrHelper');
                settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
            } catch (e) {
                settings = DEFAULT_SETTINGS;
            }
        }
     
        function saveSettings() {
            localStorage.setItem('worldGuessrHelper', JSON.stringify(settings));
        }
     
        function blockAds() {
            if (!settings.blockAds) return;
     
            const adSelectors = [
                '[id^="google_ads_iframe"]',
                '[id^="worldguessr-com_"]',
                '.video-ad'
            ];
     
            const removeAds = () => {
                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(ad => {
                        ad.remove();
                    });
                });
            };
     
            removeAds();
     
            const observer = new MutationObserver(removeAds);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
     
        function createLoadingIndicator() {
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.style.display = 'none';
            document.body.appendChild(loadingIndicator);
     
            let dots = 0;
            if (dotInterval) clearInterval(dotInterval);
     
            dotInterval = setInterval(() => {
                dots = (dots + 1) % 4;
                if (loadingIndicator) {
                    loadingIndicator.textContent = 'Loading location' + '.'.repeat(dots);
                }
            }, 500);
        }
     
        function toggleSettingsModal() {
            if (settingsModal) {
                settingsModal.backdrop.remove();
                settingsModal.modal.remove();
                settingsModal = null;
                return;
            }
     
            const backdrop = document.createElement('div');
            backdrop.className = 'settings-backdrop';
     
            const modal = document.createElement('div');
            modal.className = 'settings-modal';
            modal.innerHTML = `
                <h2 style="margin-bottom: 20px">WorldGuessr Helper Settings</h2>
                <div class="settings-grid">
                    <div class="settings-section">
                        <h3>Keybinds</h3>
                        <div class="settings-row">
                            <label>Toggle Map Key</label>
                            <input type="text" class="settings-input" id="toggleMapKey" value="${settings.keybinds.toggleMap}">
                        </div>
                        <div class="settings-row">
                            <label>New Tab Key</label>
                            <input type="text" class="settings-input" id="newTabKey" value="${settings.keybinds.newTab}">
                        </div>
                        <div class="settings-row">
                            <label>Settings Key</label>
                            <input type="text" class="settings-input" id="settingsKey" value="${settings.keybinds.settings}">
                        </div>
                        <div class="settings-row">
                            <label>Detailed Location Alert</label>
                            <input type="text" class="settings-input" id="detailedLocation" value="${settings.keybinds.detailedLocation}">
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Map Settings</h3>
                        <div class="settings-row">
                            <label>Map Position</label>
                            <select class="settings-input" id="mapPosition">
                                <option value="top-left" ${settings.mapPosition === 'top-left' ? 'selected' : ''}>Top Left</option>
                                <option value="top-right" ${settings.mapPosition === 'top-right' ? 'selected' : ''}>Top Right</option>
                                <option value="bottom-left" ${settings.mapPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                                <option value="bottom-right" ${settings.mapPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                            </select>
                        </div>
                        <div class="settings-row">
                            <label>Map Width (px)</label>
                            <input type="number" class="settings-input" id="mapWidth" value="${settings.mapSize.width}">
                        </div>
                        <div class="settings-row">
                            <label>Map Height (px)</label>
                            <input type="number" class="settings-input" id="mapHeight" value="${settings.mapSize.height}">
                        </div>
                    </div>
                </div>
                <div class="settings-section" style="margin-top: 20px">
                    <h3>Additional Settings</h3>
                    <div class="settings-row">
                        <label>
                            <input type="checkbox" id="blockAds" ${settings.blockAds ? 'checked' : ''}>
                            Block Advertisements
                        </label>
                    </div>
                </div>
                <div style="text-align: right; margin-top: 20px">
                    <button class="settings-button" id="closeSettings">Cancel</button>
                    <button class="settings-button" id="saveSettings">Save</button>
                </div>
            `;
     
            document.body.appendChild(backdrop);
            document.body.appendChild(modal);
     
            settingsModal = { backdrop, modal };
     
            document.getElementById('saveSettings').onclick = () => {
                settings.keybinds.toggleMap = document.getElementById('toggleMapKey').value;
                settings.keybinds.newTab = document.getElementById('newTabKey').value;
                settings.keybinds.settings = document.getElementById('settingsKey').value;
                settings.keybinds.detailedLocation = document.getElementById('detailedLocation').value;
                settings.mapPosition = document.getElementById('mapPosition').value;
                settings.mapSize.width = parseInt(document.getElementById('mapWidth').value);
                settings.mapSize.height = parseInt(document.getElementById('mapHeight').value);
                settings.blockAds = document.getElementById('blockAds').checked;
     
                saveSettings();
                blockAds();
                toggleSettingsModal();
            };
     
            document.getElementById('closeSettings').onclick = toggleSettingsModal;
        }
     
        function showLoadingIndicator() {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
                loadingIndicator.style.bottom = settings.loadingPosition === 'bottom' ? '10px' : 'auto';
                loadingIndicator.style.top = settings.loadingPosition === 'top' ? '10px' : 'auto';
            }
        }
     
        function hideLoadingIndicator() {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
     
        function extractLocationFromIframe() {
            showLoadingIndicator();
            const iframe = document.querySelector('iframe[src^="/svEmbed"]');
            if (!iframe) {
                hideLoadingIndicator();
                return null;
            }
     
            const urlParams = new URLSearchParams(iframe.src.split('?')[1]);
            const lat = parseFloat(urlParams.get('lat'));
            const long = parseFloat(urlParams.get('long'));
     
            if (!isNaN(lat) && !isNaN(long)) {
                hideLoadingIndicator();
                return { lat, long, timestamp: new Date() };
            }
            hideLoadingIndicator();
            return null;
        }
     
        function updateMapPosition() {
            if (!googleMapsIframe) return;
     
            const pos = settings.mapPosition.split('-');
            googleMapsIframe.style.top = pos[0] === 'top' ? '10px' : 'auto';
            googleMapsIframe.style.bottom = pos[0] === 'bottom' ? '10px' : 'auto';
            googleMapsIframe.style.left = pos[1] === 'left' ? '10px' : 'auto';
            googleMapsIframe.style.right = pos[1] === 'right' ? '10px' : 'auto';
            googleMapsIframe.style.width = settings.mapSize.width + 'px';
            googleMapsIframe.style.height = settings.mapSize.height + 'px';
        }
     
        function toggleGoogleMapsIframe(location) {
            if (!location) return;
    
            if (googleMapsIframe) {
                googleMapsIframe.remove();
                googleMapsIframe = null;
                return;
            }
    
            try {
                const container = document.createElement('div');
                container.className = mapDivClass;
    
                const closeBtn = document.createElement('button');
                closeBtn.className = 'close-button';
                closeBtn.textContent = '×';// ==UserScript==
// @name         CheatGuessr | WorldGuessr Cheat
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Extremely customizable WorldGuessr cheating client. Click 3 to open the settings menu.
// @author       CheatGuessr
// @match        https://www.worldguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=worldguessr.com
// @grant        none
// @license      GNU AGPLv3
// ==/UserScript==
     
    (function() {
        'use strict';

        if (window.location.pathname === '/banned') {
            const handleBannedPage = () => {
                const backdrop = document.createElement('div');
                backdrop.style.position = 'fixed';
                backdrop.style.top = '0';
                backdrop.style.left = '0';
                backdrop.style.right = '0';
                backdrop.style.bottom = '0';
                backdrop.style.backgroundColor = 'rgba(0,0,0,0.5)';
                backdrop.style.zIndex = '10000';
    
                const modal = document.createElement('div');
                modal.style.position = 'fixed';
                modal.style.top = '50%';
                modal.style.left = '50%';
                modal.style.transform = 'translate(-50%, -50%)';
                modal.style.backgroundColor = '#1f2937';
                modal.style.padding = '20px';
                modal.style.borderRadius = '8px';
                modal.style.color = 'white';
                modal.style.zIndex = '10001';
    
                const message = document.createElement('p');
                message.textContent = 'The Cheat has been detected!\nPlease Enter 10-20 random characters to bypass the anti-cheat.\n\nExample (do not use the example):\ndf89aj3n4r98nd9';
                message.style.margin = '0 0 15px 0';
    
                const input = document.createElement('input');
                input.type = 'text';
                input.style.width = '100%';
                input.style.marginBottom = '15px';
                input.style.padding = '8px';
                input.style.borderRadius = '4px';
                input.style.border = '1px solid #4b5563';
                input.style.backgroundColor = '#374151';
                input.style.color = 'white';
    
                const submitButton = document.createElement('button');
                submitButton.textContent = 'Submit';
                submitButton.style.padding = '8px 16px';
                submitButton.style.backgroundColor = '#3b82f6';
                submitButton.style.color = 'white';
                submitButton.style.border = 'none';
                submitButton.style.borderRadius = '4px';
                submitButton.style.cursor = 'pointer';
                submitButton.onmouseenter = () => submitButton.style.backgroundColor = '#2563eb';
                submitButton.onmouseleave = () => submitButton.style.backgroundColor = '#3b82f6';
    
                submitButton.onclick = () => {
                    const chars = input.value.trim();
                    if (chars) {
                        if (chars === 'df89aj3n4r98nd9') {
                            alert('You cannot use the example!');
                            return;
                        }

                        localStorage.setItem('mapDivClass', chars);
                        const history = JSON.parse(localStorage.getItem('mapDivClassHistory') || '[]');
                        history.push(chars);
                        localStorage.setItem('mapDivClassHistory', JSON.stringify(history));
                        window.location.href = 'https://www.worldguessr.com/';
                    }
                };
    
                modal.appendChild(message);
                modal.appendChild(input);
                modal.appendChild(submitButton);
                document.body.appendChild(backdrop);
                document.body.appendChild(modal);
            };
    
            handleBannedPage();
            return;
        }
     
        let googleMapsIframe = null;
        let lastLocation = null;
        let loadingIndicator = null;
        let dotInterval = null;
        let settings = null;
        let settingsModal = null;
        let mapDivClass = localStorage.getItem('mapDivClass') || 'map-div';
     
        const DEFAULT_SETTINGS = {
            keybinds: {
                toggleMap: '1',
                newTab: '2',
                settings: '3',
                detailedLocation: '4'
            },
            mapPosition: 'top-left',
            mapSize: {
                width: 400,
                height: 300
            },
            loadingPosition: 'bottom',
            refreshInterval: 1000,
            blockAds: true
        };
     
        const style = document.createElement('style');
        style.textContent = `
            .${mapDivClass} {
                position: fixed;
                z-index: 9999;
                border: 2px solid #333;
                border-radius: 4px;
            }
            .close-button {
                position: absolute;
                top: -15px;
                right: -15px;
                width: 30px;
                height: 30px;
                background: red;
                border: 2px solid white;
                border-radius: 50%;
                color: white;
                font-weight: bold;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .loading-indicator {
                position: fixed;
                left: 10px;
                padding: 5px 10px;
                background: rgba(0,0,0,0.7);
                color: white;
                border-radius: 4px;
                z-index: 9999;
            }
            .settings-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1f2937;
                padding: 20px;
                border-radius: 8px;
                z-index: 10001;
                width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                color: white;
            }
            .settings-backdrop {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 10000;
            }
            .settings-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .settings-section {
                background: #374151;
                padding: 15px;
                border-radius: 6px;
            }
            .settings-row {
                margin: 10px 0;
            }
            .settings-row label {
                display: block;
                margin-bottom: 5px;
                color: #e5e7eb;
            }
            .settings-input {
                width: 100%;
                padding: 8px;
                border: 1px solid #4b5563;
                border-radius: 4px;
                background: #1f2937;
                color: white;
            }
            .settings-button {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin: 5px;
                background: #3b82f6;
                color: white;
            }
            .settings-button:hover {
                background: #2563eb;
            }
        `;
        document.head.appendChild(style);
     
        function loadSettings() {
            try {
                const saved = localStorage.getItem('worldGuessrHelper');
                settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
            } catch (e) {
                settings = DEFAULT_SETTINGS;
            }
        }
     
        function saveSettings() {
            localStorage.setItem('worldGuessrHelper', JSON.stringify(settings));
        }
     
        function blockAds() {
            if (!settings.blockAds) return;
     
            const adSelectors = [
                '[id^="google_ads_iframe"]',
                '[id^="worldguessr-com_"]',
                '.video-ad'
            ];
     
            const removeAds = () => {
                adSelectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(ad => {
                        ad.remove();
                    });
                });
            };
     
            removeAds();
     
            const observer = new MutationObserver(removeAds);
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
     
        function createLoadingIndicator() {
            loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            loadingIndicator.style.display = 'none';
            document.body.appendChild(loadingIndicator);
     
            let dots = 0;
            if (dotInterval) clearInterval(dotInterval);
     
            dotInterval = setInterval(() => {
                dots = (dots + 1) % 4;
                if (loadingIndicator) {
                    loadingIndicator.textContent = 'Loading location' + '.'.repeat(dots);
                }
            }, 500);
        }
     
        function toggleSettingsModal() {
            if (settingsModal) {
                settingsModal.backdrop.remove();
                settingsModal.modal.remove();
                settingsModal = null;
                return;
            }
     
            const backdrop = document.createElement('div');
            backdrop.className = 'settings-backdrop';
     
            const modal = document.createElement('div');
            modal.className = 'settings-modal';
            modal.innerHTML = `
                <h2 style="margin-bottom: 20px">WorldGuessr Helper Settings</h2>
                <div class="settings-grid">
                    <div class="settings-section">
                        <h3>Keybinds</h3>
                        <div class="settings-row">
                            <label>Toggle Map Key</label>
                            <input type="text" class="settings-input" id="toggleMapKey" value="${settings.keybinds.toggleMap}">
                        </div>
                        <div class="settings-row">
                            <label>New Tab Key</label>
                            <input type="text" class="settings-input" id="newTabKey" value="${settings.keybinds.newTab}">
                        </div>
                        <div class="settings-row">
                            <label>Settings Key</label>
                            <input type="text" class="settings-input" id="settingsKey" value="${settings.keybinds.settings}">
                        </div>
                        <div class="settings-row">
                            <label>Detailed Location Alert</label>
                            <input type="text" class="settings-input" id="detailedLocation" value="${settings.keybinds.detailedLocation}">
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Map Settings</h3>
                        <div class="settings-row">
                            <label>Map Position</label>
                            <select class="settings-input" id="mapPosition">
                                <option value="top-left" ${settings.mapPosition === 'top-left' ? 'selected' : ''}>Top Left</option>
                                <option value="top-right" ${settings.mapPosition === 'top-right' ? 'selected' : ''}>Top Right</option>
                                <option value="bottom-left" ${settings.mapPosition === 'bottom-left' ? 'selected' : ''}>Bottom Left</option>
                                <option value="bottom-right" ${settings.mapPosition === 'bottom-right' ? 'selected' : ''}>Bottom Right</option>
                            </select>
                        </div>
                        <div class="settings-row">
                            <label>Map Width (px)</label>
                            <input type="number" class="settings-input" id="mapWidth" value="${settings.mapSize.width}">
                        </div>
                        <div class="settings-row">
                            <label>Map Height (px)</label>
                            <input type="number" class="settings-input" id="mapHeight" value="${settings.mapSize.height}">
                        </div>
                    </div>
                </div>
                <div class="settings-section" style="margin-top: 20px">
                    <h3>Additional Settings</h3>
                    <div class="settings-row">
                        <label>
                            <input type="checkbox" id="blockAds" ${settings.blockAds ? 'checked' : ''}>
                            Block Advertisements
                        </label>
                    </div>
                </div>
                <div style="text-align: right; margin-top: 20px">
                    <button class="settings-button" id="closeSettings">Cancel</button>
                    <button class="settings-button" id="saveSettings">Save</button>
                </div>
            `;
     
            document.body.appendChild(backdrop);
            document.body.appendChild(modal);
     
            settingsModal = { backdrop, modal };
     
            document.getElementById('saveSettings').onclick = () => {
                settings.keybinds.toggleMap = document.getElementById('toggleMapKey').value;
                settings.keybinds.newTab = document.getElementById('newTabKey').value;
                settings.keybinds.settings = document.getElementById('settingsKey').value;
                settings.keybinds.detailedLocation = document.getElementById('detailedLocation').value;
                settings.mapPosition = document.getElementById('mapPosition').value;
                settings.mapSize.width = parseInt(document.getElementById('mapWidth').value);
                settings.mapSize.height = parseInt(document.getElementById('mapHeight').value);
                settings.blockAds = document.getElementById('blockAds').checked;
     
                saveSettings();
                blockAds();
                toggleSettingsModal();
            };
     
            document.getElementById('closeSettings').onclick = toggleSettingsModal;
        }
     
        function showLoadingIndicator() {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
                loadingIndicator.style.bottom = settings.loadingPosition === 'bottom' ? '10px' : 'auto';
                loadingIndicator.style.top = settings.loadingPosition === 'top' ? '10px' : 'auto';
            }
        }
     
        function hideLoadingIndicator() {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
     
        function extractLocationFromIframe() {
            showLoadingIndicator();
            const iframe = document.querySelector('iframe[src^="/svEmbed"]');
            if (!iframe) {
                hideLoadingIndicator();
                return null;
            }
     
            const urlParams = new URLSearchParams(iframe.src.split('?')[1]);
            const lat = parseFloat(urlParams.get('lat'));
            const long = parseFloat(urlParams.get('long'));
     
            if (!isNaN(lat) && !isNaN(long)) {
                hideLoadingIndicator();
                return { lat, long, timestamp: new Date() };
            }
            hideLoadingIndicator();
            return null;
        }
     
        function updateMapPosition() {
            if (!googleMapsIframe) return;
     
            const pos = settings.mapPosition.split('-');
            googleMapsIframe.style.top = pos[0] === 'top' ? '10px' : 'auto';
            googleMapsIframe.style.bottom = pos[0] === 'bottom' ? '10px' : 'auto';
            googleMapsIframe.style.left = pos[1] === 'left' ? '10px' : 'auto';
            googleMapsIframe.style.right = pos[1] === 'right' ? '10px' : 'auto';
            googleMapsIframe.style.width = settings.mapSize.width + 'px';
            googleMapsIframe.style.height = settings.mapSize.height + 'px';
        }
     
        function toggleGoogleMapsIframe(location) {
            if (!location) return;
    
            if (googleMapsIframe) {
                googleMapsIframe.remove();
                googleMapsIframe = null;
                return;
            }
    
            try {
                const container = document.createElement('div');
                container.className = mapDivClass;
    
                const closeBtn = document.createElement('button');
                closeBtn.className = 'close-button';
                closeBtn.textContent = '×';
                closeBtn.onclick = () => {
                    container.remove();
                    googleMapsIframe = null;
                };
    
                const iframe = document.createElement('iframe');
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.style.border = 'none';
                iframe.src = "https://www.google.com/maps?q=" + location.lat + "," + location.long + "&z=18&output=embed";
    
                container.appendChild(closeBtn);
                container.appendChild(iframe);
                document.body.appendChild(container);
                googleMapsIframe = container;
                updateMapPosition();
            } catch (error) {
                console.error('Error creating iframe:', error);
            }
        }
     
        async function fetchLocationDetails(lat, long) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch location details');
                }
                const data = await response.json();
                const { address } = data;
                const locationDetails = `
                    Area: ${address.neighbourhood || address.suburb || address.hamlet || 'N/A'}
                    City: ${address.city || address.town || address.village || 'N/A'}
                    State: ${address.state || 'N/A'}
                    Country: ${address.country || 'N/A'}
                `;
                alert(locationDetails);
            } catch (error) {
                alert('Could not fetch location details: ' + error.message);
            }
        }
     
        window.addEventListener('keydown', function(event) {
            event.stopPropagation();
     
            const location = extractLocationFromIframe();
            if (!location) return;
     
            if (lastLocation && (lastLocation.lat !== location.lat || lastLocation.long !== location.long)) {
                if (googleMapsIframe) {
                    toggleGoogleMapsIframe(location);
                    toggleGoogleMapsIframe(location);
                }
            }
            lastLocation = location;
     
            if (event.key === settings.keybinds.toggleMap) {
                toggleGoogleMapsIframe(location);
            } else if (event.key === settings.keybinds.newTab) {
                window.open("https://www.google.com/maps?q=" + location.lat + "," + location.long, "_blank");
            } else if (event.key === settings.keybinds.settings) {
                if (googleMapsIframe) {
                    toggleGoogleMapsIframe(location);
                }
                toggleSettingsModal();
            } else if (event.key === settings.keybinds.detailedLocation) {
                const { lat, long } = location;
                if (!lat || !long) {
                    alert('Coordinates not yet available!');
                } else {
                    fetchLocationDetails(lat, long);
                }
            }
        }, true);
     
        loadSettings();
        createLoadingIndicator();
        blockAds();
     
        setInterval(() => {
            const location = extractLocationFromIframe();
            if (!location || !lastLocation) return;
     
            if (lastLocation.lat !== location.lat || lastLocation.long !== location.long) {
                if (googleMapsIframe) {
                    toggleGoogleMapsIframe(location);
                    toggleGoogleMapsIframe(location);
                }
                lastLocation = location;
            }
        }, settings.refreshInterval);
     
        const observer = new MutationObserver(() => {
            if (!document.querySelector('iframe[src^="/svEmbed"]') && googleMapsIframe) {
                googleMapsIframe.remove();
                googleMapsIframe = null;
            }
        });
     
        observer.observe(document.body, { childList: true, subtree: true });
    })();
                closeBtn.onclick = () => {
                    container.remove();
                    googleMapsIframe = null;
                };
    
                const iframe = document.createElement('iframe');
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.style.border = 'none';
                iframe.src = "https://www.google.com/maps?q=" + location.lat + "," + location.long + "&z=18&output=embed";
    
                container.appendChild(closeBtn);
                container.appendChild(iframe);
                document.body.appendChild(container);
                googleMapsIframe = container;
                updateMapPosition();
            } catch (error) {
                console.error('Error creating iframe:', error);
            }
        }
     
        async function fetchLocationDetails(lat, long) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${long}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch location details');
                }
                const data = await response.json();
                const { address } = data;
                const locationDetails = `
                    Area: ${address.neighbourhood || address.suburb || address.hamlet || 'N/A'}
                    City: ${address.city || address.town || address.village || 'N/A'}
                    State: ${address.state || 'N/A'}
                    Country: ${address.country || 'N/A'}
                `;
                alert(locationDetails);
            } catch (error) {
                alert('Could not fetch location details: ' + error.message);
            }
        }
     
        window.addEventListener('keydown', function(event) {
            event.stopPropagation();
     
            const location = extractLocationFromIframe();
            if (!location) return;
     
            if (lastLocation && (lastLocation.lat !== location.lat || lastLocation.long !== location.long)) {
                if (googleMapsIframe) {
                    toggleGoogleMapsIframe(location);
                    toggleGoogleMapsIframe(location);
                }
            }
            lastLocation = location;
     
            if (event.key === settings.keybinds.toggleMap) {
                toggleGoogleMapsIframe(location);
                return;
            } else if (event.key === settings.keybinds.newTab) {
                window.open("https://www.google.com/maps?q=" + location.lat + "," + location.long, "_blank");
                return;
            } else if (event.key === settings.keybinds.settings) {
                if (googleMapsIframe) {
                    toggleGoogleMapsIframe(location);
                }
                toggleSettingsModal();
                return;
            } else if (event.key === settings.keybinds.detailedLocation) {
                const { lat, long } = location;
                if (!lat || !long) {
                    alert('Coordinates not yet available!');
                } else {
                    fetchLocationDetails(lat, long);
                }
                return;
            }
        }, true);
     
        loadSettings();
        createLoadingIndicator();
        blockAds();
     
        setInterval(() => {
            const location = extractLocationFromIframe();
            if (!location || !lastLocation) return;
     
            if (lastLocation.lat !== location.lat || lastLocation.long !== location.long) {
                if (googleMapsIframe) {
                    toggleGoogleMapsIframe(location);
                    toggleGoogleMapsIframe(location);
                }
                lastLocation = location;
            }
        }, settings.refreshInterval);
     
        const observer = new MutationObserver(() => {
            if (!document.querySelector('iframe[src^="/svEmbed"]') && googleMapsIframe) {
                googleMapsIframe.remove();
                googleMapsIframe = null;
            }
        });
     
        observer.observe(document.body, { childList: true, subtree: true });
    })();
