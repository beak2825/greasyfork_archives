// ==UserScript==
// @name         SteamDB Sales CNPrice Injector
// @namespace    https://liangying.eu.org/
// @version      1.1.0
// @description  Adds CNPrice column to SteamDB sales page with selectable currency conversions.
// @author       LiangYing
// @match        https://steamdb.info/sales/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      store.steampowered.com
// @connect      api.exchangerate-api.com
// @icon         https://store.steampowered.com/favicon.ico
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/490272/SteamDB%20Sales%20CNPrice%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/490272/SteamDB%20Sales%20CNPrice%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const COLUMN_CLASS = 'compare-price-column';
    const PRICE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小时的缓存时间

    // 货币符号映射
    const CURRENCY_SYMBOLS = {
        CNY: '¥',
        JPY: '¥',
        HKD: 'HK$',
        USD: '$',
        RUB: '₽',
        PHP: '₱',
        INR: '₹',
        KRW: '₩',
        CAD: 'C$'
    };

    // 汇率对象 - 存储1 CNY兑换多少目标货币
    let exchangeRates = {
        CNY: 1,
        JPY: 16.5,   // 1 CNY = 16.5 JPY
        HKD: 1.09,   // 1 CNY = 1.09 HKD
        USD: 0.14,   // 1 CNY = 0.14 USD
        RUB: 12.7,   // 1 CNY = 12.7 RUB
        PHP: 7.74,   // 1 CNY = 7.74 PHP
        INR: 11.52,  // 1 CNY = 11.52 INR
        KRW: 185.87, // 1 CNY = 185.87 KRW
        CAD: 0.19    // 1 CNY = 0.19 CAD
    };

    // 当前选择的货币
    let currentCurrency = null;

    // 价格缓存
    const priceCache = {
        // 获取缓存的价格
        get: function (appId) {
            const cached = GM_getValue(`price_${appId}`);
            if (!cached) return null;

            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp > PRICE_CACHE_DURATION) {
                GM_setValue(`price_${appId}`, '');
                return null;
            }
            return data;
        },

        // 设置价格缓存
        set: function (appId, priceData) {
            const cacheData = {
                timestamp: Date.now(),
                data: priceData
            };
            GM_setValue(`price_${appId}`, JSON.stringify(cacheData));
        }
    };

    // 创建UI元素
    function createUI() {
        // 尝试找到现有的容器
        const existingContainer = document.querySelector('.dt-layout-end');

        if (existingContainer && !existingContainer.querySelector('.currency-selector')) {
            const rateSelect = document.createElement('select');
            rateSelect.className = 'currency-selector';
            rateSelect.innerHTML = `
                <option value="">-- LiangYing Exchange --</option>
                <option value="CNY">CNY (中国)</option>
                <option value="JPY">JPY (日本)</option>
                <option value="HKD">HKD (香港)</option>
                <option value="USD">USD (美国)</option>
                <option value="RUB">RUB (俄罗斯)</option>
                <option value="PHP">PHP (菲律宾)</option>
                <option value="INR">INR (印度)</option>
                <option value="KRW">KRW (韩国)</option>
                <option value="CAD">CAD (加拿大)</option>
            `;

            rateSelect.style.marginLeft = '10px';
            rateSelect.style.padding = '5px';
            rateSelect.style.backgroundColor = '#1b2838';
            rateSelect.style.color = '#c6d4df';
            rateSelect.style.border = '1px solid #2a475e';

            existingContainer.appendChild(rateSelect);

            rateSelect.addEventListener('change', function () {
                currentCurrency = this.value;
                if (!currentCurrency) {
                    removePriceColumn();
                    return;
                }

                updateExchangeRates(() => {
                    ensurePriceColumn();
                    refreshPrices();
                });
            });
            return;
        }

        // 创建新的容器
        if (!document.querySelector('.currency-selector')) {
            const controlContainer = document.createElement('div');
            controlContainer.className = 'currency-selector-container';
            controlContainer.style.margin = '10px 0';
            controlContainer.style.textAlign = 'right';

            const rateSelect = document.createElement('select');
            rateSelect.className = 'currency-selector';
            rateSelect.innerHTML = `
                <option value="">-- LiangYing Exchange --</option>
                <option value="CNY">CNY (中国)</option>
                <option value="JPY">JPY (日本)</option>
                <option value="HKD">HKD (香港)</option>
                <option value="USD">USD (美国)</option>
                <option value="RUB">RUB (俄罗斯)</option>
                <option value="PHP">PHP (菲律宾)</option>
                <option value="INR">INR (印度)</option>
                <option value="KRW">KRW (韩国)</option>
                <option value="CAD">CAD (加拿大)</option>
            `;

            rateSelect.style.marginLeft = '10px';
            rateSelect.style.padding = '5px';
            rateSelect.style.backgroundColor = '#1b2838';
            rateSelect.style.color = '#c6d4df';
            rateSelect.style.border = '1px solid #2a475e';

            controlContainer.appendChild(rateSelect);

            // 插入UI元素
            const tableElement = document.querySelector('.table-sales') ||
                               document.querySelector('.dataTable');

            if (tableElement && tableElement.parentNode) {
                tableElement.parentNode.insertBefore(controlContainer, tableElement);
            } else {
                const tableContainer = document.querySelector('.table-container') ||
                                     document.querySelector('.table-responsive');
                if (tableContainer) {
                    tableContainer.insertBefore(controlContainer, tableContainer.firstChild);
                }
            }

            rateSelect.addEventListener('change', function () {
                currentCurrency = this.value;
                if (!currentCurrency) {
                    removePriceColumn();
                    return;
                }

                updateExchangeRates(() => {
                    ensurePriceColumn();
                    refreshPrices();
                });
            });
        }
    }

    // 更新汇率数据
    function updateExchangeRates(callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.exchangerate-api.com/v4/latest/CNY',
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        exchangeRates.JPY = data.rates.JPY;
                        exchangeRates.HKD = data.rates.HKD;
                        exchangeRates.USD = data.rates.USD;
                        exchangeRates.RUB = data.rates.RUB;
                        exchangeRates.PHP = data.rates.PHP;
                        exchangeRates.INR = data.rates.INR;
                        exchangeRates.KRW = data.rates.KRW;
                        exchangeRates.CAD = data.rates.CAD;

                        if (callback) callback();
                    } catch (error) {
                        console.error('Failed to parse exchange rates, using defaults:', error);
                        if (callback) callback();
                    }
                } else {
                    console.error('Failed to fetch exchange rates, using defaults:', response.status);
                    if (callback) callback();
                }
            },
            onerror: function() {
                console.error('Failed to fetch exchange rates, using defaults');
                if (callback) callback();
            }
        });
    }

    // 解析价格
    function parsePrice(priceStr) {
        return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
    }

    // 获取商店价格
    function fetchGamePrice(appId, callback, retryCount = 0) {
        const maxRetries = 3;

        // 先检查缓存
        const cachedPrice = priceCache.get(appId);
        if (cachedPrice) {
            callback(cachedPrice);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://store.steampowered.com/api/appdetails/?appids=${appId}&cc=cn`,
            timeout: 10000,
            onload: function (response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data[appId]?.success) {
                        const priceInfo = data[appId].data.price_overview;
                        if (priceInfo) {
                            priceCache.set(appId, priceInfo);
                        }
                        callback(priceInfo);
                    } else {
                        callback(null);
                    }
                } catch (error) {
                    if (retryCount < maxRetries) {
                        setTimeout(() => {
                            fetchGamePrice(appId, callback, retryCount + 1);
                        }, 2000 * (retryCount + 1));
                    } else {
                        callback(null);
                    }
                }
            },
            onerror: function () {
                if (retryCount < maxRetries) {
                    setTimeout(() => {
                        fetchGamePrice(appId, callback, retryCount + 1);
                    }, 2000 * (retryCount + 1));
                } else {
                    callback(null);
                }
            }
        });
    }

    // 确保价格列存在
    function ensurePriceColumn() {
        if (!currentCurrency) return;

        const header = document.querySelector('.table-sales thead tr, .dataTable thead tr');
        if (!header) return;

        let priceHeader = header.querySelector(`.${COLUMN_CLASS}`);
        if (!priceHeader) {
            priceHeader = document.createElement('th');
            priceHeader.className = COLUMN_CLASS;
            header.appendChild(priceHeader);
        }

        // 更新列标题
        const symbol = CURRENCY_SYMBOLS[currentCurrency] || currentCurrency;
        priceHeader.textContent = `${symbol} Price Comparison`;
        priceHeader.style.whiteSpace = 'nowrap';

        const rows = document.querySelectorAll('.table-sales tbody tr, .dataTable tbody tr');
        rows.forEach(row => {
            if (!row.querySelector(`.${COLUMN_CLASS}`)) {
                const priceCell = document.createElement('td');
                priceCell.className = COLUMN_CLASS;
                row.appendChild(priceCell);
            }
        });
    }

    // 移除价格列
    function removePriceColumn() {
        const header = document.querySelector('.table-sales thead tr, .dataTable thead tr');
        if (!header) return;

        const priceHeader = header.querySelector(`.${COLUMN_CLASS}`);
        if (priceHeader) {
            priceHeader.remove();
        }

        const rows = document.querySelectorAll('.table-sales tbody tr, .dataTable tbody tr');
        rows.forEach(row => {
            const priceCell = row.querySelector(`.${COLUMN_CLASS}`);
            if (priceCell) {
                priceCell.remove();
            }
        });
    }

    // 更新单个游戏的价格显示
    function updateGamePrice(row) {
        if (!currentCurrency) return;

        // 获取游戏ID
        const appId = row.dataset.appid;
        if (!appId) return;

        // 找到价格单元格
        let priceCell = row.querySelector(`.${COLUMN_CLASS}`);
        if (!priceCell) {
            priceCell = document.createElement('td');
            priceCell.className = COLUMN_CLASS;
            row.appendChild(priceCell);
        }

        // 如果已经有价格数据，则跳过
        if (priceCell.textContent && !priceCell.textContent.includes('Loading')) {
            return;
        }

        priceCell.textContent = 'Loading...';

        // 从SteamDB表格中获取目标货币价格（第5列）
        const targetCurrencyPriceElement = row.querySelector('td:nth-child(5)');
        const targetCurrencyPrice = targetCurrencyPriceElement ?
            parsePrice(targetCurrencyPriceElement.textContent) : 0;

        if (!targetCurrencyPrice) {
            priceCell.textContent = 'N/A';
            return;
        }

        fetchGamePrice(appId, (priceInfo) => {
            if (priceInfo) {
                // 中国区价格（人民币）
                const cnPrice = priceInfo.final / 100;

                // 汇率：1 CNY = X 目标货币
                const exchangeRate = exchangeRates[currentCurrency];

                // 转换后的目标货币价格
                const convertedPrice = cnPrice * exchangeRate;

                // 计算比例：转换后价格 / SteamDB显示的目标货币价格
                const ratio = targetCurrencyPrice > 0 ?
                    (convertedPrice / targetCurrencyPrice * 100).toFixed(2) : 'N/A';

                // 设置颜色
                const color = (ratio < 100) ? '#5cff47' :
                             (ratio > 100) ? '#ff4747' : '#ccc';

                // 获取货币符号
                const targetSymbol = CURRENCY_SYMBOLS[currentCurrency] || currentCurrency;
                const cnySymbol = CURRENCY_SYMBOLS.CNY;

                // 更新单元格内容
                priceCell.innerHTML = `
                    <div>${cnySymbol}${cnPrice.toFixed(2)}</div>
                    <div>${targetSymbol}${convertedPrice.toFixed(2)}</div>
                    <div style="color: ${color}; font-weight: bold">${ratio}%</div>
                `;
            } else {
                priceCell.textContent = 'N/A';
            }
        });
    }

    // 刷新所有价格
    function refreshPrices() {
        if (!currentCurrency) return;

        ensurePriceColumn();

        const rows = document.querySelectorAll('.table-sales tbody tr, .dataTable tbody tr');
        rows.forEach((row, index) => {
            setTimeout(() => {
                try {
                    updateGamePrice(row);
                } catch (error) {
                    console.error(`Error updating price for row ${index}:`, error);
                }
            }, index * 300);
        });
    }

    // 监听表格变化
    function setupTableObserver() {
        const tableBody = document.querySelector('.table-sales tbody, .dataTable tbody');
        if (tableBody) {
            const tableObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && currentCurrency) {
                        ensurePriceColumn();
                        const newRows = Array.from(mutation.addedNodes).filter(node =>
                            node.nodeType === 1 && node.matches('tr')
                        );
                        newRows.forEach(updateGamePrice);
                    }
                }
            });

            tableObserver.observe(tableBody, {
                childList: true,
                subtree: true
            });
        }

        // 监听分页变化
        const paginationContainer = document.querySelector('.pagination, .dataTables_paginate');
        if (paginationContainer) {
            const paginationObserver = new MutationObserver(() => {
                if (currentCurrency) {
                    ensurePriceColumn();
                    refreshPrices();
                }
            });

            paginationObserver.observe(paginationContainer, {
                childList: true,
                subtree: true
            });
        }

        // 筛选表单监听
        const filterForm = document.getElementById('js-filters');
        if (filterForm) {
            filterForm.addEventListener('submit', () => {
                setTimeout(() => {
                    if (currentCurrency) {
                        ensurePriceColumn();
                        refreshPrices();
                    }
                }, 500);
            });
        }
    }

    // 初始化
    function init() {
        createUI();
        setupTableObserver();
    }

    // 等待页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();