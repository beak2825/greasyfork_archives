// ==UserScript==
// @name         D11125127
// @namespace    http://tampermonkey.net/
// @version      4.0.0
// @description  完整解鎖考試限制，防止跳出視窗，允許正常答題。
// @author       YourName
// @match        https://ecampus.takming.edu.tw/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521467/D11125127.user.js
// @updateURL https://update.greasyfork.org/scripts/521467/D11125127.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("最終修正版解鎖腳本啟動...");

    // 禁止 alert, confirm, prompt
    const disableAlerts = () => {
        window.alert = () => {};
        window.confirm = () => true;
        window.prompt = () => '';
        console.log("已禁用 alert, confirm, prompt！");
    };

    // 覆寫窗口事件
    const overrideWindowEvents = () => {
        window.onbeforeunload = null;
        document.onvisibilitychange = null;
        window.onblur = null;
        window.onfocus = null;

        const events = ['beforeunload', 'visibilitychange', 'blur', 'focus'];
        events.forEach(event => {
            window.addEventListener(event, e => e.stopImmediatePropagation(), true);
        });

        console.log("已覆寫窗口事件！");
    };

    // 攔截核心請求並確保正常運作
    const interceptRequests = () => {
        const originalXHROpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (method, url, ...args) {
            if (url.includes('item_fetch.php')) {
                console.log("攔截並監控核心請求:", url);
                this.addEventListener('readystatechange', function () {
                    if (this.readyState === 4) {
                        console.log("核心請求完成:", this.responseText);
                    }
                });
            }
            return originalXHROpen.apply(this, [method, url, ...args]);
        };

        console.log("核心請求攔截完成！");
    };

    // 初始化
    const init = () => {
        disableAlerts();
        overrideWindowEvents();
        interceptRequests();
        console.log("所有功能已啟用，頁面限制已解除！");
    };

    // 等待 DOM 加載完成後執行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
