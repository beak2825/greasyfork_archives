// ==UserScript==
// @name         Auto click Claim Button
// @namespace    AutoClickClaimButton
// @version      1.4
// @description  自動點擊所有帶有 "Claim" 字眼的按鈕，直到按鈕可用為止，並等待 CAPTCHA 解決。
// @author       Yueei
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518331/Auto%20click%20Claim%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/518331/Auto%20click%20Claim%20Button.meta.js
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

    // 自動點擊 Claim 按鈕的函數
    function clickClaimButton() {
        console.log('檢測並嘗試點擊 Claim 按鈕...');
        const buttons = Array.from(document.querySelectorAll("button, a"));
        const claimButton = buttons.find(btn => {
            const text = btn.textContent.trim().toLowerCase();
            return (
                text.includes('claim') && // 包含 "claim"
                !btn.disabled // 按鈕未禁用
            );
        });

        if (claimButton) {
            claimButton.click();
            console.log(`已成功點擊 Claim 按鈕: ${claimButton.textContent.trim()}`);
        } else {
            console.log('尚未找到可用的 Claim 按鈕，等待...');
        }
    }

    // 主函數，定期執行檢查
    function startProcess() {
        console.log('自動點擊腳本已啟動，正在監控 Claim 按鈕...');
        setInterval(() => {
            if (!checkCaptcha()) { // 如果沒有 CAPTCHA，嘗試點擊 Claim 按鈕
                clickClaimButton();
            } else {
                console.log('檢測到 CAPTCHA，等待解決...');
            }
        }, 10000); // 每 10 秒執行一次檢查
    }

    // 啟動腳本
    startProcess();
})();