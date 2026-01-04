// ==UserScript==
// @name         Refresh Captcha
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自動刷新驗證碼
// @author       scott
// @match        *://tixcraft.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513731/Refresh%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/513731/Refresh%20Captcha.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 攔截原生 alert
    window.alert = (message) => {
        console.warn("攔截到 alert:", message);
    };

    // 攔截原生 confirm
    window.confirm = () => {
        console.warn("攔截到 confirm: 返回 true");
        return true; // 自動回應確認視窗為 "確定"
    };

    // 攔截原生 prompt
    window.prompt = (message, defaultResponse) => {
        console.warn("攔截到 prompt:", message, "預設值:", defaultResponse);
        return null; // 返回 null，不顯示提示框
    };

    // Optional: 監控 DOM 變化以攔截模態框
    const observer = new MutationObserver(() => {
        const popups = document.querySelectorAll('.modal, .popup, .alert, .dialog');
        popups.forEach(popup => {
            console.log("找到彈窗，正在關閉...");
            popup.remove(); // 移除彈窗
        });
    });

    // 開始觀察整個文檔
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();