// ==UserScript==
// @name         【手动】Steam市场外国货币换成人民币
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  STEAM外区账号在市场上显示的价格换算成人民币
// @author       VMOD and SandWind
// @match        https://steamcommunity.com/market/listings/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463910/%E3%80%90%E6%89%8B%E5%8A%A8%E3%80%91Steam%E5%B8%82%E5%9C%BA%E5%A4%96%E5%9B%BD%E8%B4%A7%E5%B8%81%E6%8D%A2%E6%88%90%E4%BA%BA%E6%B0%91%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/463910/%E3%80%90%E6%89%8B%E5%8A%A8%E3%80%91Steam%E5%B8%82%E5%9C%BA%E5%A4%96%E5%9B%BD%E8%B4%A7%E5%B8%81%E6%8D%A2%E6%88%90%E4%BA%BA%E6%B0%91%E5%B8%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const conversionRate = 66.35;//一块钱人民币能换多少外币

    function extractPriceFromText(priceText) {
        const cleanedPrice = priceText.replace(/[^\d,.]/g, '');
        return parseFloat(cleanedPrice.replace(/,/g, '.'));
    }

    function convertPrice(price) {
        return (price / conversionRate).toFixed(2);
    }

    function formatPriceWithRMB(priceInYB) {
        return `(${priceInYB} 人民币)`;
    }

    function addYBPrices() {
        const priceElements = document.querySelectorAll('span.market_listing_price market_listing_price_with_fee, span.market_listing_price.market_listing_price_without_fee, td.market_commodity_orders_table > td:nth-child(1)');

        for (const priceElement of priceElements) {
            if (!priceElement.dataset.converted) {
                const priceText = priceElement.innerText.trim();
                const priceInRMB = extractPriceFromText(priceText);
                const priceInYB = convertPrice(priceInRMB);
                const YBPriceText = formatPriceWithRMB(priceInYB);

                const YBPriceElement = document.createElement('div');
                YBPriceElement.style.display = 'block';
                YBPriceElement.style.fontSize = 'small';
                YBPriceElement.innerText = YBPriceText;

                priceElement.parentElement.insertBefore(YBPriceElement, priceElement.nextSibling);
                priceElement.dataset.converted = 'true';
            }
        }

        const buyRequestPriceElement = document.querySelector('#market_commodity_buyrequests > span.market_commodity_orders_header_promote:last-child');

        if (buyRequestPriceElement && !buyRequestPriceElement.dataset.converted) {
            const priceText = buyRequestPriceElement.innerText.trim();
            const priceInRMB = extractPriceFromText(priceText);
            const priceInYB = convertPrice(priceInRMB);
            const YBPriceText = formatPriceWithRMB(priceInYB);

            buyRequestPriceElement.innerText = `${priceText} ${YBPriceText}`;
            buyRequestPriceElement.dataset.converted = 'true';
        }
    }

    setInterval(addYBPrices, 1000);

})();
