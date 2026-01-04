// ==UserScript==
// @name         YouTube 加速腳本
// @namespace    https://tampermonkey.net/
// @version      2.0
// @description  高效攔截廣告、優化加載速度、屏蔽推薦視頻，並提供自定義功能
// @author       Weiren
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522653/YouTube%20%E5%8A%A0%E9%80%9F%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/522653/YouTube%20%E5%8A%A0%E9%80%9F%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("YouTube 廣告加速與加載優化腳本啟動！");

    // 可配置選項
    const CONFIG = {
        blockAds: true,
        skipPreRollAds: false,
        accelerateAds: true,
        disableTransitions: true,
        prefetchResources: true,
    };

    // 攔截廣告域名
    const adDomains = [
        "*://*.doubleclick.net/*",
        "*://*.googleadservices.com/*",
        "*://*.googlesyndication.com/*",
        "*://*.youtube.com/api/stats/*",
        "*://*.youtube.com/ptracking",
    ];

    if (CONFIG.blockAds) {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (method, url) {
            if (adDomains.some(blockedUrl => url.includes(blockedUrl))) {
                console.log(`攔截請求：${url}`);
                return; // 阻止請求
            }
            originalOpen.apply(this, arguments);
        };
    }

    // 監聽 DOM 變化並移除多餘元素
    const observer = new MutationObserver(() => {
        if (CONFIG.removeRecommended) {
            const recommended = document.querySelector("#related");
            if (recommended) recommended.style.display = "none";
        }

        if (CONFIG.skipPreRollAds) {
            const adElements = document.querySelectorAll(".ad-showing, .ytp-ad-module");
            adElements.forEach(el => el.remove());
        }

        // 廣告加速
        if (CONFIG.accelerateAds) {
            const video = document.querySelector("video");
            const isAdPlaying = document.querySelector(".ad-showing");
            if (video && isAdPlaying) {
                video.playbackRate = 16; // 設置 16 倍速
                console.log("廣告播放速度加速至 16 倍速");
            } else if (video) {
                video.playbackRate = 1; // 恢復正常播放速度
            }
        }

        const mainContent = document.querySelector("#primary");
        if (mainContent) mainContent.style.visibility = "visible";
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 禁用動畫過渡效果
    if (CONFIG.disableTransitions) {
        const style = document.createElement("style");
        style.innerHTML = `
            * {
                transition: none !important;
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 預加載關鍵資源（僅在主頁時啟用）
    if (CONFIG.prefetchResources && location.pathname === "/") {
        const links = [
            "https://www.youtube.com/feed/trending",
            "https://www.youtube.com/feed/library",
        ];

        links.forEach(link => {
            const prefetch = document.createElement("link");
            prefetch.rel = "prefetch";
            prefetch.href = link;
            document.head.appendChild(prefetch);
            console.log(`已預加載資源：${link}`);
        });
    }
        function skipAd() {
        var skipButton = document.querySelector('.ytp-ad-text.ytp-ad-skip-button-text');
        if (skipButton) {
            skipButton.click();
            console.log("Click button");
        }
    }

    // 設定時間監測
    var timer = setInterval(skipAd, 1); // 1000毫秒 = 1秒

    console.log("YouTube 廣告加速與加載優化腳本運行中！");
})();