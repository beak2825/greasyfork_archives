// ==UserScript==
// @name           OpenSea.io 美元转人民币工具 (USD/CNY)
// @name:en        OpenSea.io USD/CNY Converter
// @namespace      https://github.com/ChineseOnChain
// @author         Chairman
// @version        1.1a
// @description    自动将OpenSea价格从美元转换为人民币（实时汇率）
// @description:en Automatically convert USD prices on OpenSea to Chinese Yuan.
// @match          *://opensea.io/*
// @grant          GM_xmlhttpRequest
// @grant          GM_notification
// @grant          GM.getValue
// @grant          GM.setValue
// @connect        api.exchangerate-api.com
// @require        https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @downloadURL https://update.greasyfork.org/scripts/533644/OpenSeaio%20%E7%BE%8E%E5%85%83%E8%BD%AC%E4%BA%BA%E6%B0%91%E5%B8%81%E5%B7%A5%E5%85%B7%20%28USDCNY%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533644/OpenSeaio%20%E7%BE%8E%E5%85%83%E8%BD%AC%E4%BA%BA%E6%B0%91%E5%B8%81%E5%B7%A5%E5%85%B7%20%28USDCNY%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const config = {
        usdPattern: /\$\s*([\d,]+\.?\d*)/g,
        conversionRate: 7.25,
        updateInterval: 24 * 60 * 60 * 1000,
        showOriginal: true, //<--- Change this to 'false' to replace original price entirely.
        decimalPlaces: 2,
        verifyInterval: 3000 // 每3秒检查一次现有汇率转换
    };

    // 跟踪上次看到的价格以避免闪烁
    const priceRegistry = new Map();

    async function initExchangeRate() {
        const lastUpdate = await GM.getValue('lastRateUpdate', 0);
        const savedRate = await GM.getValue('usdToCnyRate', config.conversionRate);
        config.conversionRate = parseFloat(savedRate);
        if (Date.now() - lastUpdate > config.updateInterval) {
            updateExchangeRate();
        }
    }

    function updateExchangeRate() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.exchangerate-api.com/v4/latest/USD",
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    config.conversionRate = data.rates.CNY;
                    GM.setValue('usdToCnyRate', config.conversionRate);
                    GM.setValue('lastRateUpdate', Date.now());
                } catch (e) {
                    console.error("Exchange rate parse error:", e);
                }
            },
            onerror: function(error) {
                console.error("Exchange rate API error:", error);
            }
        });
    }

    function convertPriceText(text, originalText) {
        // 如果已包含转换则跳过
        if (originalText && originalText.includes('(¥')) return text;

        return text.replace(config.usdPattern, (match, usdAmount) => {
            const amount = parseFloat(usdAmount.replace(/,/g, ''));
            const cny = (amount * config.conversionRate).toFixed(config.decimalPlaces);
            return config.showOriginal ? `${match} (¥${cny})` : `¥${cny}`;
        });
    }

    function processNode(node) {
        if (!node.nodeValue || !node.nodeValue.match(config.usdPattern)) return;

        const parent = node.parentNode;
        if (!parent) return;

        // 获取未经转换的原始价格文本
        const originalPrice = node.nodeValue.replace(/\(¥[\d,]+\.?\d*\)/g, '').trim();
        const priceKey = `${originalPrice}_${parent.innerHTML.length}`;

        // 如果该元素的该价格已被处理则跳过
        if (priceRegistry.get(parent) === priceKey) return;

        const newValue = convertPriceText(node.nodeValue, node.nodeValue);
        if (newValue !== node.nodeValue) {
            node.nodeValue = newValue;
            priceRegistry.set(parent, priceKey);
        }
    }

    function setupObserver() {
        const observer = new MutationObserver(_.debounce((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            scanElement(node);
                        } else if (node.nodeType === Node.TEXT_NODE) {
                            processNode(node);
                        }
                    });
                }

                // 处理现有元素中的价格更新
                if (mutation.type === 'characterData') {
                    processNode(mutation.target);
                }
            });
        }, 100));

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: false
        });

        return observer;
    }

    function scanElement(element) {
        // 跳过不可能包含价格的特定元素类型
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return;

        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            processNode(node);
        }
    }

    // 定期验证现有转换
    function setupVerification() {
        setInterval(() => {
            priceRegistry.forEach((priceKey, element) => {
                if (!document.body.contains(element)) {
                    priceRegistry.delete(element);
                    return;
                }

                // 查找此元素中的文本节点
                const walker = document.createTreeWalker(
                    element,
                    NodeFilter.SHOW_TEXT,
                    null,
                    false
                );

                let found = false;
                let node;
                while (node = walker.nextNode()) {
                    if (node.nodeValue && node.nodeValue.includes('(¥')) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    priceRegistry.delete(element);
                    scanElement(element); // 如果转换丢失则重新处理
                }
            });
        }, config.verifyInterval);
    }

    async function init() {
        await initExchangeRate();
        const observer = setupObserver();
        setupVerification();

        // 初始分块扫描以提高性能
        const chunks = Array.from(document.body.children);
        chunks.forEach(chunk => {
            requestIdleCallback(() => scanElement(chunk));
        });

        // 滚动时进行扫描
        window.addEventListener('scroll', _.throttle(() => {
            document.querySelectorAll('*').forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 2 && rect.bottom > -window.innerHeight) {
                    scanElement(el);
                }
            });
        }, 500));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();