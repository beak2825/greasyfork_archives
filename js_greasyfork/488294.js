// ==UserScript==
// @name         Torn.com Enhanced Chat Buttons V2
// @namespace    http://tampermonkey.net/
// @version      2.62
// @description  Add customizable buttons to your chats in Torn to make your life easier
// @author       Created by Callz [2188704], updated by Weav3r [1853324]
// @match        https://www.torn.com/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/488294/Torncom%20Enhanced%20Chat%20Buttons%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/488294/Torncom%20Enhanced%20Chat%20Buttons%20V2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_TTL = 24 * 60 * 60 * 1000;
    const BAZAAR_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

    const buttonCSS = `
        .custom-chat-button {
            background-color: #007BFF;
            color: white;
            padding: 2px 7px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 6px;
            cursor: pointer;
            border-radius: 5px;
            border: none;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
            min-width: 80px;
            overflow: hidden;
            white-space: nowrap;
        }

        .custom-chat-button:active {
            transform: scale(0.95);
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        }

        .custom-chat-button.recent {
            border: 2px solid #FFD700;
            box-shadow: 0 0 5px rgba(255, 215, 0, 0.8);
        }

        .custom-ui-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #f5f5f5;
            padding: 10px;
            color: black;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            z-index: 9999999999;
            width: 90%;
            max-width: 500px;
            box-sizing: border-box;
            max-height: 90vh;
            overflow: auto;
        }

        .custom-ui-panel h3 {
            font-size: 20px;
            margin-bottom: 10px;
            text-align: center;
        }

        .custom-ui-panel label {
            font-size: 14px;
            margin-bottom: 5px;
            display: block;
        }

        .custom-ui-panel input[type="text"],
        .custom-ui-panel select,
        .custom-ui-panel textarea {
            width: calc(100% - 12px);
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 14px;
        }

        .custom-ui-panel input[type="color"] {
            padding: 0;
            margin-top: 5px;
            border: none;
        }

        .custom-ui-panel button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            margin: 5px;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }

        .custom-ui-panel button#close-ui {
            background-color: #ccc;
        }

        .custom-ui-panel button#close-ui:hover {
            background-color: #999;
        }

        .custom-ui-panel textarea {
            height: 60px;
            resize: vertical;
            position: relative;
        }

        .custom-ui-panel hr {
            margin: 10px 0;
            border: 0;
            border-top: 1px solid #ccc;
        }

        .char-counter {
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 12px;
            color: #999;
        }

        #chat-config-button {
           color: green;
       }

        #button-configs {
            max-height: 400px;
            overflow-y: auto;
            margin-bottom: 10px;
        }

        @media (max-width: 600px) {
            .custom-ui-panel {
                width: 95%;
                max-width: none;
                padding: 8px;
            }

            .custom-ui-panel h3 {
                font-size: 18px;
            }

            .custom-ui-panel label,
            .custom-ui-panel button {
                font-size: 12px;
            }

            .custom-ui-panel input[type="text"],
            .custom-ui-panel select,
            .custom-ui-panel textarea {
                font-size: 12px;
            }

            .custom-ui-panel button {
                padding: 6px 10px;
            }

            .char-counter {
                font-size: 10px;
            }
        }

        .tabs {
            display: flex;
            margin-bottom: 10px;
        }

        .tab {
            flex: 1;
            padding: 10px;
            cursor: pointer;
            text-align: center;
            background-color: #e9e9e9;
            border: 1px solid #ccc;
            border-bottom: none;
            border-radius: 10px 10px 0 0;
        }

        .tab.settings-tab {
            flex: 0.2;
            padding: 10px;
            cursor: pointer;
            text-align: center;
            background-color: #e9e9e9;
            border: 1px solid #ccc;
            border-bottom: none;
            border-radius: 10px 10px 0 0;
        }

        .tab.active {
            background-color: #fff;
            border-bottom: 1px solid #fff;
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .custom-ui-panel.config-list-tab-active {
            max-height: 80vh;
        }

        .search-container {
            display: flex;
            margin-bottom: 10px;
        }

        .search-container input[type="text"] {
            flex: 3;
            padding: 5px;
            margin-right: 5px;
        }

        .search-container select {
            flex: 1;
            padding: 5px;
        }

        .highlight {
            background-color: yellow;
        }

        .tt-chat-filter {
            display: flex;
            padding: 4px;
            align-items: center;
            background-color: var(--chat-box-bg);
            color: var(--chat-box-label-info);
            border-bottom: 1px solid var(--chat-box-input-border);
            margin-bottom: 8px;
        }

        .tt-chat-filter input {
            margin-left: 4px;
            margin-right: 4px;
            border-radius: 5px;
            width: -webkit-fill-available;
            width: -moz-available;
            border: 1px solid var(--chat-box-input-border);
            background-color: var(--chat-box-bg);
            color: var(--chat-box-label-info);
        }

        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999999999;
            opacity: 0;
            transition: opacity 0.5s ease;
        }

        .notification.show {
            opacity: 1;
        }

        .button-config-card {
            border: 1px solid #ccc;
            background-color: #fff;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
        }

        .button-config-message {
            white-space: pre-wrap;
            background: #f9f9f9;
            padding: 5px;
            border-radius: 5px;
            border: 1px solid #ddd;
            margin: 5px 0;
        }
    `;

    const conditions = {
        TradeChat: chatBox => {
            // New chat version
            if (chatBox.id === 'public_trade') return true;
            // Old chat version
            const oldTitle = chatBox.querySelector('.chat-box-header__name___jIjjM');
            return oldTitle && oldTitle.textContent === 'Trade';
        },
        HospitalChat: chatBox => {
            // New chat version
            if (chatBox.id === 'public_hospital') return true;
            // Old chat version
            const oldTitle = chatBox.querySelector('.chat-box-header__name___jIjjM');
            return oldTitle && oldTitle.textContent === 'Hospital';
        },
        FactionChat: chatBox => {
            // New chat version
            if (chatBox.id && chatBox.id.startsWith('faction-')) return true;
            // Old chat version
            const oldTitle = chatBox.querySelector('.chat-box-header__name___jIjjM');
            return oldTitle && oldTitle.textContent === 'Faction';
        },
        CompanyChat: chatBox => {
            // New chat version
            if (chatBox.id && chatBox.id.startsWith('company-')) return true;
            // Old chat version
            const oldTitle = chatBox.querySelector('.chat-box-header__name___jIjjM');
            return oldTitle && oldTitle.textContent === 'Company';
        },
        GlobalChat: chatBox => {
            // New chat version
            if (chatBox.id === 'public_global') return true;
            // Old chat version
            const oldTitle = chatBox.querySelector('.chat-box-header__name___jIjjM');
            return oldTitle && oldTitle.textContent === 'Global';
        },
        UserChat: chatBox => {
            // New chat version
            if (chatBox.id && chatBox.id.startsWith('private-')) return true;
            // Old chat version
            return chatBox.querySelector('.chat-box-header__options___nTsMU') !== null;
        }
    };

    const companyTypes = {
        1: "Hair Salon",
        2: "Law Firm",
        3: "Flower Shop",
        4: "Car Dealership",
        5: "Clothing Store",
        6: "Gun Shop",
        7: "Game Shop",
        8: "Candle Shop",
        9: "Toy Shop",
        10: "Adult Novelties",
        11: "Cyber Cafe",
        12: "Grocery Store",
        13: "Theater",
        14: "Sweet Shop",
        15: "Cruise Line",
        16: "Television Network",
        18: "Zoo",
        19: "Firework Stand",
        20: "Property Broker",
        21: "Furniture Store",
        22: "Gas Station",
        23: "Music Store",
        24: "Nightclub",
        25: "Pub",
        26: "Gents Strip Club",
        27: "Restaurant",
        28: "Oil Rig",
        29: "Fitness Center",
        30: "Mechanic Shop",
        31: "Amusement Park",
        32: "Lingerie Store",
        33: "Meat Warehouse",
        34: "Farm",
        35: "Software Corporation",
        36: "Ladies Strip Club",
        37: "Private Security Firm",
        38: "Mining Corporation",
        39: "Detective Agency",
        40: "Logistics Management",
    };

    function addCSS(cssString) {
        const style = document.createElement('style');
        style.textContent = cssString;
        document.head.append(style);
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerText = message;
        document.body.appendChild(notification);
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 2000);
    }

    function saveRecentButtonInfo(buttonText, chatBoxName) {
        localStorage.setItem('recentButtonInfo', JSON.stringify({ buttonText, chatBoxName }));
    }

    function clearRecentButtonInfo() {
        localStorage.removeItem('recentButtonInfo');
    }

    function getButtonConfigurations() {
        return JSON.parse(localStorage.getItem('chatButtonConfig')) || { buttons: [] };
    }

    function saveButtonConfigurations(config) {
        localStorage.setItem('chatButtonConfig', JSON.stringify(config));
    }

    function getAPIKey() {
        return localStorage.getItem('apiKey') || '';
    }

    function getBuyItems() {
        return localStorage.getItem('buyItems') || '';
    }

    function saveBuyItems(items) {
        localStorage.setItem('buyItems', items);
        showNotification('Buy items saved.');
    }

    function saveAPIKey(key) {
        localStorage.setItem('apiKey', key);
        showNotification('API key saved.');
    }

    function saveCache(key, data) {
        const cacheData = {
            timestamp: Date.now(),
            data
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    }

    function loadCache(key) {
        const cacheData = JSON.parse(localStorage.getItem(key));
        if (cacheData && (Date.now() - cacheData.timestamp < CACHE_TTL)) {
            return cacheData.data;
        }
        return null;
    }

    function clearCache() {
        localStorage.removeItem('companyCache');
        localStorage.removeItem('factionCache');
        showNotification('API cache cleared.');
    }

    function getBazaarData() {
        return loadCache('bazaarCache');
    }

    function saveBazaarData(data) {
        const cacheData = {
            timestamp: Date.now(),
            data
        };
        localStorage.setItem('bazaarCache', JSON.stringify(cacheData));
    }

    function loadBazaarCache() {
        const cacheData = JSON.parse(localStorage.getItem('bazaarCache'));
        if (cacheData && (Date.now() - cacheData.timestamp < BAZAAR_CACHE_TTL)) {
            return cacheData.data;
        }
        return null;
    }

    function formatBazaarItems(bazaarData, maxLength = 125) {
        if (!bazaarData || !bazaarData.bazaar) return 'No bazaar data available';

        const items = bazaarData.bazaar;
        const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        const groupedItems = {};
        items.forEach(item => {
            let type = item.type;
            let name = item.name;

            let displayName;

            if (name === 'Donator Pack') {
                displayName = 'DPs';
            } else if (name === 'Erotic DVD') {
                displayName = 'eDVD';
            } else if (name === 'Xanax') {
                displayName = 'Xan';
            } else if (name === 'Feathery Hotel Coupon') {
                displayName = 'FHC';
            } else if (['Heavy Arms Cache', 'Armor Cache', 'Melee Cache', 'Small Arms Cache', 'Medium Arms Cache'].includes(name)) {
                displayName = 'RW cache';
            } else if (name === 'Six-Pack of Energy Drink') {
                displayName = '6pack edrinks';
            } else if (name === 'Six-Pack of Alcohol') {
                displayName = '6pack alcohol';
            } else {
                if (type === 'Flower' || type === 'Plushie') {
                    displayName = 'Flushies';
                } else if (type === 'Energy Drink') {
                    displayName = 'edrinks';
                } else if (['Melee', 'Primary', 'Secondary', 'Temporary', 'Clothing', 'Jewelry', 'Defensive', 'Special', 'Miscellaneous', 'Enhancer', 'Tools', 'Cars'].includes(type)) {
                    displayName = 'Misc';
                } else {
                    displayName = type;
                }
            }

            if (!groupedItems[displayName]) {
                groupedItems[displayName] = { value: 0 };
            }
            groupedItems[displayName].value += item.price * item.quantity;
        });

        const formattedItems = Object.entries(groupedItems)
            .map(([name, data]) => ({
                name,
                value: data.value,
                percentage: (data.value / totalValue) * 100,
                isMisc: name === 'Misc'
            }))
            .sort((a, b) => {
                if (a.isMisc && !b.isMisc) return 1;
                if (!a.isMisc && b.isMisc) return -1;
                return b.percentage - a.percentage;
            });

        const significantItems = formattedItems.filter(item => item.percentage >= 1);

        let currentLength = 0;
        let itemsToInclude = [];

        for (const item of significantItems) {
            const newLength = currentLength + (currentLength > 0 ? 2 : 0) + item.name.length;
            if (newLength <= maxLength) {
                itemsToInclude.push(item.name);
                currentLength = newLength;
            } else {
                break;
            }
        }

        if (itemsToInclude.length === 0) return 'Empty bazaar';

        return itemsToInclude.join(', ');
    }

    function formatBuyItems(maxLength = 125) {
        const buyItems = getBuyItems().split(',').map(item => item.trim()).filter(item => item);
        if (buyItems.length === 0) return 'No buy items set';

        // Get the last used index from localStorage
        let lastIndex = parseInt(localStorage.getItem('lastBuyItemIndex') || '0');

        let currentLength = 0;
        let itemsToInclude = [];
        let startIndex = lastIndex;

        // Try to fit items starting from the last used index
        for (let i = 0; i < buyItems.length; i++) {
            const index = (startIndex + i) % buyItems.length;
            const item = buyItems[index];
            const newLength = currentLength + (currentLength > 0 ? 2 : 0) + item.length;

            if (newLength <= maxLength) {
                itemsToInclude.push(item);
                currentLength = newLength;
            } else {
                break;
            }
        }

        // Update the last used index for next time
        if (itemsToInclude.length > 0) {
            lastIndex = (startIndex + itemsToInclude.length) % buyItems.length;
            localStorage.setItem('lastBuyItemIndex', lastIndex.toString());
        }

        return itemsToInclude.join(', ');
    }

    function createUIPanel() {
        if (document.querySelector('.custom-ui-panel')) {
            return;
        }

        const panel = document.createElement('div');
        panel.className = 'custom-ui-panel';
        panel.innerHTML = `
            <div class="tabs">
                <div class="tab active" data-tab="config-list-tab">Configured Buttons</div>
                <div class="tab" data-tab="config-edit-tab">Create/Edit Button</div>
                <div class="tab settings-tab" data-tab="config-settings-tab">⚙️</div>
            </div>
            <div id="config-list-tab" class="tab-content active">
                <div class="search-container">
                    <input type="text" id="search-input" placeholder="Search...">
                    <select id="search-select">
                        <option value="buttonText">Text</option>
                        <option value="condition">Condition</option>
                        <option value="text">Message</option>
                    </select>
                </div>
                <div id="button-configs"></div>
            </div>
            <div id="config-edit-tab" class="tab-content">
                <div>
                    <label for="button-text">Button Text</label>
                    <input type="text" id="button-text" placeholder="Button Text">

                    <label for="button-color">Background Color</label>
                    <input type="color" id="button-color">

                    <label for="button-condition">Condition</label>
                    <select id="button-condition">
                        <option value="TradeChat">Trade Chat</option>
                        <option value="HospitalChat">Hospital Chat</option>
                        <option value="FactionChat">Faction Chat</option>
                        <option value="CompanyChat">Company Chat</option>
                        <option value="GlobalChat">Global Chat</option>
                        <option value="UserChat">User Chat</option>
                    </select>

                    <label for="button-text-content">Message</label>
                    <textarea id="button-text-content" placeholder="Enter your message here. Use {name} for chatter's name, {company} for company info, {faction} for faction info, {bazaar} for bazaar info, {buy} for buy items."></textarea>
                    <div class="char-counter" id="char-counter">0</div>

                    <button id="add-button">Add Button</button>
                    <button id="edit-button" style="display: none;">Save Button</button>
                </div>
            </div>
            <div id="config-settings-tab" class="tab-content">
                <label for="api-key">API Key</label>
                <input type="text" id="api-key" placeholder="Enter your API key" value="${getAPIKey()}">
                <button id="save-api-key-button">Save API Key</button>

                <label for="buy-items">Items to Buy (comma separated)</label>
                <input type="text" id="buy-items" placeholder="e.g., xanax, BCT, energy drinks" value="${getBuyItems()}">
                <button id="save-buy-items-button">Save Buy Items</button>

                <button id="import-button">Import Config (File)</button>
                <button id="export-button">Export Config (File)</button>
                <button id="clear-cache-button">Clear API Cache</button>
            </div>
            <button id="close-ui">Close</button>
        `;
        document.body.appendChild(panel);

        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                switchTab(tab.dataset.tab);
            });
        });

        document.getElementById('add-button').addEventListener('click', addNewButtonConfig);
        document.getElementById('edit-button').addEventListener('click', editButtonConfig);
        document.getElementById('close-ui').addEventListener('click', closeUI);
        document.getElementById('import-button').addEventListener('click', importConfig);
        document.getElementById('export-button').addEventListener('click', exportConfig);
        document.getElementById('clear-cache-button').addEventListener('click', clearCache);
        document.getElementById('button-text-content').addEventListener('input', updateCharCounter);
        document.getElementById('search-input').addEventListener('input', filterButtonConfigs);
        document.getElementById('save-api-key-button').addEventListener('click', () => {
            const key = document.getElementById('api-key').value;
            saveAPIKey(key);
        });
        document.getElementById('save-buy-items-button').addEventListener('click', () => {
            const items = document.getElementById('buy-items').value;
            saveBuyItems(items);
        });

        populateButtonConfigs();
    }

    function switchTab(tabId) {
        document.querySelectorAll('.tab, .tab-content').forEach(el => {
            el.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');

        const panel = document.querySelector('.custom-ui-panel');
        if (tabId === 'config-list-tab') {
            panel.classList.add('config-list-tab-active');
        } else {
            panel.classList.remove('config-list-tab-active');
        }
    }

    function populateButtonConfigs() {
        const configsContainer = document.getElementById('button-configs');
        configsContainer.innerHTML = '';
        const configs = getButtonConfigurations();

        configs.buttons.forEach((buttonConfig, index) => {
            const configDiv = document.createElement('div');
            configDiv.className = 'button-config-card draggable';
            configDiv.dataset.index = index;

            const textDiv = document.createElement('div');
            textDiv.innerHTML = `<strong>Text:</strong> ${buttonConfig.buttonText}`;
            configDiv.appendChild(textDiv);

            const colorDiv = document.createElement('div');
            colorDiv.innerHTML = `<strong>Color:</strong> ${buttonConfig.backgroundColor}`;
            configDiv.appendChild(colorDiv);

            const conditionDiv = document.createElement('div');
            conditionDiv.innerHTML = `<strong>Condition:</strong> ${buttonConfig.condition}`;
            configDiv.appendChild(conditionDiv);

            const messageDiv = document.createElement('div');
            messageDiv.className = 'button-config-message';
            messageDiv.innerText = buttonConfig.text;
            configDiv.appendChild(messageDiv);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                selectForEdit(index);
                switchTab('config-edit-tab');
            });
            configDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteButtonConfig(index));
            configDiv.appendChild(deleteButton);

            const moveUpButton = document.createElement('button');
            moveUpButton.textContent = 'Up';
            moveUpButton.addEventListener('click', () => moveButtonConfig(index, -1));
            configDiv.appendChild(moveUpButton);

            const moveDownButton = document.createElement('button');
            moveDownButton.textContent = 'Down';
            moveDownButton.addEventListener('click', () => moveButtonConfig(index, 1));
            configDiv.appendChild(moveDownButton);

            configsContainer.appendChild(configDiv);
        });
    }

    function filterButtonConfigs() {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const searchBy = document.getElementById('search-select').value;
        const configs = getButtonConfigurations();

        const filteredConfigs = configs.buttons.filter(buttonConfig => {
            const fieldValue = buttonConfig[searchBy].toLowerCase();
            return fieldValue.includes(searchInput);
        });

        const configsContainer = document.getElementById('button-configs');
        configsContainer.innerHTML = '';

        filteredConfigs.forEach((buttonConfig, index) => {
            const configDiv = document.createElement('div');
            configDiv.className = 'button-config-card draggable';
            configDiv.dataset.index = index;

            const textDiv = document.createElement('div');
            textDiv.innerHTML = `<strong>Text:</strong> ${buttonConfig.buttonText}`;
            configDiv.appendChild(textDiv);

            const colorDiv = document.createElement('div');
            colorDiv.innerHTML = `<strong>Color:</strong> ${buttonConfig.backgroundColor}`;
            configDiv.appendChild(colorDiv);

            const conditionDiv = document.createElement('div');
            conditionDiv.innerHTML = `<strong>Condition:</strong> ${buttonConfig.condition}`;
            configDiv.appendChild(conditionDiv);

            const messageDiv = document.createElement('div');
            messageDiv.className = 'button-config-message';
            messageDiv.innerText = buttonConfig.text;
            configDiv.appendChild(messageDiv);

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                selectForEdit(index);
                switchTab('config-edit-tab');
            });
            configDiv.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteButtonConfig(index));
            configDiv.appendChild(deleteButton);

            const moveUpButton = document.createElement('button');
            moveUpButton.textContent = 'Up';
            moveUpButton.addEventListener('click', () => moveButtonConfig(index, -1));
            configDiv.appendChild(moveUpButton);

            const moveDownButton = document.createElement('button');
            moveDownButton.textContent = 'Down';
            moveDownButton.addEventListener('click', () => moveButtonConfig(index, 1));
            configDiv.appendChild(moveDownButton);

            configsContainer.appendChild(configDiv);
        });
    }

    function selectForEdit(index) {
        const config = getButtonConfigurations().buttons[index];
        document.getElementById('button-text').value = config.buttonText;
        document.getElementById('button-color').value = config.backgroundColor;
        document.getElementById('button-condition').value = config.condition;
        document.getElementById('button-text-content').value = config.text;

        document.getElementById('add-button').style.display = 'block';
        document.getElementById('edit-button').style.display = 'block';
        document.getElementById('edit-button').setAttribute('data-edit-index', index);
        updateCharCounter();
    }

    function deleteButtonConfig(index) {
        const config = getButtonConfigurations();
        config.buttons.splice(index, 1);
        saveButtonConfigurations(config);
        populateButtonConfigs();
        showNotification('Button deleted.');
    }

    function moveButtonConfig(index, direction) {
        const config = getButtonConfigurations();
        const newIndex = index + direction;

        if (newIndex >= 0 && newIndex < config.buttons.length) {
            const buttonConfig = config.buttons.splice(index, 1)[0];
            config.buttons.splice(newIndex, 0, buttonConfig);
            saveButtonConfigurations(config);
            populateButtonConfigs();
            showNotification('Button moved.');
        }
    }

    function addNewButtonConfig() {
        const buttonText = document.getElementById('button-text').value;
        const backgroundColor = document.getElementById('button-color').value;
        const condition = document.getElementById('button-condition').value;
        const text = document.getElementById('button-text-content').value;

        const config = getButtonConfigurations();
        config.buttons.push({ buttonText, backgroundColor, condition, text });
        saveButtonConfigurations(config);
        populateButtonConfigs();
        highlightButton(config.buttons.length - 1);
        switchTab('config-list-tab');

        clearInputFields();
        showNotification('Button added.');
    }

    function editButtonConfig() {
        const index = parseInt(document.getElementById('edit-button').getAttribute('data-edit-index'), 10);
        const buttonText = document.getElementById('button-text').value;
        const backgroundColor = document.getElementById('button-color').value;
        const condition = document.getElementById('button-condition').value;
        const text = document.getElementById('button-text-content').value;

        const config = getButtonConfigurations();
        config.buttons[index] = { buttonText, backgroundColor, condition, text };
        saveButtonConfigurations(config);
        populateButtonConfigs();
        highlightButton(index);
        switchTab('config-list-tab');

        document.getElementById('add-button').style.display = 'block';
        document.getElementById('edit-button').style.display = 'none';

        clearInputFields();
        showNotification('Button edited.');
    }

    function clearInputFields() {
        document.getElementById('button-text').value = '';
        document.getElementById('button-text-content').value = '';
        document.getElementById('button-color').value = '';
        updateCharCounter();
    }

    function closeUI() {
        const panel = document.querySelector('.custom-ui-panel');
        if (panel) {
            panel.remove();
        }
    }

    function createConfigButton() {
        const peopleButton = document.querySelector('#people_panel_button');
        if (!peopleButton || document.querySelector('#chat-config-button')) return;

        const button = document.createElement('button');
        button.id = 'chat-config-button';
        button.type = 'button';
        button.title = 'Edit Chat Buttons';
        button.className = 'root___WHFbh root___J_YsG';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('viewBox', '0 0 512 512');
        svg.setAttribute('height', '24');
        svg.setAttribute('width', '24');
        svg.classList.add('root___DYylw', 'icon___M_Izz');
        svg.innerHTML = `
            <path d="M312 201.8c0-17.4 9.2-33.2 19.9-47C344.5 138.5 352 118.1 352 96c0-53-43-96-96-96s-96 43-96 96c0 22.1 7.5 42.5 20.1 58.8c10.7 13.8 19.9 29.6 19.9 47c0 29.9-24.3 54.2-54.2 54.2L112 256C50.1 256 0 306.1 0 368c0 20.9 13.4 38.7 32 45.3L32 464c0 26.5 21.5 48 48 48l352 0c26.5 0 48-21.5 48-48l0-50.7c18.6-6.6 32-24.4 32-45.3c0-61.9-50.1-112-112-112l-33.8 0c-29.9 0-54.2-24.3-54.2-54.2zM416 416l0 32L96 448l0-32 320 0z" fill="url(#config-default-blue)"/>
            <defs>
                <linearGradient id="config-default-blue" x1="0.5" x2="0.5" y2="1">
                    <stop offset="0" stop-color="#8faeb4"/>
                    <stop offset="1" stop-color="#638c94"/>
                </linearGradient>
                <linearGradient id="config-hover-blue" x1="0.5" x2="0.5" y2="1">
                    <stop offset="0" stop-color="#eaf0f1"/>
                    <stop offset="1" stop-color="#7b9fa6"/>
                </linearGradient>
            </defs>
        `;

        button.appendChild(svg);
        button.addEventListener('click', createUIPanel);

        const path = svg.querySelector('path');
        button.addEventListener('mouseenter', () => path.setAttribute('fill', 'url(#config-hover-blue)'));
        button.addEventListener('mouseleave', () => path.setAttribute('fill', 'url(#config-default-blue)'));

        peopleButton.insertAdjacentElement('afterend', button);
    }

    function applyButtonConfigurations() {
        const configs = getButtonConfigurations();
        // Query for both old and new chat window classes
        document.querySelectorAll('.root___FmdS_, .chat-box___mHm01').forEach(chatBox => {
            configs.buttons.forEach(buttonConfig => {
                const conditionFunc = conditions[buttonConfig.condition];
                if (conditionFunc && conditionFunc(chatBox) && !chatBox.querySelector(`[data-button-text="${buttonConfig.buttonText}"]`)) {
                    const button = document.createElement('button');
                    button.className = 'custom-chat-button';
                    button.innerText = buttonConfig.buttonText;
                    button.style.backgroundColor = buttonConfig.backgroundColor;
                    button.setAttribute('data-button-text', buttonConfig.buttonText);
                    button.addEventListener('click', (event) => addCustomText(chatBox, buttonConfig.text, event));
                    button.addEventListener('mousedown', (event) => {
                        if (event.button === 0) {
                            let timer;
                            const delay = 1000;
                            timer = setTimeout(() => {
                                button.classList.remove('recent');
                                clearRecentButtonInfo();
                            }, delay);
                            button.addEventListener('mouseup', () => {
                                clearTimeout(timer);
                            }, { once: true });
                            button.addEventListener('mouseleave', () => {
                                clearTimeout(timer);
                            }, { once: true });
                        }
                    });

                    // Try both new and old input container selectors
                    const inputContainer = chatBox.querySelector('.root___WUd1h') || chatBox.querySelector('.chat-box-footer___YK914');
                    if (inputContainer) {
                        let buttonContainer = chatBox.querySelector('.button-container');
                        if (!buttonContainer) {
                            buttonContainer = document.createElement('div');
                            buttonContainer.className = 'button-container';
                            buttonContainer.style.display = 'flex';
                            buttonContainer.style.flexWrap = 'wrap';
                            inputContainer.insertAdjacentElement('beforebegin', buttonContainer);
                        }
                        buttonContainer.appendChild(button);
                    }
                }
            });
        });
    }

    async function addCustomText(chatBox, messageTemplate, event) {
        let name = 'User';
        // Try both new and old name selectors
        const titleElement = chatBox.querySelector('.title___Bmq5P') ||
                           chatBox.querySelector('.typography___Dc5WV') ||
                           chatBox.querySelector('.chat-box-header__name___jIjjM');
        if (titleElement) {
            name = titleElement.textContent.trim();
        }
        let message = messageTemplate.replace('{name}', name);

        if (message.includes('{buy}')) {
            const messageWithoutBuy = message.replace('{buy}', '');
            const availableSpace = 125 - messageWithoutBuy.length;
            const buyText = formatBuyItems(availableSpace);
            message = message.replace('{buy}', buyText);
        }

        if (message.includes('{bazaar}')) {
            const apiKey = getAPIKey();
            if (!apiKey) {
                alert('API key not set. Please set the API key in the settings tab.');
                return;
            }

            let bazaarData = loadBazaarCache();
            if (!bazaarData) {
                const apiUrl = `https://api.torn.com/user/?key=${apiKey}&selections=bazaar`;
                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (!data.error) {
                        bazaarData = data;
                        saveBazaarData(bazaarData);
                    } else {
                        alert('Failed to retrieve bazaar information. Check your API key.');
                        return;
                    }
                } catch (error) {
                    alert('Error fetching bazaar information:', error);
                    return;
                }
            }

            // Calculate available space for bazaar list
            const messageWithoutBazaar = message.replace('{bazaar}', '');
            const availableSpace = 125 - messageWithoutBazaar.length;

            const bazaarText = formatBazaarItems(bazaarData, availableSpace);
            message = message.replace('{bazaar}', bazaarText);
        }

        if (message.includes('{company}')) {
            const apiKey = getAPIKey();
            if (!apiKey) {
                alert('API key not set. Please set the API key in the settings tab.');
                return;
            }

            let companyInfo = loadCache('companyCache');
            if (!companyInfo) {
                const apiUrl = `https://api.torn.com/company/?selections=profile&key=${apiKey}`;
                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (!data.error && data.company) {
                        companyInfo = data.company;
                        saveCache('companyCache', companyInfo);
                    } else {
                        alert('Failed to retrieve company information. Check your API key.');
                        return;
                    }
                } catch (error) {
                    alert('Error fetching company information:', error);
                    return;
                }
            }

            const companyType = companyTypes[companyInfo.company_type] || 'Unknown';
            const companyDetails = `${companyInfo.rating}* ${companyType}`;
            message = message.replace('{company}', companyDetails);
        }

        if (message.includes('{faction}')) {
            const apiKey = getAPIKey();
            if (!apiKey) {
                alert('API key not set. Please set the API key in the settings tab.');
                return;
            }

            let factionInfo = loadCache('factionCache');
            if (!factionInfo) {
                const apiUrl = `https://api.torn.com/faction/?selections=basic&key=${apiKey}`;
                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    if (!data.error && data.respect && data.name && data.rank) {
                        factionInfo = data;
                        saveCache('factionCache', factionInfo);
                    } else {
                        alert('Failed to retrieve faction information. Check your API key.');
                        return;
                    }
                } catch (error) {
                    alert('Error fetching faction information:', error);
                    return;
                }
            }

            const respectFormatted = factionInfo.respect >= 1000000 ? (factionInfo.respect / 1000000).toFixed(1) + 'm' : (factionInfo.respect / 1000).toFixed(1) + 'k';
            const factionDetails = `${factionInfo.name}, ${factionInfo.rank.name} Ranked ${respectFormatted} Respect`;
            message = message.replace('{faction}', factionDetails);
        }

        insertMessage(chatBox, message, event.target);
    }

    function insertMessage(chatBox, message, targetButton) {
        navigator.clipboard.writeText(message).then(() => {
            // Try both new and old textarea selectors
            const textArea = chatBox.querySelector('.textarea___V8HsV') || chatBox.querySelector('textarea');
            if (!textArea) return;
            textArea.focus();
            textArea.setRangeText(message, 0, textArea.value.length, 'end');
            textArea.dispatchEvent(new Event('input', { bubbles: true }));
            textArea.focus();
            textArea.selectionStart = textArea.selectionEnd = message.length;

            document.querySelectorAll('.custom-chat-button').forEach(btn => {
                btn.classList.remove('recent');
            });
            targetButton.classList.add('recent');

            // Try both new and old title selectors
            const titleElement = chatBox.querySelector('.title___Bmq5P') ||
                               chatBox.querySelector('.chat-box-header__name___jIjjM');
            const chatBoxName = titleElement ? titleElement.textContent.trim() : '';
            saveRecentButtonInfo(targetButton.getAttribute('data-button-text'), chatBoxName);
        });
    }

    function applyRecentButtonClass() {
        const recentButtonInfo = JSON.parse(localStorage.getItem('recentButtonInfo'));
        if (recentButtonInfo) {
            document.querySelectorAll('.custom-chat-button').forEach(btn => {
                btn.classList.remove('recent');
            });

            // Query for both old and new chat window classes
            document.querySelectorAll('.root___FmdS_, .chat-box___mHm01').forEach(chatBox => {
                // Try both new and old title selectors
                const titleElement = chatBox.querySelector('.title___Bmq5P') ||
                                   chatBox.querySelector('.chat-box-header__name___jIjjM');
                const chatBoxName = titleElement ? titleElement.textContent.trim() : '';
                if (chatBoxName === recentButtonInfo.chatBoxName) {
                    const button = chatBox.querySelector(`[data-button-text="${recentButtonInfo.buttonText}"]`);
                    if (button) {
                        button.classList.add('recent');
                    }
                }
            });
        }
    }

    function exportConfig() {
        const config = {
            ...getButtonConfigurations(),
            buyItems: getBuyItems()
        };
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'chatButtonConfig.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('Configuration exported to file.');
    }

    function importConfig() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = async (event) => {
            const file = event.target.files[0];
            if (!file) {
                showNotification('No file selected.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    if (config && config.buttons) {
                        saveButtonConfigurations(config);
                        if (config.buyItems) {
                            saveBuyItems(config.buyItems);
                            document.getElementById('buy-items').value = config.buyItems;
                        }
                        populateButtonConfigs();
                        applyButtonConfigurations();
                        showNotification('Configuration imported from file.');
                    } else {
                        showNotification('Invalid configuration file.');
                    }
                } catch (err) {
                    showNotification('Error: Invalid JSON.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    function updateCharCounter() {
        const textArea = document.getElementById('button-text-content');
        if (!textArea) return;
        const counter = document.getElementById('char-counter');
        if (!counter) return;
        counter.textContent = textArea.value.length;
    }

    function highlightButton(index) {
        const configsContainer = document.getElementById('button-configs');
        const buttonDiv = configsContainer.querySelector(`.draggable[data-index="${index}"]`);
        if (buttonDiv) {
            buttonDiv.classList.add('highlight');
            buttonDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                buttonDiv.classList.remove('highlight');
            }, 2000);
        }
    }

    addCSS(buttonCSS);

    const chatContainerObserver = new MutationObserver(function() {
        createConfigButton();
        applyButtonConfigurations();
        applyRecentButtonClass();
    });

    const chatContainer = document.querySelector('#chatRoot');
    if (chatContainer) {
        chatContainerObserver.observe(chatContainer, { childList: true, subtree: true });
    }

    applyButtonConfigurations();
    applyRecentButtonClass();
})();