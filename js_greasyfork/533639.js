// ==UserScript==
// @name         Steam CNY价格转换（商品界面）
// @namespace    https://greasyfork.org/zh-CN/users/963647-moase
// @version      0.5
// @description  Display Steam Market item price in CNY with dynamic exchange rate update interval
// @author       MaoShiSanKe
// @match        https://steamcommunity.com/market/listings/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533639/Steam%20CNY%E4%BB%B7%E6%A0%BC%E8%BD%AC%E6%8D%A2%EF%BC%88%E5%95%86%E5%93%81%E7%95%8C%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533639/Steam%20CNY%E4%BB%B7%E6%A0%BC%E8%BD%AC%E6%8D%A2%EF%BC%88%E5%95%86%E5%93%81%E7%95%8C%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const exchangeRateAPI = 'https://api.exchangerate-api.com/v4/latest/USD';
    const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 缓存过期时间：30分钟
    let lastExchangeRate = null;
    let lastExchangeRateTime = 0;
    let lastDataUpdateTime = 0;
    let isProcessing = false;  // 防止多次执行
    let isRateUpdating = false;  // 防止频繁的汇率请求
    let officialRefreshInterval = 5000;  // 默认5秒

    // 获取商品价格
    const getItemPrices = () => {
        let prices = [];
        document.querySelectorAll('.market_commodity_orders_table td').forEach((cell, index) => {
            if (index % 2 === 0) {
                const priceText = cell.textContent.trim();
                if (priceText.startsWith('$')) {
                    prices.push(parseFloat(priceText.substring(1)));
                }
            }
        });
        return prices;
    };

    // 获取汇率并缓存
    const getExchangeRate = () => {
        const currentTime = Date.now();

        // 如果缓存未过期，直接返回缓存的汇率
        if (lastExchangeRate && currentTime - lastExchangeRateTime < CACHE_EXPIRY_TIME) {
            return Promise.resolve(lastExchangeRate);
        }

        // 如果缓存过期，则重新请求API
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: exchangeRateAPI,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.rates && data.rates.CNY) {
                            // 缓存汇率并设置时间戳
                            lastExchangeRate = data.rates.CNY;
                            lastExchangeRateTime = currentTime;
                            resolve(lastExchangeRate);
                        } else {
                            reject('CNY汇率未找到');
                        }
                    } catch (e) {
                        reject('解析汇率数据失败');
                    }
                },
                onerror: (error) => {
                    reject('请求失败: ' + error);
                }
            });
        });
    };

    // 显示转换后的价格
    const displayPricesInCNY = async () => {
        if (isProcessing) return;  // 防止重复处理
        isProcessing = true;

        const prices = getItemPrices();
        if (prices.length > 0) {
            try {
                const exchangeRate = await getExchangeRate();
                prices.forEach(price => {
                    const priceInCNY = (price * exchangeRate).toFixed(2);
                    const priceElement = document.createElement('span');
                    priceElement.textContent = `(￥\ ${priceInCNY} CNY)`;
                    priceElement.classList.add('cny-price');

                    const priceNode = Array.from(document.querySelectorAll('.market_commodity_orders_table td')).find(node => node.textContent.includes(`$${price.toFixed(2)}`));
                    if (priceNode && !priceNode.querySelector('.cny-price')) {
                        priceNode.appendChild(priceElement);
                    }
                });
            } catch (error) {
                console.error('获取汇率失败:', error);
            }
        }
        isProcessing = false;
    };

    // 捕获官方刷新间隔（如果可以的话）
    const captureRefreshInterval = () => {
        const refreshTimeNode = document.querySelector('.market_commodity_orders_table');
        if (refreshTimeNode) {
            // 检测到页面内数据更新的时间间隔
            const refreshInterval = window.getComputedStyle(refreshTimeNode).getPropertyValue('animation-duration');
            if (refreshInterval) {
                const seconds = parseFloat(refreshInterval) * 1000;  // 将秒转为毫秒
                officialRefreshInterval = seconds;
                console.log(`检测到官方刷新间隔: ${officialRefreshInterval / 1000} 秒`);
            }
        }
    };

    // 检测数据是否刷新并更新汇率
    const checkForDataUpdate = () => {
        const currentTime = Date.now();

        // 如果数据已经刷新，并且距离上次汇率更新超过刷新间隔，则更新汇率
        if (currentTime - lastDataUpdateTime >= officialRefreshInterval && !isRateUpdating) {
            isRateUpdating = true;
            lastDataUpdateTime = currentTime;
            displayPricesInCNY().finally(() => {
                isRateUpdating = false;
            });
        }
    };

    // 使用 MutationObserver 监听价格更新
    const observePriceChanges = () => {
        const targetNode = document.querySelector('.market_commodity_orders_table');
        if (targetNode) {
            const observer = new MutationObserver(() => {
                checkForDataUpdate();  // 检查数据更新时间
            });
            observer.observe(targetNode, { childList: true, subtree: true });
        }
    };

    // 处理页面加载
    window.addEventListener('load', () => {
        captureRefreshInterval();  // 捕获官方刷新间隔
        displayPricesInCNY();
        observePriceChanges();
        // 定时检查数据更新时间并更新汇率
        setInterval(checkForDataUpdate, officialRefreshInterval);
    });
})();
