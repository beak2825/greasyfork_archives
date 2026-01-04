// ==UserScript==
// @name         繞過付費檢查 (Bypass Paywall)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  強制將 isForSale 設為 false，繞過付費牆
// @author       Your Name
// @match        *://www.jvid.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530489/%E7%B9%9E%E9%81%8E%E4%BB%98%E8%B2%BB%E6%AA%A2%E6%9F%A5%20%28Bypass%20Paywall%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530489/%E7%B9%9E%E9%81%8E%E4%BB%98%E8%B2%BB%E6%AA%A2%E6%9F%A5%20%28Bypass%20Paywall%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("[Violentmonkey] 正在繞過付費檢查...");

    // 監聽網頁變化，強制設置 isForSale = false
    const observer = new MutationObserver(() => {
        try {
            // 如果 isForSale 存在，將其強制設為 false
            if (window.isForSale !== undefined) {
                window.isForSale = false;
                console.log("[🎉] 成功繞過付費檢查！");
            }

            // 如果變量在其他對象中 (例如 window.config)
            if (window.config && window.config.isForSale) {
                window.config.isForSale = false;
                console.log("[🔓] isForSale 已解鎖！");
            }

        } catch (e) {
            console.error("[❌] 修改失敗:", e);
        }
    });

    // 啟動監聽
    observer.observe(document, {
        childList: true,
        subtree: true
    });

})();
