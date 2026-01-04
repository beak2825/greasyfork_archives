// ==UserScript==
// @name         Torn Market Price Alert
// @namespace    https://www.torn.com/
// @version      1.0
// @description  Alerts when items are listed below specified price threshold
// @author       Tyche
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        GM_addStyle
// @grant        window.focus
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/531148/Torn%20Market%20Price%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/531148/Torn%20Market%20Price%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 5000;
    const STORAGE_KEY = 'tornMarketAlerts';
    const MONITORING_STATE_KEY = 'tornMarketAlertsMonitoring';
    const DEFAULT_VOLUME = 0.7;

    let checkInterval = null;
    let isMonitoring = false;
    let currentItemId = null;
    let alertSound = new Audio('https://freesound.org/data/previews/263/263133_4284968-lq.mp3');
    alertSound.volume = DEFAULT_VOLUME;

    GM_addStyle(`
        #tma-container {
            position: fixed;
            bottom: 70px;
            right: 20px;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }

        #tma-toggle-btn {
            background-color: #1c1c1c;
            color: #fff;
            border: 2px solid #3c3c3c;
            border-radius: 5px;
            padding: 8px 12px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        #tma-toggle-btn:hover {
            background-color: #2a2a2a;
        }

        #tma-toggle-btn.active {
            background-color: #4CAF50;
            border-color: #388E3C;
        }

        #tma-settings-panel {
            background-color: #1c1c1c;
            border: 2px solid #3c3c3c;
            border-radius: 5px;
            padding: 15px;
            margin-bottom: 10px;
            width: 250px;
            display: none;
            color: #fff;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        #tma-settings-panel label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }

        #tma-settings-panel input {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            background-color: #2a2a2a;
            border: 1px solid #3c3c3c;
            color: #fff;
            border-radius: 3px;
        }

        #tma-settings-panel button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 3px;
            font-weight: bold;
            margin-right: 5px;
        }

        #tma-settings-panel button:hover {
            background-color: #388E3C;
        }

        .tma-flash {
            animation: tma-flash-animation 0.5s infinite alternate;
        }

        @keyframes tma-flash-animation {
            from { background-color: #1c1c1c; }
            to { background-color: #FF5252; }
        }
    `);

    function init() {
        createUI();

        currentItemId = extractItemIdFromUrl();

        if (window.onurlchange === null) {
            window.addEventListener('urlchange', (info) => {
                currentItemId = extractItemIdFromUrl();
                updateSettingsPanel();
            });
        }

        window.addEventListener('storage', handleStorageChange);

        loadMonitoringState();

        setupPurchaseConfirmationAutoClose();
    }

    function createUI() {
        const container = document.createElement('div');
        container.id = 'tma-container';

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'tma-settings-panel';

        const thresholdLabel = document.createElement('label');
        thresholdLabel.textContent = 'Price Threshold:';
        thresholdLabel.style.color = '#E0E0E0';

        const thresholdInput = document.createElement('input');
        thresholdInput.id = 'tma-threshold';
        thresholdInput.type = 'number';
        thresholdInput.min = '0';
        thresholdInput.placeholder = 'Enter max price to alert for';

        const volumeLabel = document.createElement('label');
        volumeLabel.textContent = 'Alert Volume (0-1):';
        volumeLabel.style.color = '#E0E0E0';

        const volumeInput = document.createElement('input');
        volumeInput.id = 'tma-volume';
        volumeInput.type = 'number';
        volumeInput.min = '0';
        volumeInput.max = '1';
        volumeInput.step = '0.1';
        volumeInput.value = DEFAULT_VOLUME;
        volumeInput.placeholder = 'Enter volume (0-1)';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Settings';
        saveButton.addEventListener('click', saveSettings);

        const itemInfo = document.createElement('div');
        itemInfo.id = 'tma-item-info';
        itemInfo.style.marginBottom = '10px';
        itemInfo.style.color = '#E0E0E0'; // Lighter color for better contrast

        settingsPanel.appendChild(itemInfo);
        settingsPanel.appendChild(thresholdLabel);
        settingsPanel.appendChild(thresholdInput);
        settingsPanel.appendChild(volumeLabel);
        settingsPanel.appendChild(volumeInput);
        settingsPanel.appendChild(saveButton);

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'tma-toggle-btn';
        toggleBtn.textContent = 'Price Alert: OFF';
        toggleBtn.addEventListener('click', toggleMonitoring);

        const settingsBtn = document.createElement('button');
        settingsBtn.id = 'tma-settings-btn';
        settingsBtn.textContent = 'Settings';
        settingsBtn.style.marginRight = '10px';
        settingsBtn.style.backgroundColor = '#4CAF50';
        settingsBtn.style.color = 'white';
        settingsBtn.style.border = 'none';
        settingsBtn.style.padding = '8px 12px';
        settingsBtn.style.borderRadius = '5px';
        settingsBtn.style.fontWeight = 'bold';
        settingsBtn.addEventListener('click', () => {
            const panel = document.getElementById('tma-settings-panel');
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            updateSettingsPanel();
        });

        container.appendChild(settingsPanel);
        container.appendChild(settingsBtn);
        container.appendChild(toggleBtn);

        document.body.appendChild(container);
    }

    function extractItemIdFromUrl() {
        const url = window.location.href;
        const match = url.match(/itemID=(\d+)/);
        return match ? match[1] : null;
    }

    function updateSettingsPanel() {
        if (!currentItemId) return;

        const itemInfo = document.getElementById('tma-item-info');
        const thresholdInput = document.getElementById('tma-threshold');

        let itemName = 'Unknown Item';
        try {
            const headerElem = document.querySelector('.title-black, h4');
            if (headerElem) {
                itemName = headerElem.textContent.trim();
            }
        } catch (e) {
            console.error('Error getting item name:', e);
        }

        itemInfo.textContent = `Item: ${itemName} (ID: ${currentItemId})`;

        const settings = loadSettings();
        if (settings[currentItemId]) {
            thresholdInput.value = settings[currentItemId].threshold;
        } else {
            thresholdInput.value = '';
        }
    }

    function toggleMonitoring() {
        isMonitoring = !isMonitoring;

        localStorage.setItem(MONITORING_STATE_KEY, isMonitoring.toString());

        updateMonitoringUI();

        if (isMonitoring) {
            startMonitoring();
        } else {
            stopMonitoring();
        }
    }

    function updateMonitoringUI() {
        const toggleBtn = document.getElementById('tma-toggle-btn');
        if (!toggleBtn) return;

        if (isMonitoring) {
            toggleBtn.textContent = 'Price Alert: ON';
            toggleBtn.classList.add('active');
        } else {
            toggleBtn.textContent = 'Price Alert: OFF';
            toggleBtn.classList.remove('active');
        }
    }

    function loadMonitoringState() {
        const storedState = localStorage.getItem(MONITORING_STATE_KEY);
        isMonitoring = storedState === 'true';

        updateMonitoringUI();

        if (isMonitoring) {
            startMonitoring();
        }
    }

    function handleStorageChange(event) {
        if (event.key === MONITORING_STATE_KEY) {
            const newState = event.newValue === 'true';
            if (newState !== isMonitoring) {
                isMonitoring = newState;
                updateMonitoringUI();

                if (isMonitoring) {
                    startMonitoring();
                } else {
                    stopMonitoring();
                }
            }
        }
    }

    function startMonitoring() {
        if (checkInterval) {
            clearInterval(checkInterval);
        }

        checkListings();

        checkInterval = setInterval(checkListings, CHECK_INTERVAL);
        console.log('Torn Market Alert: Monitoring started');
    }

    function stopMonitoring() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }
        console.log('Torn Market Alert: Monitoring stopped');
    }

    function checkListings() {
        if (!currentItemId) return;

        const settings = loadSettings();
        if (!settings[currentItemId] || !settings[currentItemId].threshold) {
            console.log('No threshold set for item ID:', currentItemId);
            return;
        }

        const threshold = settings[currentItemId].threshold;
        console.log(`Checking listings against threshold: $${threshold}`);

        const listings = document.querySelectorAll('.sellerList___kgAh_ .rowWrapper___me3Ox');

        let foundDeals = false;

        listings.forEach(listing => {
            try {
                const priceElement = listing.querySelector('.price___Uwiv2');
                const availableElement = listing.querySelector('.available___xegv_');

                if (priceElement && availableElement) {
                    const priceText = priceElement.textContent;
                    const availableText = availableElement.textContent;

                    const price = parseInt(priceText.replace(/[$,]/g, ''));

                    const availableMatch = availableText.match(/(\d+)\s+available/);
                    if (availableMatch) {
                        const available = parseInt(availableMatch[1]);

                        if (!isNaN(price) && !isNaN(available) && price <= threshold && available > 0) {
                            console.log(`Found deal: ${available} items at $${price}`);

                            listing.style.backgroundColor = '#4CAF50';
                            listing.style.color = 'white';

                            foundDeals = true;
                        }
                    }
                }
            } catch (e) {
                console.error('Error processing listing:', e);
            }
        });

        if (foundDeals) {
            triggerAlert();
        }
    }

    function triggerAlert() {
        alertSound.play();

        const toggleBtn = document.getElementById('tma-toggle-btn');
        if (toggleBtn) {
            toggleBtn.classList.add('tma-flash');
        }

        let originalTitle = document.title;
        let titleInterval = setInterval(() => {
            document.title = document.title === originalTitle ? '🔥 DEAL FOUND! 🔥' : originalTitle;
        }, 1000);

        try {
            window.focus();
        } catch (e) {
            console.log('Could not focus window:', e);
        }

        setTimeout(() => {
            if (toggleBtn) {
                toggleBtn.classList.remove('tma-flash');
            }
            clearInterval(titleInterval);
            document.title = originalTitle;
        }, 10000);
    }

    function saveSettings() {
        if (!currentItemId) return;

        const thresholdInput = document.getElementById('tma-threshold');
        const volumeInput = document.getElementById('tma-volume');

        const threshold = parseInt(thresholdInput.value);
        const volume = parseFloat(volumeInput.value);

        if (isNaN(threshold)) {
            alert('Please enter a valid threshold price');
            return;
        }

        if (!isNaN(volume)) {
            alertSound.volume = Math.min(1, Math.max(0, volume));
        }

        const settings = loadSettings();

        settings[currentItemId] = {
            threshold: threshold,
            lastUpdated: new Date().toISOString()
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

        alert(`Alert set for prices at or below $${threshold}`);
    }

    function loadSettings() {
        const savedSettings = localStorage.getItem(STORAGE_KEY);
        return savedSettings ? JSON.parse(savedSettings) : {};
    }

    function setupPurchaseConfirmationAutoClose() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    const successElements = document.querySelectorAll('.successText___ZpEl5');

                    if (successElements.length > 0) {
                        console.log('Purchase success message detected, auto-closing...');

                        successElements.forEach(successElem => {
                            const confirmWrapper = successElem.closest('.confirmWrapper___T6EcT');
                            if (confirmWrapper) {
                                const closeButton = confirmWrapper.querySelector('.closeButton___kyy2h');
                                if (closeButton) {
                                    setTimeout(() => {
                                        closeButton.click();
                                        console.log('Closed purchase success message');
                                    }, 500);
                                }
                            }
                        });
                    }
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('Purchase success message auto-close setup complete');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();