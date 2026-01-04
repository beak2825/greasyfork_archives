// ==UserScript==
// @name         淘寶人民幣轉新台幣(僅供參考)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Convert RMB to NTD on Taobao and Tmall with real-time exchange rate
// @author       Grok
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @exclude     https://buy.taobao.com/auction/order/confirm_order.htm
// @grant        GM_xmlhttpRequest
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531693/%E6%B7%98%E5%AF%B6%E4%BA%BA%E6%B0%91%E5%B9%A3%E8%BD%89%E6%96%B0%E5%8F%B0%E5%B9%A3%28%E5%83%85%E4%BE%9B%E5%8F%83%E8%80%83%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531693/%E6%B7%98%E5%AF%B6%E4%BA%BA%E6%B0%91%E5%B9%A3%E8%BD%89%E6%96%B0%E5%8F%B0%E5%B9%A3%28%E5%83%85%E4%BE%9B%E5%8F%83%E8%80%83%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const DEFAULT_RATE = 4.5;
    let exchangeRate = DEFAULT_RATE;
    const selectors = {
        rightItem: {
            unit: '[class*="right-item-label"]',
            value: '.right-item-amount'
        },
        priceWrapper: {
            unit: '[class*="price-unit"]',
            value: '.price-value'
        },
        genericWrapper: {
            unit: '[class*="unit--"]',
            wrapper: '[class*="innerPriceWrapper--"]',
            value: '[class*="priceInt--"]'
        },
        highlightPrice: {
            container: '[class*="--highlightPrice--"]',
            unit: '[class*="--symbol--"]',
            value: '[class*="--text--"'
        },
        businessEntry: {
            unit: '.business-entry-item-card-content-coin-title',
            value: '.business-entry-item-card-content-coin-title + span'
        },
        tradePrice: {
            container: '.trade-price-container',
            unit: '.trade-price-symbol',
            integer: '.trade-price-integer',
            point: '.trade-price-point',
            decimal: '.trade-price-decimal'
        },
        priceWrap: {
            container: '[class*="priceWrap--"]',
            unit: '[class*="symbol--"]',
            wrapper: '[class*="price--"]'
        }
    };

    // Utility functions
    const log = (...args) => console.log('[RMB-NTD]', ...args);
    const fetchExchangeRate = () => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.exchangerate-api.com/v4/latest/CNY',
            onload: res => resolve(JSON.parse(res.responseText).rates.TWD),
            onerror: reject
        });
    });

    const convertPrice = (rmb) => {
        return Math.round(rmb * exchangeRate * 100) / 100;
    };

    const processPriceElement = (unitEl, valueEl, context) => {
        if (!valueEl || (unitEl.textContent !== '¥' && unitEl.textContent !== '￥')) return false;

        const priceText = valueEl.textContent.trim();
        const priceMatch = priceText.match(/^(\d+(\.\d+)?)$/);
        if (!priceMatch) return false;

        const rmb = parseFloat(priceMatch[1]);
        const ntd = convertPrice(rmb);

        unitEl.textContent = '$';
        valueEl.textContent = ntd;
        valueEl.dataset.originalRmb = rmb;
        valueEl.dataset.convertedNtd = ntd;
        logcki(`Converted ¥${rmb} to $${ntd} in ${context}`);
        return true;
    };

    const processTradePriceElement = (container) => {
        const unit = container.querySelector(selectors.tradePrice.unit);
        const integer = container.querySelector(selectors.tradePrice.integer);
        const point = container.querySelector(selectors.tradePrice.point);
        const decimal = container.querySelector(selectors.tradePrice.decimal);

        if (!unit || (unit.textContent !== '￥' && unit.textContent !== '¥') || !integer) return false;

        let priceStr = integer.textContent;
        if (decimal && point) {
            priceStr += `${point.textContent}${decimal.textContent}`;
        }

        const rmb = parseFloat(priceStr);
        if (isNaN(rmb)) return false;

        const ntd = convertPrice(rmb);
        const [newInteger, newDecimal] = ntd.toString().split('.');

        unit.textContent = '$';
        integer.textContent = newInteger;
        integer.dataset.originalRmb = rmb;
        integer.dataset.convertedNtd = ntd;
        if (decimal && point) {
            point.textContent = '.';
            decimal.textContent = newDecimal || '00';
            decimal.dataset.originalRmb = rmb;
            decimal.dataset.convertedNtd = ntd;
        }

        log(`Converted ¥${rmb} to $${ntd} in trade-price`);
        return true;
    };

    const updateTradePriceElement = (container) => {
        const unit = container.querySelector(selectors.tradePrice.unit);
        const integer = container.querySelector(selectors.tradePrice.integer);
        const point = container.querySelector(selectors.tradePrice.point);
        const decimal = container.querySelector(selectors.tradePrice.decimal);

        if (!unit || !integer) return false;

        let currentPriceStr = integer.textContent;
        if (decimal && point) {
            currentPriceStr += `.${decimal.textContent}`;
        }

        const currentNum = parseFloat(currentPriceStr);
        if (isNaN(currentNum)) return false;

        if (integer.dataset.convertedNtd) {
            const expectedNtd = parseFloat(integer.dataset.convertedNtd);
            if (Math.abs(currentNum - expectedNtd) < 0.01) return false;
        }

        const rmb = currentNum;
        const ntd = convertPrice(rmb);
        const [newInteger, newDecimal] = ntd.toString().split('.');

        unit.textContent = '$';
        integer.textContent = newInteger;
        integer.dataset.originalRmb = rmb;
        integer.dataset.convertedNtd = ntd;
        if (decimal && point) {
            point.textContent = '.';
            decimal.textContent = newDecimal || '00';
            decimal.dataset.originalRmb = rmb;
            decimal.dataset.convertedNtd = ntd;
        }

        log(`Updated ¥${rmb} to $${ntd} in trade-price`);
        return true;
    };

    const setupTradePriceObserver = () => {
        const tradeContainers = document.querySelectorAll(selectors.tradePrice.container);
        tradeContainers.forEach(container => {
            const unit = container.querySelector(selectors.tradePrice.unit);
            const integer = container.querySelector(selectors.tradePrice.integer);
            const decimal = container.querySelector(selectors.tradePrice.decimal);

            const observerConfig = {
                childList: true,
                characterData: true,
                subtree: true
            };

            const handleChange = () => {
                if (!integer) return;

                if (unit.textContent === '￥' || unit.textContent === '¥') {
                    processTradePriceElement(container);
                } else {
                    updateTradePriceElement(container);
                }
            };

            if (integer) {
                new MutationObserver(handleChange).observe(integer, observerConfig);
            }
            if (decimal) {
                new MutationObserver(handleChange).observe(decimal, observerConfig);
            }
            if (unit) {
                new MutationObserver(handleChange).observe(unit, observerConfig);
            }
        });
    };

    const convertPrices = () => {
        let convertedCount = 0;

        document.querySelectorAll(selectors.rightItem.unit).forEach(unit => {
            if (processPriceElement(unit, unit.nextElementSibling, 'right-item')) {
                convertedCount++;
            }
        });

        document.querySelectorAll(selectors.priceWrapper.unit).forEach(unit => {
            if (processPriceElement(unit, unit.nextElementSibling, 'price-wrapper')) {
                convertedCount++;
            }
        });

        document.querySelectorAll(selectors.genericWrapper.unit).forEach(unit => {
            const wrapper = unit.nextElementSibling;
            if (wrapper?.matches(selectors.genericWrapper.wrapper)) {
                const value = wrapper.querySelector(selectors.genericWrapper.value);
                if (processPriceElement(unit, value, 'generic-wrapper')) {
                    convertedCount++;
                }
            }
        });

        document.querySelectorAll(selectors.highlightPrice.container).forEach(container => {
            const unit = container.querySelector(selectors.highlightPrice.unit);
            const value = container.querySelector(selectors.highlightPrice.value);
            if (processPriceElement(unit, value, 'highlight-price')) {
                convertedCount++;
            }
        });

        document.querySelectorAll(selectors.businessEntry.unit).forEach(unit => {
            const value = unit.nextElementSibling;
            if (processPriceElement(unit, value, 'business-entry')) {
                convertedCount++;
            }
        });

        document.querySelectorAll(selectors.tradePrice.container).forEach(container => {
            if (processTradePriceElement(container)) {
                convertedCount++;
            }
        });

        document.querySelectorAll(selectors.priceWrap.container).forEach(container => {
            const wrapper = container.querySelector(selectors.priceWrap.wrapper);
            const unit = wrapper?.querySelector(selectors.priceWrap.unit);
            if (unit && (unit.textContent === '¥' || unit.textContent === '￥')) {
                const priceTextNode = wrapper?.childNodes[1];
                if (priceTextNode?.nodeType === Node.TEXT_NODE) {
                    const priceText = priceTextNode.textContent.trim();
                    const priceMatch = priceText.match(/^(\d+(\.\d+)?)$/);
                    if (priceMatch) {
                        const rmb = parseFloat(priceMatch[1]);
                        const ntd = convertPrice(rmb);
                        
                        unit.textContent = '$';
                        priceTextNode.textContent = ntd;
                        wrapper.dataset.originalRmb = rmb;
                        wrapper.dataset.convertedNtd = ntd;
                        log(`Converted ¥${rmb} to $${ntd} in price-wrap`);
                        convertedCount++;
                    }
                }
            }
        });

        log(`Converted ${convertedCount} prices`);
        return convertedCount;
    };

    try {
        exchangeRate = await fetchExchangeRate();
        log('Exchange rate:', exchangeRate);
    } catch (error) {
        log('Using default rate:', exchangeRate, error);
    }

    convertPrices();
    setupTradePriceObserver();

    let timeoutId;
    const debouncedConvert = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            log('Updating prices...');
            convertPrices();
            setupTradePriceObserver();
        }, 500);
    };

    new MutationObserver(debouncedConvert).observe(document.body, {
        childList: true,
        subtree: true
    });

    setInterval(debouncedConvert, 2000);
})();