// ==UserScript==
// @name         Torn PI Listings
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  rawww
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @resource     fontSilkscreen https://fonts.googleapis.com/css2?family=Silkscreen&display=swap
// @author       aquagloop
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546850/Torn%20PI%20Listings.user.js
// @updateURL https://update.greasyfork.org/scripts/546850/Torn%20PI%20Listings.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REFRESH_INTERVAL = 60000;
    const STATUS_CHECK_INTERVAL = 1000;
    let fetchInterval = null;
    let container = null;
    let isClosedByUser = false;

    const fontCss = GM_getResourceText('fontSilkscreen');
    GM_addStyle(fontCss);

    const getStoredApiKey = () => localStorage.getItem('torn_pi_viewer_api_key') || '';
    const setStoredApiKey = (key) => localStorage.setItem('torn_pi_viewer_api_key', key);
    const deleteStoredApiKey = () => localStorage.removeItem('torn_pi_viewer_api_key');

    const updateUiState = () => {
        const apiKey = getStoredApiKey();
        const apiKeyContainer = document.getElementById('piApiKeyContainer');
        const tableContainer = document.getElementById('piTableContainer');
        const tbody = document.querySelector('#piViewer tbody');

        if (apiKey) {
            if (apiKeyContainer) apiKeyContainer.style.display = 'none';
            if (tableContainer) tableContainer.style.display = 'block';
            startFetching();
        } else {
            if (apiKeyContainer) apiKeyContainer.style.display = 'block';
            if (tableContainer) tableContainer.style.display = 'none';
            if (fetchInterval) {
                clearInterval(fetchInterval);
                fetchInterval = null;
            }
            if (tbody) tbody.innerHTML = '';
        }
    };

    const createUI = () => {
        container = document.createElement('div');
        container.id = 'piViewer';
        container.style.display = 'none';

        container.innerHTML = `
            <div class="piSection">
                <div class="piSectionHeader">
                    <h3>Property Listings</h3>
                    <div class="piHeaderButtons">
                        <button id="piCloseBtn" title="Close">X</button>
                    </div>
                </div>
                <div class="piSectionContent">
                    <div id="piApiKeyContainer">
                        <label for="piApiKeyInput">API Key:</label>
                        <input type="text" id="piApiKeyInput" />
                        <button id="savePiApiKeyBtn">Submit</button>
                    </div>
                    <div id="piTableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>Cost</th>
                                    <th>Happiness</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>`;

        document.body.appendChild(container);

        document.getElementById('piCloseBtn').addEventListener('click', () => {
            isClosedByUser = true;
            container.style.display = 'none';
        });

        document.getElementById('savePiApiKeyBtn').addEventListener('click', () => {
            const key = document.getElementById('piApiKeyInput').value.trim();
            if (key) {
                setStoredApiKey(key);
                updateUiState();
            }
        });

        updateUiState();
        makeDraggable(container);
    };

    const updatePIUI = (listings) => {
        const tbody = document.querySelector('#piViewer tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (!listings || listings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="2" style="text-align:center;">You see no available properties.</td></tr>';
            return;
        }

        listings.forEach(listing => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><span class="cost-value">$${listing.cost.toLocaleString()}</span></td>
                <td><span class="happy-value">${listing.happy.toLocaleString()}</span></td>`;
            tbody.appendChild(row);
        });
    };

    const fetchPIs = () => {
        const key = getStoredApiKey();
        if (!key) return;

        const apiUrl = `https://api.torn.com/v2/market/13/properties?key=${key}&limit=100`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.error) {
                        const tbody = document.querySelector('#piViewer tbody');
                        if (tbody) tbody.innerHTML = `<tr><td colspan="2" class="error-message">Error: Cannot read the scroll.</td></tr>`;
                        return;
                    }
                    const listings = data.properties.listings || [];
                    updatePIUI(listings);
                } catch (e) {
                    console.error('PI Viewer: Failed to parse API response:', e);
                }
            },
            onerror: function (res) {
                console.error('PI Viewer: GM_xmlhttpRequest error', res);
            }
        });
    };

    const startFetching = () => {
        if (fetchInterval) clearInterval(fetchInterval);
        fetchPIs();
        fetchInterval = setInterval(fetchPIs, REFRESH_INTERVAL);
    };

    const checkStatusAndToggle = () => {
        const inHospital = document.querySelector('a[aria-label^="Hospital"]');
        if (inHospital) {
            if (!isClosedByUser && container) {
                container.style.display = 'block';
            }
        } else {
            if (container) {
                container.style.display = 'none';
            }
            isClosedByUser = false;
        }
    };

    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        createUI();
        setInterval(checkStatusAndToggle, STATUS_CHECK_INTERVAL);
    };

    const promptAndSetApiKey = () => {
        const newKey = prompt('Please enter your Torn API key:', getStoredApiKey());
        if (newKey && newKey.trim()) {
            setStoredApiKey(newKey.trim());
            alert('API Key saved.');
            updateUiState();
        } else if (newKey !== null) {
            alert('API Key cannot be empty.');
        }
    };

    const confirmAndDeleteApiKey = () => {
        if (getStoredApiKey() && confirm('Are you sure you want to delete your API key?')) {
            deleteStoredApiKey();
            alert('API Key deleted.');
            updateUiState();
        } else if (!getStoredApiKey()) {
            alert('No API key is currently saved.');
        }
    };

    GM_registerMenuCommand('Set/Update API Key', promptAndSetApiKey);
    GM_registerMenuCommand('Delete API Key', confirmAndDeleteApiKey);

    init();

    GM_addStyle(`
        :root {
            --tibia-frame-bg: #505050;
            --tibia-content-bg: #323232;
            --tibia-border-light: #737373;
            --tibia-border-dark: #2D2D2D;
            --tibia-text-grey: #C0C0C0;
            --tibia-text-value: #FFFFCC;
        }
        #piViewer {
            position: fixed;
            top: 150px;
            right: 20px;
            background-color: var(--tibia-frame-bg);
            border-top: 1px solid var(--tibia-border-light);
            border-left: 1px solid var(--tibia-border-light);
            border-right: 1px solid var(--tibia-border-dark);
            border-bottom: 1px solid var(--tibia-border-dark);
            padding: 2px;
            font-family: 'Silkscreen', Tahoma, sans-serif;
            font-size: 11px;
            -webkit-font-smoothing: none;
            image-rendering: pixelated;
            width: 320px;
            z-index: 10001;
            user-select: none;
        }
        .piSectionHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: var(--tibia-frame-bg);
            color: var(--tibia-text-grey);
            padding: 3px 4px;
            border-top: 1px solid var(--tibia-border-light);
            border-left: 1px solid var(--tibia-border-light);
            border-right: 1px solid var(--tibia-border-dark);
            border-bottom: 1px solid var(--tibia-border-dark);
            cursor: move;
        }
        .piSectionHeader h3 {
            margin: 0;
            font-size: 11px;
            font-weight: bold;
            position: relative;
            top: 5px;
        }
        .piHeaderButtons button {
            width: 15px;
            height: 15px;
            padding: 0;
            line-height: 15px;
            background-color: var(--tibia-frame-bg);
            color: var(--tibia-text-grey);
            border-top: 1px solid var(--tibia-border-light);
            border-left: 1px solid var(--tibia-border-light);
            border-right: 1px solid var(--tibia-border-dark);
            border-bottom: 1px solid var(--tibia-border-dark);
            cursor: pointer;
            text-align: center;
            font-size: 10px;
            font-weight: bold;
        }
        .piHeaderButtons button:active {
            border-top: 1px solid var(--tibia-border-dark);
            border-left: 1px solid var(--tibia-border-dark);
            border-right: 1px solid var(--tibia-border-light);
            border-bottom: 1px solid var(--tibia-border-light);
        }
        .piSectionContent {
            background: var(--tibia-content-bg);
            color: var(--tibia-text-grey);
            border-top: 1px solid var(--tibia-border-dark);
            border-left: 1px solid var(--tibia-border-dark);
            border-right: 1px solid var(--tibia-border-light);
            border-bottom: 1px solid var(--tibia-border-light);
            padding: 4px;
        }
        #piTableContainer {
            max-height: 450px;
            overflow-y: auto;
        }
        #piViewer table {
            width: 100%;
            border-collapse: collapse;
        }
        #piViewer thead th {
            color: var(--tibia-text-grey);
            padding: 2px 4px;
            text-align: left;
            font-weight: bold;
        }
        #piViewer tbody tr:hover {
            background-color: #424242;
        }
        #piViewer tbody td {
            padding: 3px 4px;
            border-top: 1px solid #424242;
        }
        #piViewer tbody tr:first-child td {
            border-top: none;
        }
        .cost-value,
        .happy-value {
            color: var(--tibia-text-value);
            font-family: Verdana, sans-serif;
            font-size: 12px;
        }
        .error-message {
            text-align: center;
            color: #FF5555;
        }
        #piApiKeyContainer {
            padding: 4px;
        }
        #piApiKeyContainer label {
            display: block;
            color: var(--tibia-text-grey);
            margin-bottom: 4px;
            font-weight: bold;
        }
        #piApiKeyContainer input {
            box-sizing: border-box;
            width: 100%;
            background: #222;
            color: #FFFFFF;
            padding: 4px;
            font-family: inherit;
            font-size: 11px;
            border-top: 1px solid var(--tibia-border-dark);
            border-left: 1px solid var(--tibia-border-dark);
            border-right: 1px solid var(--tibia-border-light);
            border-bottom: 1px solid var(--tibia-border-light);
        }
        #piApiKeyContainer button {
            padding: 3px 8px;
            margin-top: 4px;
            color: var(--tibia-text-grey);
            background-color: var(--tibia-frame-bg);
            font-family: inherit;
            font-size: 11px;
            border-top: 1px solid var(--tibia-border-light);
            border-left: 1px solid var(--tibia-border-light);
            border-right: 1px solid var(--tibia-border-dark);
            border-bottom: 1px solid var(--tibia-border-dark);
        }
        #piViewer ::-webkit-scrollbar {
            width: 12px;
        }
        #piViewer ::-webkit-scrollbar-track {
            background: var(--tibia-content-bg);
        }
        #piViewer ::-webkit-scrollbar-thumb {
            background-color: var(--tibia-frame-bg);
            border-top: 1px solid var(--tibia-border-light);
            border-left: 1px solid var(--tibia-border-light);
            border-right: 1px solid var(--tibia-border-dark);
            border-bottom: 1px solid var(--tibia-border-dark);
        }
    `);

    function makeDraggable(el) {
        let isDown = false;
        let offset = [0, 0];
        const header = el.querySelector('.piSectionHeader');
        if (!header) return;

        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDown = true;
            offset = [el.offsetLeft - e.clientX, el.offsetTop - e.clientY];
        }, true);

        document.addEventListener('mouseup', () => {
            isDown = false;
        }, true);

        document.addEventListener('mousemove', (e) => {
            if (isDown) {
                e.preventDefault();
                el.style.left = `${e.clientX + offset[0]}px`;
                el.style.top = `${e.clientY + offset[1]}px`;
                el.style.right = 'auto';
                el.style.bottom = 'auto';
            }
        }, true);
    }
})();