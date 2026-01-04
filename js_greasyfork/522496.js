// ==UserScript==
// @name         earncryptowrs.in Auto click Claim Button
// @namespace    earncryptowrs.in
// @version      1.0
// @description  自動點擊所有帶有 "Claim Now" 字眼的按鈕，直到按鈕可用為止，並等待 CAPTCHA 解決。
// @author       Yueei
// @match        https://earncryptowrs.in/faucet/currency/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earncryptowrs.in
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522496/earncryptowrsin%20Auto%20click%20Claim%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/522496/earncryptowrsin%20Auto%20click%20Claim%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 檢查 CAPTCHA 是否存在
    function checkCaptcha() {
        const captchaSelectors = [
            "iframe[src*='recaptcha']",
            ".g-recaptcha",
            ".h-captcha",
            ".turnstile",
            "[data-sitekey]"
        ];

        return captchaSelectors.some(selector => document.querySelector(selector));
    }

    // 自動點擊 Claim Now 按鈕的函數
    function clickClaimNowButton() {
        console.log('檢測並嘗試點擊 Claim Now 按鈕...');
        
        const claimNowButton = document.querySelector('#subbutt'); // 根據 ID 尋找按鈕

        if (claimNowButton && !claimNowButton.disabled) { // 檢查按鈕是否存在且未禁用
            claimNowButton.click();
            console.log(`已成功點擊 Claim Now 按鈕: ${claimNowButton.textContent.trim()}`);
        } else {
            console.log('尚未找到可用的 Claim Now 按鈕，等待...');
        }
    }

    // 主函數，定期執行檢查
    function startProcess() {
        console.log('自動點擊腳本已啟動，正在監控 Claim Now 按鈕...');
        setInterval(() => {
            if (!checkCaptcha()) { // 如果沒有 CAPTCHA，嘗試點擊 Claim Now 按鈕
                clickClaimNowButton();
            } else {
                console.log('檢測到 CAPTCHA，等待解決...');
            }
        }, 10000); // 每 10 秒執行一次檢查
    }

    // 啟動腳本
    startProcess();
})();