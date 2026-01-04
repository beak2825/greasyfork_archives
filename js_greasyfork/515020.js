// ==UserScript==
// @name         steam网站工具
// @namespace    https://greasyfork.org/users/1362311
// @version      0.0.1
// @description  steam相关脚本
// @author       honguangli
// @license      MIT
// @match        https://steamcommunity.com/market/
// @icon         https://steamcommunity.com/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/515020/steam%E7%BD%91%E7%AB%99%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/515020/steam%E7%BD%91%E7%AB%99%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册菜单
    const registerMenuCommand = () => {
        // 计算已上架饰品售出总值
        GM_registerMenuCommand('计算已上架饰品售出总值', () => {
            const price = getTotalPrices();
            alert('饰品售出总值：' + price);
        });
    };

    // 计算已上架饰品售出总值
    const getTotalPrices = () => {
        const array = document.querySelectorAll('.market_listing_price span span:nth-child(3)');
        let totalPrice = 0;
        for (let i = 0; i < array.length; i++) {
            totalPrice += Math.ceil(parseFloat(array[i].innerText.replace(/[\(¥ )]/g, '')) * 100);
        }
        return totalPrice/100;
    };

    registerMenuCommand();
})();