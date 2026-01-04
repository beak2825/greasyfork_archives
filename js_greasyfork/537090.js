// ==UserScript==
// @license MIT
// @name         日本Uniqlo/GU價格轉換器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在日本Uniqlo和GU官網自動將日圓價格換算為台幣
// @author       ADTrader
// @match        https://www.uniqlo.com/jp/ja/*
// @match        https://www.gu-global.com/jp/ja/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      open.er-api.com
// @downloadURL https://update.greasyfork.org/scripts/537090/%E6%97%A5%E6%9C%ACUniqloGU%E5%83%B9%E6%A0%BC%E8%BD%89%E6%8F%9B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537090/%E6%97%A5%E6%9C%ACUniqloGU%E5%83%B9%E6%A0%BC%E8%BD%89%E6%8F%9B%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定與常數
    const EXCHANGE_RATE_API_URL = 'https://open.er-api.com/v6/latest/JPY'; // 免費匯率API
    const EXCHANGE_RATE_CACHE_TIME = 3600000; // 匯率緩存時間（1小時）
    const DEFAULT_EXCHANGE_RATE = 0.23; // 預設匯率 (JPY to TWD)
    const DEBUG = true; // 啟用調試模式
    const SCAN_INTERVAL = 1000; // 掃描價格的間隔（毫秒）
    const PANEL_UPDATE_INTERVAL = 5000; // 面板更新間隔（毫秒）

    // 調試日誌函數
    function logDebug(...args) {
        if (DEBUG) {
            console.log('[日圓轉台幣]', ...args);
        }
    }

    // 主函數
    async function main() {
        logDebug('插件開始執行');

        // 獲取匯率
        let exchangeRate;
        try {
            exchangeRate = await getExchangeRate('JPY', 'TWD');
            logDebug('匯率 (JPY to TWD):', exchangeRate);
        } catch (error) {
            logDebug('獲取匯率失敗，使用預設值', error);
            exchangeRate = DEFAULT_EXCHANGE_RATE;
        }

        // 確保匯率有效
        if (!exchangeRate || isNaN(exchangeRate)) {
            logDebug('匯率無效，使用預設值');
            exchangeRate = DEFAULT_EXCHANGE_RATE;
        }

        // 創建價格轉換面板
        createPricePanel(exchangeRate);

        // 定期掃描價格
        setInterval(() => scanPrices(exchangeRate), SCAN_INTERVAL);

        // 定期更新面板
        setInterval(() => updatePricePanel(exchangeRate), PANEL_UPDATE_INTERVAL);

        // 監聽頁面變化
        observePageChanges(exchangeRate);
    }

    // 獲取匯率
    async function getExchangeRate(fromCurrency, toCurrency) {
        // 檢查緩存
        const cachedData = GM_getValue('exchangeRateData');
        const now = new Date().getTime();

        if (cachedData && (now - cachedData.timestamp < EXCHANGE_RATE_CACHE_TIME)) {
            logDebug('使用緩存的匯率數據');
            return cachedData.rates[toCurrency] || DEFAULT_EXCHANGE_RATE;
        }

        // 獲取新匯率
        return new Promise((resolve, reject) => {
            logDebug('請求新匯率數據');
            GM_xmlhttpRequest({
                method: 'GET',
                url: EXCHANGE_RATE_API_URL,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        // 保存到緩存
                        GM_setValue('exchangeRateData', {
                            timestamp: now,
                            rates: data.rates
                        });
                        resolve(data.rates[toCurrency] || DEFAULT_EXCHANGE_RATE);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                },
                ontimeout: function() {
                    reject(new Error('匯率請求超時'));
                }
            });
        });
    }

    // 創建價格轉換面板
    function createPricePanel(exchangeRate) {
        // 移除已存在的面板
        const existingPanel = document.getElementById('jp-to-tw-price-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // 創建新面板
        const panel = document.createElement('div');
        panel.id = 'jp-to-tw-price-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            background-color: white;
            border: 2px solid #FF0000;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 9999;
            font-family: Arial, sans-serif;
            min-width: 200px;
            max-width: 300px;
        `;

        // 設置面板內容
        panel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #FF0000; font-size: 16px;">日圓 → 台幣 轉換器</h3>
            <div id="price-container" style="margin-bottom: 10px;">
                <div style="margin-bottom: 5px;">
                    <strong>日本價格:</strong> <span id="jp-price">搜尋中...</span>
                </div>
                <div style="margin-bottom: 5px;">
                    <strong>台幣換算:</strong> <span id="tw-price">搜尋中...</span>
                </div>
            </div>
            <div style="font-size: 12px; color: #666;">
                匯率: 1 JPY ≈ ${exchangeRate.toFixed(4)} TWD
            </div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
                最後更新: <span id="last-update">${new Date().toLocaleTimeString()}</span>
            </div>
        `;

        // 添加關閉按鈕
        const closeButton = document.createElement('div');
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            font-size: 16px;
            color: #999;
        `;
        closeButton.textContent = '×';
        closeButton.onclick = function() {
            panel.style.display = 'none';

            // 添加重新顯示按鈕
            showRestoreButton();
        };
        panel.appendChild(closeButton);

        // 添加到頁面
        document.body.appendChild(panel);
        logDebug('價格轉換面板已創建');
    }

    // 添加重新顯示面板的按鈕
    function showRestoreButton() {
        // 移除已存在的按鈕
        const existingButton = document.getElementById('restore-price-panel');
        if (existingButton) {
            existingButton.remove();
        }

        // 創建新按鈕
        const button = document.createElement('button');
        button.id = 'restore-price-panel';
        button.textContent = '顯示價格轉換';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px 15px;
            background-color: #FF0000;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-weight: bold;
        `;

        // 添加點擊事件
        button.onclick = function() {
            const panel = document.getElementById('jp-to-tw-price-panel');
            if (panel) {
                panel.style.display = 'block';
                button.remove();
            } else {
                location.reload(); // 如果面板不存在，重新加載頁面
            }
        };

        // 添加到頁面
        document.body.appendChild(button);
    }

    // 更新價格面板
    function updatePricePanel(exchangeRate) {
        const panel = document.getElementById('jp-to-tw-price-panel');
        if (!panel || panel.style.display === 'none') return;

        // 獲取當前頁面的價格
        const priceInfo = findPricesOnPage();

        // 更新面板內容
        const jpPriceElement = document.getElementById('jp-price');
        const twPriceElement = document.getElementById('tw-price');
        const lastUpdateElement = document.getElementById('last-update');

        if (priceInfo.price) {
            jpPriceElement.textContent = `¥${priceInfo.price.toLocaleString()}`;
            twPriceElement.textContent = `NT$${Math.round(priceInfo.price * exchangeRate).toLocaleString()}`;
        } else {
            jpPriceElement.textContent = '未找到價格';
            twPriceElement.textContent = '無法計算';
        }

        lastUpdateElement.textContent = new Date().toLocaleTimeString();
    }

    // 掃描頁面上的價格
    function scanPrices(exchangeRate) {
        // 獲取當前頁面的價格
        const priceInfo = findPricesOnPage();

        // 如果找到價格，更新面板
        if (priceInfo.price) {
            updatePricePanel(exchangeRate);
        }
    }

    // 在頁面上查找價格
    function findPricesOnPage() {
        let price = null;
        let priceText = '';

        // 判斷當前網站
        const isUniqlo = window.location.href.includes('uniqlo.com');
        const isGU = window.location.href.includes('gu-global.com');

        // 根據網站選擇不同的價格選擇器
        let selectors = [];

        if (isUniqlo) {
            selectors = [
                '.price-value',
                '.product-price',
                '[data-test="product-price"]',
                '.price',
                '[itemprop="price"]',
                '.fs16'
            ];
        } else if (isGU) {
            selectors = [
                '.price',
                '.product-price',
                '.item-price',
                '.fs-price',
                '[data-test="price"]'
            ];
        }

        // 嘗試使用選擇器獲取價格
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (const element of elements) {
                const text = element.textContent.trim();
                // 檢查是否包含價格相關文本
                if (text.includes('¥') || text.includes('円') || /[\d,]+/.test(text)) {
                    priceText = text;
                    // 使用更精確的正則表達式匹配價格
                    const matches = text.match(/[¥￥]?\s*([\d,]+)/);
                    if (matches && matches[1]) {
                        const extractedPrice = parseInt(matches[1].replace(/,/g, ''));
                        // 驗證價格是否合理（大於100日元）
                        if (extractedPrice > 100) {
                            price = extractedPrice;
                            logDebug(`從${selector}找到價格: ${price}, 原文本: ${text}`);
                            return { price, priceText };
                        }
                    }
                }
            }
        }

        // 如果沒有找到價格，嘗試從頁面中搜索包含¥的文本
        if (!price) {
            const allElements = document.querySelectorAll('*');
            for (const element of allElements) {
                // 跳過script和style元素
                if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') continue;

                const text = element.textContent.trim();
                if ((text.includes('¥') || text.includes('円')) && /[¥￥][\d,]+/.test(text)) {
                    priceText = text;
                    const matches = text.match(/[¥￥]?\s*([\d,]+)/);
                    if (matches && matches[1]) {
                        const extractedPrice = parseInt(matches[1].replace(/,/g, ''));
                        // 驗證價格是否合理（大於100日元）
                        if (extractedPrice > 100) {
                            price = extractedPrice;
                            logDebug(`從頁面元素找到價格: ${price}, 原文本: ${text}`);
                            return { price, priceText };
                        }
                    }
                }
            }
        }

        // 如果仍然沒有找到價格，嘗試從URL中提取商品ID並查詢
        if (!price) {
            const url = window.location.href;
            const productIdMatch = url.match(/products\/([^\/]+)/);
            if (productIdMatch) {
                logDebug('從URL提取商品ID:', productIdMatch[1]);
                // 這裡可以添加額外的价格查詢邏輯
            }
        }

        return { price, priceText };
    }

    // 監聽頁面變化
    function observePageChanges(exchangeRate) {
        // 監聽URL變化
        let lastUrl = location.href;
        const urlObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                logDebug('檢測到URL變化，重新掃描價格');
                setTimeout(() => scanPrices(exchangeRate), 1000);
            }
        });
        urlObserver.observe(document, { subtree: true, childList: true });

        // 監聽DOM變化
        const domObserver = new MutationObserver((mutations) => {
            // 檢查是否有價格相關元素變化
            for (const mutation of mutations) {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    const priceRelated = Array.from(mutation.addedNodes).some(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const text = node.textContent;
                            return text && (text.includes('¥') || text.includes('円'));
                        }
                        return false;
                    });

                    if (priceRelated) {
                        logDebug('檢測到價格相關元素變化，重新掃描價格');
                        setTimeout(() => scanPrices(exchangeRate), 500);
                        break;
                    }
                }
            }
        });
        domObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    // 頁面加載完成後執行主函數
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();
