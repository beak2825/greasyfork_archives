// ==UserScript==
// @name         实时汇率
// @namespace    http://tampermonkey.net/
// @version      0.9.4
// @description  Display real-time exchange rates from API with caching and enhanced spot buy popup
// @author       Grok
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/532070/%E5%AE%9E%E6%97%B6%E6%B1%87%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/532070/%E5%AE%9E%E6%97%B6%E6%B1%87%E7%8E%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    const defaultSettings = {
        currency: 'USD',
        updateFreq: 10, // 单位：分钟
        showCurrencies: ['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD']
    };

    let settings = GM_getValue('exchangeRateSettings', defaultSettings);
    const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存时间（毫秒）

    // Styles
    const style = document.createElement('style');
    style.textContent = `
        .exchange-rate-popup { position: fixed; bottom: 20px; right: 20px; width: 320px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); padding: 15px; z-index: 9999; font-family: Arial, sans-serif; }
        .exchange-rate-popup.hidden { display: none; }
        .popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .rate-item { margin: 8px 0; padding: 5px; background: #f5f5f5; border-radius: 4px; }
        .settings-btn, .refresh-btn, .toggle-btn, .close-btn, .update-btn { cursor: pointer; padding: 2px 8px; background: #007bff; color: white; border-radius: 4px; margin-left: 5px; }
        .settings-panel { margin-top: 10px; padding: 10px; background: #f0f0f0; border-radius: 4px; }
        select, input { margin: 5px 0; width: 100%; padding: 5px; }
        .last-update { font-size: 12px; color: #666; margin-top: 10px; }
        .error-message { color: red; font-size: 12px; margin-top: 10px; }
        .spot-buy-popup { position: fixed; bottom: 20px; right: 20px; width: 200px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); padding: 10px; z-index: 10000; font-family: Arial, sans-serif; text-align: center; }
        .spot-buy-buttons { margin-top: 10px; }
    `;
    document.head.appendChild(style);

    // Main popup (default hidden)
    const popup = document.createElement('div');
    popup.className = 'exchange-rate-popup hidden';
    document.body.appendChild(popup);

    // Proxy URL and API endpoint
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const dataUrl = encodeURIComponent('https://up.liuweinan.com/data.json');

    // Fetch with timeout
    async function fetchWithTimeout(url, options = {}, timeout = 15000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            if (error.name === 'AbortError') {
                throw new Error(`Request timed out after ${timeout / 1000} seconds`);
            }
            throw error;
        }
    }

    // Check and retrieve cached data
    function getCachedRateData() {
        const cached = GM_getValue('cachedRateData', null);
        if (cached && cached.timestamp && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            return cached.data[settings.currency] || { BR: 'N/A', CBR: 'N/A', SR: 'N/A', CSR: 'N/A', MR: 'N/A', DATETIME: cached.timestamp };
        }
        return null;
    }

    // Save data to cache
    function saveCachedRateData(data) {
        GM_setValue('cachedRateData', {
            data: data,
            timestamp: Date.now()
        });
    }

    // Update rates function with caching
    async function updateRates(forceFetch = false) {
        let rateData = { BR: 'N/A', CBR: 'N/A', SR: 'N/A', CSR: 'N/A', MR: 'N/A', DATETIME: 'N/A' };
        let errorMessage = '';
        let isCached = false;

        if (!forceFetch) {
            const cachedRate = getCachedRateData();
            if (cachedRate) {
                rateData = cachedRate;
                isCached = true;
                console.log('Using cached data from:', new Date(cachedRate.DATETIME).toLocaleString());
            }
        }

        if (!isCached) {
            try {
                console.log(`Fetching data from: ${proxyUrl}${dataUrl}`);
                const response = await fetchWithTimeout(`${proxyUrl}${dataUrl}`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    cache: 'no-store',
                    credentials: 'omit'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
                }

                const proxyData = await response.json();
                const data = JSON.parse(proxyData.contents);
                rateData = data[settings.currency] || rateData;
                if (!rateData) {
                    throw new Error(`No data for ${settings.currency} in response`);
                }
                saveCachedRateData(data);
            } catch (error) {
                console.error('Fetch failed:', error);
                errorMessage = error.message;
                const cachedRate = getCachedRateData();
                if (cachedRate) {
                    rateData = cachedRate;
                    isCached = true;
                    errorMessage += ' (Using cached data)';
                }
            }
        }

        popup.innerHTML = `
            <div class="popup-header">
                <h3>${settings.currency} Exchange Rates</h3>
                <div>
                    <span class="settings-btn">⚙️</span>
                    <span class="refresh-btn">🔄</span>
                    <span class="toggle-btn">▼</span>
                </div>
            </div>
            <div class="rates-content">
                <div class="rate-item">现汇买入价: ${rateData.BR}</div>
                <div class="rate-item">现钞买入价: ${rateData.CBR}</div>
                <div class="rate-item">现汇卖出价: ${rateData.SR}</div>
                <div class="rate-item">现钞卖出价: ${rateData.CSR}</div>
                <div class="rate-item">中行折算价: ${rateData.MR}</div>
            </div>
            <div class="last-update">最后更新: ${rateData.DATETIME || new Date().toLocaleString()}</div>
            ${errorMessage ? `<p class="error-message">获取实时数据失败: ${errorMessage}</p>` : isCached ? '<p class="cache-message">使用缓存数据</p>' : ''}
        `;

        popup.querySelector('.toggle-btn').addEventListener('click', () => popup.classList.toggle('hidden'));
        popup.querySelector('.refresh-btn').addEventListener('click', () => updateRates(true));
        popup.querySelector('.settings-btn').addEventListener('click', showSettings);

        return rateData;
    }

    // Settings panel
    function showSettings() {
        const settingsPanel = document.createElement('div');
        settingsPanel.className = 'settings-panel';
        settingsPanel.innerHTML = `
            <select id="currencySelect">
                ${settings.showCurrencies.map(c => `<option value="${c}" ${c === settings.currency ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
            <input id="updateFreq" type="number" value="${settings.updateFreq}" min="1"> 分钟
            <input id="customCurrencies" type="text" value="${settings.showCurrencies.join(',')}" placeholder="货币代码用逗号分隔">
            <button id="saveSettings">保存</button>
        `;
        popup.appendChild(settingsPanel);

        settingsPanel.querySelector('#saveSettings').addEventListener('click', () => {
            settings.currency = settingsPanel.querySelector('#currencySelect').value;
            settings.updateFreq = parseInt(settingsPanel.querySelector('#updateFreq').value);
            settings.showCurrencies = settingsPanel.querySelector('#customCurrencies').value.split(',').map(c => c.trim()).filter(c => c);
            GM_setValue('exchangeRateSettings', settings);
            popup.removeChild(settingsPanel);
            updateRates(true);
            clearInterval(updateInterval);
            startAutoUpdate();
        });
    }

    // Auto-update
    let updateInterval;
    function startAutoUpdate() {
        updateInterval = setInterval(() => updateRates(true), Math.max(settings.updateFreq * 60 * 1000, 60000));
    }

    // Show spot buy rate popup with last update and manual update button
    function showSpotBuyPopup(rateData) {
        const existingPopup = document.querySelector('.spot-buy-popup');
        if (existingPopup) document.body.removeChild(existingPopup);

        const spotBuyPopup = document.createElement('div');
        spotBuyPopup.className = 'spot-buy-popup';
        spotBuyPopup.innerHTML = `
            <h4>${settings.currency} 现汇买入价</h4>
            <p>${rateData.BR}</p>
            <div class="last-update">最后更新: ${rateData.DATETIME || new Date().toLocaleString()}</div>
            <div class="spot-buy-buttons">
                <button class="update-btn">更新</button>
                <button class="close-btn">关闭</button>
            </div>
        `;
        document.body.appendChild(spotBuyPopup);

        spotBuyPopup.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(spotBuyPopup);
        });

        spotBuyPopup.querySelector('.update-btn').addEventListener('click', () => {
            updateRates(true).then(newRateData => {
                spotBuyPopup.querySelector('p').textContent = newRateData.BR;
                spotBuyPopup.querySelector('.last-update').textContent = `最后更新: ${newRateData.DATETIME || new Date().toLocaleString()}`;
                console.log(`手动更新 ${settings.currency} 现汇买入价: ${newRateData.BR}`);
            }).catch(error => {
                spotBuyPopup.querySelector('p').textContent = `错误: ${error.message}`;
                console.error('手动更新失败:', error);
            });
        });
    }

    // Menu commands
    GM_registerMenuCommand('显示汇率弹窗', () => {
        popup.classList.toggle('hidden');
        if (!popup.classList.contains('hidden')) {
            updateRates();
            startAutoUpdate();
        } else {
            clearInterval(updateInterval);
        }
    });

    GM_registerMenuCommand('现汇买入显示数字', () => {
        updateRates().then(rateData => {
            if (rateData.BR !== 'N/A') {
                console.log(`当前 ${settings.currency} 的现汇买入价: ${rateData.BR}`);
            } else {
                console.log('无法获取现汇买入价，使用缓存或默认值。');
            }
            showSpotBuyPopup(rateData);
        }).catch(error => {
            console.error('获取数据失败:', error);
            showSpotBuyPopup({ BR: `错误: ${error.message}`, DATETIME: new Date().toLocaleString() });
        });
    });

    // Initial load (use cached data if available)
    updateRates();
})();
