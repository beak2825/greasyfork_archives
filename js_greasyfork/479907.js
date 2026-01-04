// ==UserScript==
// @name         Shopee轉盤
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  自動執行分享操作並重新整理網頁
// @author       You
// @match        https://games.shopee.tw/sellerlck/event/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479907/Shopee%E8%BD%89%E7%9B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/479907/Shopee%E8%BD%89%E7%9B%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義等待函數，以等待一定的時間
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 主函數，執行自動分享操作並重新整理網頁
    async function autoShareAndRefresh() {
        // 等待1秒鐘
        await sleep(1000);

        // 點擊第一個按鈕
        const firstButton = document.querySelector('button.style__Button-sc-1is5xc9-5.gLLcxL');
        firstButton.click();

        // 等待1秒鐘
        await sleep(1000);

        // 點擊第二個按鈕
        const secondButton = document.querySelector('button.style__buttonShare-bs7ixc-4.jZJPdw');
        secondButton.click();

        // 等待1秒鐘
        await sleep(1000);

        // 點擊第三個按鈕
        const thirdButton = document.querySelector('a.style__aChannelBtn-sc-1j8xx83-12.ecoaAU');
        //        const thirdButton = document.querySelector('a.style__aChannelBtn-sc-1j8xx83-12.kfGZLE');
        thirdButton.click();

        // 等待1秒鐘
        await sleep(1000);

        // 重新整理網頁
        location.reload();
    }

    // 呼叫主函數以執行自動分享和重新整理
    autoShareAndRefresh();
})();
