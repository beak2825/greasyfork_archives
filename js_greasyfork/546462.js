// ==UserScript==
// @name         BTC.ETH.LTC.SOL.DOGE Auto Roll After Countdown
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  After the countdown ends, the Roll button is automatically pressed
// @match        https://www.free-bitcoin.io/free/*
// @match        https://www.free-ethereum.io/free/*
// @match        https://www.free-litecoin.com/*
// @match        https://free-solana.com/free/*
// @match        https://www.free-doge.io/free/*
// @author       ALEN
// @icon         https://i.imgur.com/tnqS60o.jpeg
// @downloadURL https://update.greasyfork.org/scripts/546462/BTCETHLTCSOLDOGE%20Auto%20Roll%20After%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/546462/BTCETHLTCSOLDOGE%20Auto%20Roll%20After%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndClick() {
        const min = parseInt(document.getElementById('cislo1')?.innerText || "0");
        const sec = parseInt(document.getElementById('cislo2')?.innerText || "0");
        const captchaValue = document.getElementById('captchainput')?.value.trim();
        const btn = document.querySelector('button[onclick="roll()"]');

        // 當倒數為 0 且驗證碼有輸入
        if (min === 0 && sec === 0 && captchaValue && btn) {
            console.log("倒數結束，驗證碼已輸入 → 自動點擊");
            btn.click();
        }
    }

    // 每秒檢查一次
    setInterval(checkAndClick, 3000);
})();
