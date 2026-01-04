// ==UserScript==
// @name         Steam CNY价格转换（首页）
// @namespace    https://greasyfork.org/zh-CN/users/963647-moase
// @version      2.0
// @description  精确匹配DOM结构的价格转换
// @author       MaoShiSanKe
// @match        https://steamcommunity.com/market/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.exchangerate-api.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533642/Steam%20CNY%E4%BB%B7%E6%A0%BC%E8%BD%AC%E6%8D%A2%EF%BC%88%E9%A6%96%E9%A1%B5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533642/Steam%20CNY%E4%BB%B7%E6%A0%BC%E8%BD%AC%E6%8D%A2%EF%BC%88%E9%A6%96%E9%A1%B5%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CACHE_TIME = 3600000; // 1小时缓存
    const DEFAULT_RATE = 7.23; // 默认汇率
    let exchangeRate = DEFAULT_RATE;

    async function initExchangeRate() {
        const cached = GM_getValue('cny_rate_v2');
        if (cached && Date.now() - cached.timestamp < CACHE_TIME) {
            exchangeRate = cached.rate;
            return;
        }

        try {
            const rate = await fetchExchangeRate();
            GM_setValue('cny_rate_v2', {
                rate: rate,
                timestamp: Date.now()
            });
            exchangeRate = rate;
        } catch (e) {
            console.warn('汇率更新失败，使用缓存值', e);
        }
    }

    function fetchExchangeRate() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://api.exchangerate-api.com/v4/latest/USD",
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(Number(data.rates.CNY?.toFixed(2)) || DEFAULT_RATE);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    function convertPrice(priceText) {
        const amountMatch = priceText.match(/([\d.,]+)/);
        if (!amountMatch) return null;

        const amount = parseFloat(amountMatch[1].replace(',', ''));
        return `¥${(amount * exchangeRate).toFixed(2)} CNY`; // 格式调整为¥符号+两位小数
    }

    function processPriceElement(el) {
        if (el.dataset.processedV2) return;

        // 精确查找目标位置
        const priceContainer = el.querySelector('.market_table_value.normal_price');
        if (!priceContainer) return;

        const usdPrice = priceContainer.querySelector('.normal_price:not([data-cny])');
        const salePrice = priceContainer.querySelector('.sale_price');

        if (!usdPrice) return;

        const converted = convertPrice(usdPrice.textContent);
        if (!converted) return;

        // 创建精确的CNY元素
        const cnySpan = document.createElement('span');
        cnySpan.className = 'normal_price';
        cnySpan.dataset.price = usdPrice.dataset.price; // 继承原价数据
        cnySpan.dataset.currency = usdPrice.dataset.currency;
        cnySpan.textContent = converted;

        // 精确插入到USD价格和sale价格之间
        const refNode = salePrice ? salePrice : usdPrice.nextSibling;
        priceContainer.insertBefore(document.createElement('br'), usdPrice.nextSibling);
        priceContainer.insertBefore(cnySpan, refNode);

        el.dataset.processedV2 = 'true';
    }

    // 优化后的Observer处理
    const observer = new MutationObserver(mutations => {
        if (!document.querySelector('.market_listing_their_price')) return;

        requestIdleCallback(() => {
            document.querySelectorAll('.market_listing_their_price').forEach(processPriceElement);
        }, { timeout: 500 });
    });

    (async function main() {
        await initExchangeRate();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
        // 初始处理
        requestIdleCallback(() => {
            document.querySelectorAll('.market_listing_their_price').forEach(processPriceElement);
        }, { timeout: 1000 });
    })();
})();