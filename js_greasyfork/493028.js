// ==UserScript==
// @name         显示BTC、ETH和ADA实时价格
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页顶部中心显示BTC、ETH和ADA的实时价格
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493028/%E6%98%BE%E7%A4%BABTC%E3%80%81ETH%E5%92%8CADA%E5%AE%9E%E6%97%B6%E4%BB%B7%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/493028/%E6%98%BE%E7%A4%BABTC%E3%80%81ETH%E5%92%8CADA%E5%AE%9E%E6%97%B6%E4%BB%B7%E6%A0%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个div元素来显示价格
    var priceDiv = document.createElement('div');
    priceDiv.style.position = 'fixed';
    priceDiv.style.top = '0';
    priceDiv.style.left = '50%';
    priceDiv.style.transform = 'translateX(-50%)';
    priceDiv.style.backgroundColor = 'transparent';
    priceDiv.style.color = '#000000';
    priceDiv.style.zIndex = '999999';
    priceDiv.style.display = 'inline-block'; // 使用inline-block布局
    priceDiv.style.padding = '0'; // 去除内边距
    document.body.appendChild(priceDiv);

    // 每隔5秒更新价格
    setInterval(updatePrices, 5000);

    function updatePrices() {
        // 从OKX API获取BTC、ETH和ADA价格
        Promise.all([
            fetch('https://www.okx.com/api/v5/market/ticker?instId=BTC-USDT').then(response => response.json()),
            fetch('https://www.okx.com/api/v5/market/ticker?instId=ETH-USDT').then(response => response.json()),
            fetch('https://www.okx.com/api/v5/market/ticker?instId=ADA-USDT').then(response => response.json())
        ])
            .then(([btcData, ethData, adaData]) => {
                var btcPrice = btcData.data[0].last;
                var ethPrice = ethData.data[0].last;
                var adaPrice = adaData.data[0].last;
                priceDiv.innerHTML = `<span style="margin-right: 10px;">$${btcPrice}</span><span style="margin-right: 10px;">$${ethPrice}</span><span>$${adaPrice}</span>`;
            })
            .catch(error => console.error(error));
    }
})();