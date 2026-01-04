// ==UserScript==
// @name         Auto Select and Claim
// @namespace    http://tampermonkey.net
// @version      0.1
// @description  Automatically select checkbox and click claim button
// @match      https://fluently.moravia.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483942/Auto%20Select%20and%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/483942/Auto%20Select%20and%20Claim.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const intervalTime = 2000; // 设置时间间隔为2秒
    let claimCount = 0; // 初始化"Claim"点击计数器

    setInterval(() => {
        const timeStamp = new Date().toLocaleString(); // 获取当前时间戳

        // 查找并勾选复选框
        const checkbox = document.querySelector('input.PrivateSwitchBase-input.css-1m9pwf3#jobs-auction-select-all[type="checkbox"]');
        if (checkbox && !checkbox.checked) {
            checkbox.click();
        }

        // 查找并点击"Claim"按钮
        const claimButton = document.querySelector('button#jobs-auction-claim-button:not([disabled])');
        if (claimButton) {
            claimButton.click();
            claimCount++; // 点击计数器加1
            console.log(`[${timeStamp}] Claimed ${claimCount} times.`);
        }
    }, intervalTime);
})();
