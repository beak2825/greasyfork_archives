// ==UserScript==
// @name         Torn Bazaar Viewer 
// @namespace    http://tampermonkey.net/
// @version      5.0
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      api.torn.com
// @author       aquagloop 
// @license      MIT
// @description editsss
// @downloadURL https://update.greasyfork.org/scripts/538192/Torn%20Bazaar%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/538192/Torn%20Bazaar%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const REFRESH_INTERVAL = 30000;
    let previousItems = {};
    let fetchInterval = null;
    let container = null;

    const getStoredApiKey = () => localStorage.getItem('torn_api_key') || '';
    const setStoredApiKey = (key) => localStorage.setItem('torn_api_key', key);

    const getStoredMinimizedState = () => localStorage.getItem('torn_bazaar_minimized') || 'maximized';
    const setStoredMinimizedState = (state) => localStorage.setItem('torn_bazaar_minimized', state);

    const getStoredPosition = () => localStorage.getItem('torn_bazaar_position');
    const setStoredPosition = (pos) => localStorage.setItem('torn_bazaar_position', JSON.stringify(pos));


    const stopFetching = () => {
        if (fetchInterval) {
            clearInterval(fetchInterval);
            fetchInterval = null;
        }
    };

    const showApiKeyInput = () => {
        stopFetching();
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiKeyContainer = document.getElementById('apiKeyContainer');
        const table = document.querySelector('#bazaarViewer table');
        const tbody = document.querySelector('#bazaarViewer tbody');
        const content = document.getElementById('bazaarContent');
        const button = document.getElementById('toggleBazaar');
        const container = document.getElementById('bazaarViewer');

        if (apiKeyContainer) apiKeyContainer.style.display = 'block';
        if (table) table.style.display = 'none';
        if (apiKeyInput) apiKeyInput.value = getStoredApiKey();
        if (tbody) tbody.innerHTML = '';
        const totalEl = document.querySelector('#bazaarTotal');
        if (totalEl) totalEl.textContent = '$0';

        if (content) content.style.display = 'block';
        if (button) button.textContent = '_';
        if (container) {
            container.style.maxHeight = '500px';
            container.style.overflowY = 'auto';
        }
        setStoredMinimizedState('maximized');
    };

    const deleteApiKey = () => {
        if (confirm('Are you sure you want to delete your API key?')) {
            setStoredApiKey('');
            showApiKeyInput();
            document.getElementById('apiKeyInput').value = '';
            alert('API Key deleted.');
        }
    };

    const handleApiError = (errorMessage) => {
        const errorDiv = document.getElementById('apiError');
        if (errorDiv) {
            errorDiv.textContent = `API Error: ${errorMessage}. Please enter a valid key.`;
            errorDiv.style.display = 'block';
        }
        setStoredApiKey('');
        showApiKeyInput();
    };



    const createUI = () => {
        container = document.createElement('div');
        container.id = 'bazaarViewer';

        const savedPos = getStoredPosition();
        if (savedPos) {
            try {
                const pos = JSON.parse(savedPos);
                if (pos.left && pos.top) {
                    container.style.left = pos.left;
                    container.style.top = pos.top;
                    container.style.right = 'auto';
                }
            } catch (e) {
                console.error("Failed to parse saved position:", e);
                localStorage.removeItem('torn_bazaar_position'); // Clear bad data
            }
        }

        container.innerHTML = `
            <div id="bazaarHeader">
                <h3>Your Bazaar</h3>
                <span id="toggleBazaar">_</span>
            </div>
            <div id="bazaarContent">
                <div id="apiKeyContainer" style="margin-bottom:10px;">
                    <label for="apiKeyInput">API Key:</label>
                    <input type="text" id="apiKeyInput" placeholder="Enter API Key" style="width: calc(100% - 12px); margin-top: 4px; padding: 4px;" />
                    <button id="saveApiKeyBtn" style="margin-top: 6px; width: 100%;">Save Key</button>
                    <div id="apiError" style="color: #D8000C; background-color: #FFD2D2; margin-top: 8px; padding: 5px; border-radius: 4px; display: none;"></div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3">Total:</td>
                            <td id="bazaarTotal">$0</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `;
        document.body.appendChild(container);

        const savedState = getStoredMinimizedState();
        if (savedState === 'minimized') {
            document.getElementById('bazaarContent').style.display = 'none';
            document.getElementById('toggleBazaar').textContent = '+';
            container.style.maxHeight = '30px';
            container.style.overflowY = 'hidden';
        }

        const savedKey = getStoredApiKey();
        const table = document.querySelector('#bazaarViewer table');
        if (savedKey) {
            document.getElementById('apiKeyContainer').style.display = 'none';
            if (table) table.style.display = '';
            startFetching();
        } else {
            if (table) table.style.display = 'none';
        }

        document.getElementById('saveApiKeyBtn').addEventListener('click', () => {
            const key = document.getElementById('apiKeyInput').value.trim();
            if (key) {
                setStoredApiKey(key);
                document.getElementById('apiKeyContainer').style.display = 'none';
                document.getElementById('apiError').style.display = 'none';

                if (table) table.style.display = '';
                startFetching();
            }
        });

        document.getElementById('toggleBazaar').addEventListener('click', () => {
            const content = document.getElementById('bazaarContent');
            const button = document.getElementById('toggleBazaar');
            const container = document.getElementById('bazaarViewer');

            if (content.style.display === 'none') {
                content.style.display = 'block';
                button.textContent = '_';
                container.style.maxHeight = '500px';
                container.style.overflowY = 'auto';
                setStoredMinimizedState('maximized');
            } else {
                content.style.display = 'none';
                button.textContent = '+';
                container.style.maxHeight = '30px';
                container.style.overflowY = 'hidden';
                setStoredMinimizedState('minimized');
            }
        });

        makeDraggable(container);
    };

    const updateUI = (items) => {
        const tbody = document.querySelector('#bazaarViewer tbody');
        const totalEl = document.querySelector('#bazaarTotal');
        if (!tbody || !totalEl) return;
        tbody.innerHTML = '';

        let grandTotal = 0;

        items.forEach(item => {
            const prevQty = previousItems[item.ID]?.quantity ?? item.quantity;
            const decreased = item.quantity < prevQty;
            previousItems[item.ID] = { quantity: item.quantity };

            const subtotal = item.quantity * item.price;
            grandTotal += subtotal;

            const row = document.createElement('tr');
            if (decreased) {
                row.style.outline = '2px solid #4CAF50';
            }
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toLocaleString()}</td>
                <td>$${subtotal.toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });

        totalEl.textContent = '$' + grandTotal.toLocaleString();
    };

    const fetchBazaar = () => {
        const key = getStoredApiKey();
        if (!key) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/user/?selections=bazaar&key=${key}`,
            onload: function (res) {
                try {
                    const data = JSON.parse(res.responseText);
                    if (data.error) {
                        console.error('Torn API Error:', data.error.error);
                        handleApiError(data.error.error);
                        return;
                    }
                    const items = Array.isArray(data.bazaar) ? data.bazaar : [];
                    updateUI(items);
                } catch (e) {
                    console.error("Failed to parse bazaar data:", e);
                }
            },
            onerror: function(res) {
                console.error("GM_xmlhttpRequest error:", res);
                handleApiError("Network error or invalid request.");
            }
        });
    };

    const startFetching = () => {
        stopFetching();
        fetchBazaar();
        fetchInterval = setInterval(fetchBazaar, REFRESH_INTERVAL);
    };

    const init = () => {
        createUI();
        GM_registerMenuCommand('Change/View API Key', showApiKeyInput);
        GM_registerMenuCommand('Delete API Key', deleteApiKey);
    };

    init();

    GM_addStyle(`
        #bazaarViewer {
            position: fixed;
            top: 100px;
            right: 20px;
            background: #ffffff;
            color: #222;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #ccc;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            max-height: 500px;
            width: 340px;
            overflow-y: auto;
            font-family: 'Segoe UI', Tahoma, sans-serif;
            font-size: 13px;
            z-index: 9999;
            display: block;
        }
        #bazaarHeader {
            cursor: move;
            user-select: none;
            overflow: hidden;
            line-height: 20px;
        }
        #bazaarViewer h3 {
            display: inline-block;
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        #toggleBazaar {
            float: right;
            cursor: pointer;
            font-weight: bold;
            font-size: 20px;
            line-height: 16px;
            user-select: none;
            padding: 0 4px;
            margin-top: -2px;
        }
        #bazaarViewer table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        #bazaarViewer thead th {
            position: sticky;
            top: 0;
            background: #f9f9f9;
            font-weight: 600;
            text-align: left;
            padding: 6px 8px;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
        }
        #bazaarViewer tbody td {
            padding: 6px 8px;
            border-bottom: 1px solid #eee;
        }
        #bazaarViewer tr:last-child td {
            border-bottom: none;
        }
        #bazaarViewer tfoot td {
            padding: 6px 8px;
            border-top: 2px solid #ccc;
            font-weight: bold;
        }
        #bazaarViewer tfoot td[colspan="3"] {
            text-align: right;
        }
        #bazaarViewer input, #bazaarViewer button {
            font-size: 13px;
        }
    `);

    function makeDraggable(el) {
        let isDown = false, offset = [0, 0];
        const header = el.querySelector('#bazaarHeader');
        header.addEventListener('mousedown', (e) => {
            if (e.target.id === 'toggleBazaar') return;
            isDown = true;
            offset = [
                el.offsetLeft - e.clientX,
                el.offsetTop - e.clientY
            ];
        });

        document.addEventListener('mouseup', () => {
            if (isDown) {
                const pos = {
                    left: el.style.left,
                    top: el.style.top
                };
                setStoredPosition(pos);
            }
            isDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDown) {
                e.preventDefault();
                el.style.left = `${e.clientX + offset[0]}px`;
                el.style.top = `${e.clientY + offset[1]}px`;
                el.style.right = 'auto';
            }
        });
    }
})();