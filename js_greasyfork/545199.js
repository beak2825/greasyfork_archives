// ==UserScript==
// @name         YouTube to Yout-ube Redirector (Ultimate Stable Version)
// @name:zh-TW   YouTube 影片自動跳轉 Yout-ube (終極穩定版)
// @name:zh-CN   YouTube 影片自动跳转 Yout-ube (终极稳定版)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  The most reliable way to redirect YouTube video pages to yout-ube.com, works with all site navigation.
// @description:zh-TW  最可靠的 YouTube 影片頁面跳轉腳本，使用 MutationObserver 完美支援所有站內導航，享受無廣告體驗。
// @description:zh-CN  最可靠的 YouTube 影片页面跳转脚本，使用 MutationObserver 完美支援所有站内导航，享受无广告体验。
// @author       Mark
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545199/YouTube%20to%20Yout-ube%20Redirector%20%28Ultimate%20Stable%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545199/YouTube%20to%20Yout-ube%20Redirector%20%28Ultimate%20Stable%20Version%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 儲存上一次檢查的網址，避免重複執行
    let lastUrl = location.href;

    // 核心跳轉函數
    const attemptRedirect = () => {
        const currentUrl = location.href;
        // 檢查是否是影片頁面 (包含 /watch) 且不是我們要跳轉的目標域名
        if (currentUrl.includes('/watch') && !currentUrl.includes('yout-ube.com')) {
            location.href = currentUrl.replace('youtube.com', 'yout-ube.com');
        }
    };

    // 創建一個觀察者來監測 DOM 變化
    // 我們監聽 <title> 標籤的變化，因為每次影片切換時，標題都會改變
    const observer = new MutationObserver(() => {
        // 如果網址發生了變化，就執行檢查
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            attemptRedirect();
        }
    });

    // 啟動觀察者
    observer.observe(document.querySelector('title'), {
        childList: true,
        subtree: true
    });

    // 為了應對頁面首次加載，也立即執行一次檢查
    attemptRedirect();
})();
