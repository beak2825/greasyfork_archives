// ==UserScript==
// @name         YouTube 影片自動刷新（僅在前6秒內檢查3次,排除主頁和搜索頁面）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license MIT
// @description  在YouTube影片載入後的6秒內檢測是否暫停，如果暫停則自動刷新頁面。每2秒檢查一次，最多檢查3次。在主頁和搜索結果頁面不執行。
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512687/YouTube%20%E5%BD%B1%E7%89%87%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0%EF%BC%88%E5%83%85%E5%9C%A8%E5%89%8D6%E7%A7%92%E5%85%A7%E6%AA%A2%E6%9F%A53%E6%AC%A1%2C%E6%8E%92%E9%99%A4%E4%B8%BB%E9%A0%81%E5%92%8C%E6%90%9C%E7%B4%A2%E9%A0%81%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/512687/YouTube%20%E5%BD%B1%E7%89%87%E8%87%AA%E5%8B%95%E5%88%B7%E6%96%B0%EF%BC%88%E5%83%85%E5%9C%A8%E5%89%8D6%E7%A7%92%E5%85%A7%E6%AA%A2%E6%9F%A53%E6%AC%A1%2C%E6%8E%92%E9%99%A4%E4%B8%BB%E9%A0%81%E5%92%8C%E6%90%9C%E7%B4%A2%E9%A0%81%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 檢查是否在主頁或搜索頁面
    if (window.location.href === "https://www.youtube.com/" ||
        window.location.href.includes("https://www.youtube.com/results?search_query=")) {
        return; // 如果是主頁或搜索頁面,直接結束腳本執行
    }

    function checkVideoStatus(videoId) {
        // 檢查是否已經對該影片執行過檢查
        if (sessionStorage.getItem('checked_' + videoId)) {
            return; // 如果已檢查過，直接返回
        }

        const video = document.querySelector('video');
        if (video) {
            // 如果影片已經播放超過6秒，不執行檢查
            if (video.currentTime > 6) {
                sessionStorage.setItem('checked_' + videoId, 'true');
                return;
            }

            let checkCount = 0;
            const checkInterval = setInterval(() => {
                checkCount++;
                if (checkCount > 3 || video.currentTime > 10) {
                    clearInterval(checkInterval);
                    sessionStorage.setItem('checked_' + videoId, 'true');
                    return;
                }

                if (video.paused) {
                    // 如果影片處於暫停狀態，刷新頁面
                    clearInterval(checkInterval);
                    location.reload();
                }
            }, 2000); // 每2秒檢查一次

            // 如果影片開始播放，停止檢查並標記為已檢查
            video.addEventListener('play', () => {
                clearInterval(checkInterval);
                sessionStorage.setItem('checked_' + videoId, 'true');
            }, { once: true });
        }
    }

    function getVideoId(url) {
        const urlParams = new URLSearchParams(new URL(url).search);
        return urlParams.get('v');
    }

    function handleUrlChange() {
        const currentUrl = window.location.href;
        if (currentUrl.includes('watch?v=')) {
            const videoId = getVideoId(currentUrl);
            if (videoId) {
                // 重置檢查狀態
                sessionStorage.removeItem('checked_' + videoId);
                checkVideoStatus(videoId);
            }
        }
    }

    // 使用 MutationObserver 監聽 URL 變化
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                handleUrlChange();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始檢查
    handleUrlChange();
})();