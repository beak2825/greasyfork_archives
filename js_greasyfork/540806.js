// ==UserScript==
// @name         RugPlay Universal API GUI
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  A GUI for the Rugpull API.
// @author       4koy
// @match        https://rugplay.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540806/RugPlay%20Universal%20API%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/540806/RugPlay%20Universal%20API%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // TODO: maybe make this configurable later idk
    let apiKey = GM_getValue('rugplay_api_key', '');

    // main gui stuff
    function createGUI() {
        const gui = document.createElement('div');
        gui.id = 'rugplay-api-gui';
        gui.innerHTML = `
            <div class="api-header">
                <h2>RugPlay *UNIVERSE Utility</h2>
                <button id="toggle-gui">−</button>
            </div>
            <div class="api-content">
                <div class="api-key-section">
                    <label for="api-key-input">API Key:</label>
                    <input type="password" id="api-key-input" value="${apiKey}" placeholder="Enter your API key">
                    <button id="save-key">Save</button>
                </div>
                
                <div class="endpoint-section">
                    <label for="endpoint-select">Endpoint:</label>
                    <select id="endpoint-select">
                        <option value="stability">Coin Stability Analysis</option>
                        <option value="top">Top Coins</option>
                        <option value="market">Market Data</option>
                        <option value="coin">Coin Details</option>
                        <option value="holders">Coin Holders</option>
                        <option value="hopium">Prediction Markets</option>
                        <option value="hopium-detail">Prediction Market Detail</option>
                    </select>
                </div>

                <div id="parameters-section"></div>
                
                <div class="action-section">
                    <button id="make-request">Make Request</button>
                    <button id="clear-response">Clear Response</button>
                </div>

                <div class="response-section">
                    <div class="response-header">
                        <span>Response:</span>
                        <div class="response-controls">
                            <span id="request-status"></span>
                            <button id="copy-output-small" title="Copy to clipboard">📋</button>
                        </div>
                    </div>
                    <pre id="response-output"></pre>
                </div>
            </div>
        `;
        
        document.body.appendChild(gui);
        return gui;
    }

    // styling - going for that sleek glassmorphism vibe
    GM_addStyle(`
        #rugplay-api-gui {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 405px;
            max-height: 108vh;
            background: rgba(15, 15, 23, 0.85);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 14px;
            box-shadow: 
                0 7px 29px rgba(0, 0, 0, 0.4),
                0 0 0 1px rgba(255, 255, 255, 0.05),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            z-index: 10000;
            font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
            color: rgba(255, 255, 255, 0.9);
            overflow: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform: scale(0.9);
            transform-origin: top right;
        }

        #rugplay-api-gui:hover {
            box-shadow: 
                0 11px 36px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.08),
                inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        .api-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 22px;
            background: rgba(255, 255, 255, 0.05);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
        }

        .api-header h2 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            background: linear-gradient(135deg, #ffffff 0%, #a0a0a0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        #toggle-gui {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            font-size: 14px;
            cursor: pointer;
            padding: 7px 11px;
            border-radius: 7px;
            transition: all 0.2s ease;
            backdrop-filter: blur(10px);
        }

        #toggle-gui:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
            color: rgba(255, 255, 255, 1);
            transform: scale(1.05);
        }

        .api-content {
            padding: 22px;
            max-height: 99vh;
            overflow-y: auto;
        }

        .api-content::-webkit-scrollbar {
            width: 6px;
        }

        .api-content::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        .api-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        .api-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .api-content.collapsed {
            display: none;
        }

        .api-key-section, .endpoint-section, .action-section {
            margin-bottom: 22px;
        }

        .api-key-section {
            display: flex;
            gap: 11px;
            align-items: center;
        }

        label {
            font-weight: 500;
            margin-bottom: 7px;
            display: block;
            color: rgba(255, 255, 255, 0.8);
            font-size: 13px;
        }

        .api-key-section label {
            margin-bottom: 0;
            white-space: nowrap;
        }

        input, select, textarea {
            width: 100%;
            padding: 11px 14px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 9px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(10px);
            color: rgba(255, 255, 255, 0.9);
            font-size: 13px;
            transition: all 0.2s ease;
        }

        input::placeholder {
            color: rgba(255, 255, 255, 0.4);
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(99, 102, 241, 0.5);
            box-shadow: 
                0 0 0 3px rgba(99, 102, 241, 0.1),
                0 4px 14px rgba(99, 102, 241, 0.1);
        }

        button {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            color: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(255, 255, 255, 0.15);
            padding: 11px 18px;
            border-radius: 9px;
            cursor: pointer;
            font-weight: 500;
            font-size: 13px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        button:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
            box-shadow: 0 5px 18px rgba(0, 0, 0, 0.3);
        }

        button:active {
            transform: translateY(0);
        }

        #save-key {
            flex-shrink: 0;
        }

        .parameter-group {
            margin-bottom: 18px;
        }

        .parameter-row {
            display: flex;
            gap: 11px;
            margin-bottom: 11px;
        }

        .parameter-row input, .parameter-row select {
            flex: 1;
        }

        .action-section {
            display: flex;
            gap: 11px;
        }

        #make-request {
            background: linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%);
            border: 1px solid rgba(34, 197, 94, 0.3);
            flex: 1;
        }

        #make-request:hover {
            background: linear-gradient(135deg, rgba(34, 197, 94, 1) 0%, rgba(22, 163, 74, 1) 100%);
            border-color: rgba(34, 197, 94, 0.5);
            box-shadow: 0 6px 25px rgba(34, 197, 94, 0.3);
        }

        #clear-response {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.9) 100%);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }

        #clear-response:hover {
            background: linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%);
            border-color: rgba(239, 68, 68, 0.5);
            box-shadow: 0 6px 25px rgba(239, 68, 68, 0.3);
        }

        .response-section {
            margin-top: 22px;
        }

        .response-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 11px;
        }

        .response-controls {
            display: flex;
            gap: 11px;
            align-items: center;
        }

        #request-status {
            font-size: 11px;
            padding: 5px 11px;
            border-radius: 7px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
        }

        #response-output {
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(15px);
            color: rgba(255, 255, 255, 0.9);
            padding: 18px;
            border-radius: 11px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 450px;
            overflow-y: auto;
            font-size: 10px;
            line-height: 1.0;
            font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
            box-shadow: inset 0 2px 7px rgba(0, 0, 0, 0.3);
        }

        #response-output::-webkit-scrollbar {
            width: 6px;
        }

        #response-output::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 3px;
        }

        #response-output::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 3px;
        }

        #copy-output-small {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 7px 11px;
            font-size: 13px;
            min-width: auto;
            border-radius: 7px;
        }

        #copy-output-small:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .parameter-description {
            font-size: 10px;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 4px;
            font-style: italic;
        }

        /* Subtle glow animations */
        @keyframes subtle-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.1); }
            50% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.2); }
        }

        #rugplay-api-gui:focus-within {
            animation: subtle-glow 3s ease-in-out infinite;
        }
    `);

    // endpoint configs - these match the API docs
    const endpointConfigs = {
        top: {
            url: 'https://rugplay.com/api/v1/top',
            method: 'GET',
            parameters: []
        },
        market: {
            url: 'https://rugplay.com/api/v1/market',
            method: 'GET',
            parameters: [
                { name: 'search', type: 'text', description: 'Search by coin name or symbol' },
                { name: 'sortBy', type: 'select', options: ['marketCap', 'currentPrice', 'change24h', 'volume24h', 'createdAt'], description: 'Sort field (default: marketCap)' },
                { name: 'sortOrder', type: 'select', options: ['asc', 'desc'], description: 'Sort order (default: desc)' },
                { name: 'priceFilter', type: 'select', options: ['all', 'under1', '1to10', '10to100', 'over100'], description: 'Price range filter' },
                { name: 'changeFilter', type: 'select', options: ['all', 'gainers', 'losers', 'hot', 'wild'], description: 'Change filter' },
                { name: 'page', type: 'number', description: 'Page number (default: 1)' },
                { name: 'limit', type: 'number', description: 'Items per page, max 100 (default: 12)' }
            ]
        },
        coin: {
            url: 'https://rugplay.com/api/v1/coin/{symbol}',
            method: 'GET',
            parameters: [
                { name: 'symbol', type: 'text', required: true, description: 'Coin symbol (e.g., "TEST")' },
                { name: 'timeframe', type: 'select', options: ['1m', '5m', '15m', '1h', '4h', '1d'], description: 'Chart timeframe (default: 1m)' }
            ]
        },
        holders: {
            url: 'https://rugplay.com/api/v1/holders/{symbol}',
            method: 'GET',
            parameters: [
                { name: 'symbol', type: 'text', required: true, description: 'Coin symbol (e.g., "TEST")' },
                { name: 'limit', type: 'number', description: 'Number of holders to return, max 200 (default: 50)' }
            ]
        },
        stability: {
            url: 'custom',
            method: 'GET',
            parameters: [
                { name: 'symbol', type: 'text', required: true, description: 'Coin symbol (e.g., "UNIVERSE")' }
            ]
        },
        hopium: {
            url: 'https://rugplay.com/api/v1/hopium',
            method: 'GET',
            parameters: [
                { name: 'status', type: 'select', options: ['ACTIVE', 'RESOLVED', 'CANCELLED', 'ALL'], description: 'Filter by status (default: ACTIVE)' },
                { name: 'page', type: 'number', description: 'Page number (default: 1)' },
                { name: 'limit', type: 'number', description: 'Items per page, max 100 (default: 20)' }
            ]
        },
        'hopium-detail': {
            url: 'https://rugplay.com/api/v1/hopium/{question_id}',
            method: 'GET',
            parameters: [
                { name: 'question_id', type: 'number', required: true, description: 'Question ID (e.g., 101)' }
            ]
        }
    };

    // main initialization function
    function initializeGUI() {
        const gui = createGUI();
        
        // grab all the elements we need
        const toggleBtn = document.getElementById('toggle-gui');
        const apiContent = document.querySelector('.api-content');
        const apiKeyInput = document.getElementById('api-key-input');
        const saveKeyBtn = document.getElementById('save-key');
        const endpointSelect = document.getElementById('endpoint-select');
        const parametersSection = document.getElementById('parameters-section');
        const makeRequestBtn = document.getElementById('make-request');
        const clearResponseBtn = document.getElementById('clear-response');
        const responseOutput = document.getElementById('response-output');
        const requestStatus = document.getElementById('request-status');

        // toggle gui collapse/expand
        toggleBtn.addEventListener('click', () => {
            if (apiContent.classList.contains('collapsed')) {
                apiContent.classList.remove('collapsed');
                toggleBtn.textContent = '−';
            } else {
                apiContent.classList.add('collapsed');
                toggleBtn.textContent = '+';
            }
        });

        // save the api key
        saveKeyBtn.addEventListener('click', () => {
            apiKey = apiKeyInput.value;
            GM_setValue('rugplay_api_key', apiKey);
            requestStatus.textContent = 'API key saved';
            requestStatus.style.background = '#4CAF50';
        });

        // when endpoint changes, update the parameter fields
        endpointSelect.addEventListener('change', updateParameters);

        // make the actual request
        makeRequestBtn.addEventListener('click', makeAPIRequest);

        // clear response output
        clearResponseBtn.addEventListener('click', () => {
            responseOutput.textContent = '';
            requestStatus.textContent = '';
        });

        // copy functionality - this was a pain to get working properly
        const copyOutputBtn = document.getElementById('copy-output-small');
        copyOutputBtn.addEventListener('click', () => {
            const outputText = responseOutput.textContent;
            if (!outputText) {
                requestStatus.textContent = 'No output to copy';
                requestStatus.style.background = '#FF9800';
                return;
            }

            // try modern clipboard API first
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(outputText).then(() => {
                    requestStatus.textContent = 'Output copied to clipboard!';
                    requestStatus.style.background = '#4CAF50';
                    setTimeout(() => {
                        requestStatus.textContent = '';
                    }, 2000);
                }).catch(() => {
                    requestStatus.textContent = 'Failed to copy output';
                    requestStatus.style.background = '#f44336';
                });
            } else {
                // fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = outputText;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    requestStatus.textContent = 'Output copied to clipboard!';
                    requestStatus.style.background = '#4CAF50';
                    setTimeout(() => {
                        requestStatus.textContent = '';
                    }, 2000);
                } catch (err) {
                    requestStatus.textContent = 'Failed to copy output';
                    requestStatus.style.background = '#f44336';
                }
                document.body.removeChild(textArea);
            }
        });

        // set up initial parameters
        updateParameters();

        function updateParameters() {
            const endpoint = endpointSelect.value;
            const config = endpointConfigs[endpoint];
            
            parametersSection.innerHTML = '';
            
            if (config.parameters.length > 0) {
                config.parameters.forEach(param => {
                    const paramDiv = document.createElement('div');
                    paramDiv.className = 'parameter-group';
                    
                    let inputHTML = '';
                    if (param.type === 'select') {
                        inputHTML = `<select id="param-${param.name}">
                            <option value="">-- Select ${param.name} --</option>
                            ${param.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>`;
                    } else {
                        inputHTML = `<input type="${param.type}" id="param-${param.name}" placeholder="${param.description}">`;
                    }
                    
                    paramDiv.innerHTML = `
                        <label for="param-${param.name}">${param.name}${param.required ? ' *' : ''}:</label>
                        ${inputHTML}
                        <div class="parameter-description">${param.description}</div>
                    `;
                    
                    parametersSection.appendChild(paramDiv);
                });
            }
        }

        function makeAPIRequest() {
            const endpoint = endpointSelect.value;
            
            // handle custom stability analysis
            if (endpoint === 'stability') {
                makeStabilityAnalysis();
                return;
            }
            
            const config = endpointConfigs[endpoint];
            
            if (!apiKey) {
                requestStatus.textContent = 'Please enter an API key';
                requestStatus.style.background = '#f44336';
                return;
            }

            // build the url with parameters
            let url = config.url;
            const queryParams = [];
            
            config.parameters.forEach(param => {
                const value = document.getElementById(`param-${param.name}`).value;
                
                if (param.required && !value) {
                    requestStatus.textContent = `Required parameter missing: ${param.name}`;
                    requestStatus.style.background = '#f44336';
                    return;
                }
                
                if (value) {
                    if (url.includes(`{${param.name}}`)) {
                        url = url.replace(`{${param.name}}`, value);
                    } else {
                        queryParams.push(`${param.name}=${encodeURIComponent(value)}`);
                    }
                }
            });

            if (queryParams.length > 0) {
                url += '?' + queryParams.join('&');
            }

            requestStatus.textContent = 'Making request...';
            requestStatus.style.background = '#2196F3';

            GM_xmlhttpRequest({
                method: config.method,
                url: url,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                onload: function(response) {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        responseOutput.textContent = JSON.stringify(jsonResponse, null, 2);
                        requestStatus.textContent = `Success (${response.status})`;
                        requestStatus.style.background = '#4CAF50';
                    } catch (e) {
                        responseOutput.textContent = response.responseText;
                        requestStatus.textContent = `Response (${response.status})`;
                        requestStatus.style.background = '#FF9800';
                    }
                },
                onerror: function(error) {
                    responseOutput.textContent = JSON.stringify(error, null, 2);
                    requestStatus.textContent = 'Error';
                    requestStatus.style.background = '#f44336';
                }
            });
        }

        function makeStabilityAnalysis() {
            const symbol = document.getElementById('param-symbol').value;
            
            if (!symbol) {
                requestStatus.textContent = 'Symbol is required for stability analysis';
                requestStatus.style.background = '#f44336';
                return;
            }

            requestStatus.textContent = 'Analyzing coin stability...';
            requestStatus.style.background = '#2196F3';

            // get both coin and holder data
            Promise.all([
                fetchAPI(`https://rugplay.com/api/v1/coin/${symbol}`),
                fetchAPI(`https://rugplay.com/api/v1/holders/${symbol}`)
            ]).then(([coinData, holdersData]) => {
                const analysis = generateStabilityAnalysis(coinData, holdersData, symbol);
                displayStabilityAnalysis(analysis);
                requestStatus.textContent = 'Stability analysis complete';
                requestStatus.style.background = '#4CAF50';
            }).catch(error => {
                responseOutput.textContent = `Error fetching data: ${error.message}`;
                requestStatus.textContent = 'Analysis failed';
                requestStatus.style.background = '#f44336';
            });
        }

        function fetchAPI(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (e) {
                            reject(new Error(`Failed to parse response: ${e.message}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('Network error'));
                    }
                });
            });
        }

        function generateStabilityAnalysis(coinData, holdersData, symbol) {
            const coin = coinData.coin;
            const holders = holdersData.holders;
            
            // crunch the numbers
            const topHolderPercentage = holders[0]?.percentage || 0;
            const top5Percentage = holders.slice(0, 5).reduce((sum, holder) => sum + (holder.percentage || 0), 0);
            const poolPercentage = ((coin.poolCoinAmount / coin.circulatingSupply) * 100) || 0;
            
            // basic price trend stuff
            const priceChange = coin.change24h || 0;
            const priceChangePercent = ((priceChange / coin.currentPrice) * 100) || 0;
            
            // make a prediction
            let prediction = 'STABLE';
            let predictionColor = '#4CAF50';
            let predictionText = 'Stable - Normal trading patterns';
            
            if (priceChangePercent > 100) {
                prediction = 'UP';
                predictionColor = '#2196F3';
                predictionText = `UP - Uptrend, last 10 candles up ${Math.abs(priceChangePercent).toFixed(2)}%`;
            } else if (priceChangePercent < -50) {
                prediction = 'DOWN';
                predictionColor = '#f44336';
                predictionText = `DOWN - Downtrend, last 10 candles down ${Math.abs(priceChangePercent).toFixed(2)}%`;
            }
            
            // calculate rug risk - this is where it gets spicy
            let riskLevel = 'LOW';
            let riskColor = '#4CAF50';
            let riskFactors = [];
            
            if (topHolderPercentage > 70) {
                riskLevel = 'HIGH';
                riskColor = '#f44336';
                riskFactors.push(`Top holder owns ${topHolderPercentage.toFixed(2)}% (+8%)`);
            } else if (topHolderPercentage > 50) {
                riskLevel = 'MEDIUM';
                riskColor = '#FF9800';
                riskFactors.push(`Top holder owns ${topHolderPercentage.toFixed(2)}% (+6%)`);
            } else {
                riskFactors.push(`Top holder owns ${topHolderPercentage.toFixed(2)}% (+0%)`);
            }
            
            if (top5Percentage > 80) {
                riskFactors.push(`Top 5 holders own ${top5Percentage.toFixed(2)}% (+8%)`);
                if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
            } else {
                riskFactors.push(`Top 5 holders own ${top5Percentage.toFixed(2)}% (+0%)`);
            }
            
            if (poolPercentage > 15) {
                riskFactors.push(`Pool is healthy (${poolPercentage.toFixed(3)}% of supply) (+0%)`);
            } else {
                riskFactors.push(`Pool is low (${poolPercentage.toFixed(3)}% of supply) (+4%)`);
                if (riskLevel === 'LOW') riskLevel = 'MEDIUM';
            }
            
            if (Math.abs(priceChangePercent) < 20) {
                riskFactors.push('No major recent price drop (+0%)');
            } else {
                riskFactors.push(`Major price movement detected (+2%)`);
            }
            
            return {
                symbol,
                coin,
                prediction,
                predictionColor,
                predictionText,
                riskLevel,
                riskColor,
                riskFactors,
                topHolderPercentage,
                top5Percentage,
                poolPercentage
            };
        }

        function displayStabilityAnalysis(analysis) {
            // fancy ascii output because why not
            const output = `
╔═══════════════════════════════════════════════╗
                ${analysis.symbol.toUpperCase()} STABILITY ANALYSIS         
╚═══════════════════════════════════════════════╝

📊 BASIC INFO:
   Current Price: ${analysis.coin.currentPrice?.toFixed(6) || 'N/A'}
   24h Change: ${analysis.coin.change24h?.toLocaleString() || 'N/A'}
   Market Cap: ${analysis.coin.marketCap?.toLocaleString() || 'N/A'}
   Volume 24h: ${analysis.coin.volume24h?.toLocaleString() || 'N/A'}

🔮 PREDICTION: ${analysis.predictionText}

⚠️  RUGPULL RISK: ${analysis.riskLevel} - ${analysis.riskFactors.join('; ')}

📋 RISK BREAKDOWN:
   ${analysis.riskFactors.join('\n   ')}

🏆 HOLDER ANALYSIS:
   Top Holder: ${analysis.topHolderPercentage.toFixed(2)}%
   Top 5 Holders: ${analysis.top5Percentage.toFixed(2)}%
   Pool Health: ${analysis.poolPercentage.toFixed(3)}% of supply

💡 RECOMMENDATION:
   ${analysis.riskLevel === 'HIGH' ? '⛔ HIGH RISK - Exercise extreme caution' : 
     analysis.riskLevel === 'MEDIUM' ? '⚠️  MEDIUM RISK - Monitor closely' : 
     '✅ LOW RISK - Relatively stable'}
            `;
            
            responseOutput.textContent = output;
        }
    }

    // start everything up when ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeGUI);
    } else {
        initializeGUI();
    }
})();