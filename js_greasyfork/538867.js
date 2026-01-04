// ==UserScript==
// @name         Aimeimei 解鎖播放限制 v2
// @namespace    http://tampermonkey.net/
// @version      2025-08-04
// @description  自動移除 aimeimei520.com 的廣告，只有偵測到廣告時才靜音一次影片。
// @author       You
// @match        https://aimeimei520.com/*
// @match        https://*.aimeimei520.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538867/Aimeimei%20%E8%A7%A3%E9%8E%96%E6%92%AD%E6%94%BE%E9%99%90%E5%88%B6%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/538867/Aimeimei%20%E8%A7%A3%E9%8E%96%E6%92%AD%E6%94%BE%E9%99%90%E5%88%B6%20v2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let mutedOnce = false;

    const handleAd = () => {
        const ads = document.querySelectorAll('.xgplayer-ad-overlay');
        if (ads.length > 0) {
            // 移除廣告
            ads.forEach(ad => {
                ad.remove();
                console.log('🧹 已移除廣告覆蓋層');
            });

            // 僅當有廣告出現時才靜音一次
            if (!mutedOnce) {
                const vid = document.querySelector('video');
                if (vid && !vid.muted) {
                    vid.muted = true;
                    mutedOnce = true;
                    console.log('🔇 偵測到廣告，影片已靜音一次');
                }
            }
        }
    };

    const observer = new MutationObserver(() => {
        handleAd();
    });

    const startObserver = () => {
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('👁️ 廣告監控已啟動');
    };

    window.addEventListener('load', () => {
        setTimeout(startObserver, 300); // 給頁面一點時間加載
    });
})();
