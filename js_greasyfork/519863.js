// ==UserScript==
// @name         Auto click Login and Verify Button
// @namespace    AutoClickLoginAndVerify
// @version      1.2
// @description  自動點擊 Login 和 Verify 按鈕，直到按鈕可用為止，並等待 CAPTCHA 解決。
// @author       Yueei
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519863/Auto%20click%20Login%20and%20Verify%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/519863/Auto%20click%20Login%20and%20Verify%20Button.meta.js
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
            "[data-sitekey]",
            "[data-sitekey='6LcdII8qAAAAAIxzAG5sJY4Vwh9O61qCCVhkUWhx']" // 特定網站的 CAPTCHA
        ];

        const captchaElements = captchaSelectors.some(selector => document.querySelector(selector));

        if (captchaElements) {
            console.log('檢測到 CAPTCHA，等待解決...');
            return true; // 若發現 CAPTCHA，返回 true 表示有 CAPTCHA
        }

        return false; // 若無 CAPTCHA，返回 false 允許繼續執行按鈕點擊
    }

    // 自動點擊指定按鈕的函數
    function clickButton(buttonText) {
        const buttons = Array.from(document.querySelectorAll("button, a"));
        const targetButton = buttons.find(btn =>
            btn.textContent.trim().toLowerCase().includes(buttonText.toLowerCase()) &&
            !btn.disabled
        );

        if (targetButton) {
            targetButton.click();
            console.log(`已成功點擊按鈕: ${targetButton.textContent.trim()}`);
        } else {
            console.log(`尚未找到包含 "${buttonText}" 的可用按鈕，等待...`);
        }
    }

    // 處理 Login 按鈕
    function handleLogin() {
        console.log('檢測並嘗試點擊 Login 按鈕...');
        clickButton('login'); // 點擊包含 "login" 的按鈕
    }

    // 處理 Verify 按鈕
    function handleVerify() {
        console.log('檢測並嘗試點擊 Verify 按鈕...');
        const buttons = Array.from(document.querySelectorAll("button, a"));
        const verifyButton = buttons.find(btn => {
            const text = btn.textContent.trim().toLowerCase();
            return (
                text.includes('verify') && // 包含 "verify"
                !btn.disabled && // 按鈕未禁用
                (
                    text === 'verify' || // 只有 "verify"
                    text.includes('verify ') || // "verify " 後有額外字元
                    text.includes(' verify') // 前面有額外字元
                )
            );
        });

        if (verifyButton) {
            verifyButton.click();
            console.log(`已成功點擊 Verify 按鈕: ${verifyButton.textContent.trim()}`);
        } else {
            console.log('尚未找到可用的 Verify 按鈕，等待...');
        }
    }

    // 主函數，定期執行檢查
    function startProcess() {
        console.log('自動點擊腳本已啟動，正在監控 Login 和 Verify 按鈕...');
        setInterval(() => {
            handleLogin(); // 優先處理 Login 按鈕
            if (!checkCaptcha()) { // 若未檢測到 CAPTCHA，處理 Verify 按鈕
                handleVerify();
            }
        }, 10000); // 每 10 秒執行一次檢查
    }

    // 啟動腳本
    startProcess();
})();
