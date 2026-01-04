// ==UserScript==
// @name         Goopi Auto Checkout
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 https://www.goopi.co/ 自動點擊購物車和立即購買，然後跳轉到結帳頁面
// @author       You
// @match        https://www.goopi.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481551/Goopi%20Auto%20Checkout.user.js
// @updateURL https://update.greasyfork.org/scripts/481551/Goopi%20Auto%20Checkout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延遲函數，用於等待元素加載
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 在這裡插入你的自動點擊邏輯
    async function autoCheckout() {
        // 等待購物車按鈕出現
        await sleep(100); // 等待2秒，你可以根據需要調整等待時間
        var addToCartButton = document.querySelector('.btn-add-to-cart.js-btn-add-to-cart.hidden-xs.hidden-sm');

        if (addToCartButton) {
            addToCartButton.click(); // 觸發點擊事件

            // 等待立即購買按鈕出現
            await sleep(750); // 等待2秒，你可以根據需要調整等待時間
            var buyNowButton = document.querySelector('.buy-now-text.ng-binding');

            if (buyNowButton) {
                buyNowButton.click(); // 觸發點擊事件

                // 在此添加任何進一步的操作，例如跳轉到結帳頁面
                // 這裡假設直接跳轉到 https://www.goopi.co/checkout
                await sleep(1000); // 等待2秒，你可以根據需要調整等待時間
                window.location.href = 'https://www.goopi.co/checkout';
            }
        }
    }

    // 啟動自動點擊
    autoCheckout();
})();