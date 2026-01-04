// ==UserScript==
// @name         Faucet Auto Refresh & Claim After Verify
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  完成驗證後自動點擊 Claim，並每5分鐘自動刷新頁面
// @author       Alen Lee
// @match        https://freexrp.in/*
// @match        https://usdpick.io/*
// @match        https://FreeTRON.in/*
// @match        https://FreeShib.in/*
// @match        https://FreeBNB.in/*
// @match        https://FreeTonCoin.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536035/Faucet%20Auto%20Refresh%20%20Claim%20After%20Verify.user.js
// @updateURL https://update.greasyfork.org/scripts/536035/Faucet%20Auto%20Refresh%20%20Claim%20After%20Verify.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 每2秒檢查一次是否可以點擊 Claim
    const claimInterval = setInterval(() => {
        const claimButton = document.querySelector('#claimButton, .btn-primary, .btn-success');
        if (claimButton && !claimButton.disabled && claimButton.offsetParent !== null) {
            claimButton.click();
            clearInterval(claimInterval);
        }
    }, 2000);

    // 每5分鐘刷新當前頁面
    setTimeout(() => {
        window.location.reload();
    }, 10 * 60 * 1000); // 5分鐘 = 300,000 毫秒
})();
