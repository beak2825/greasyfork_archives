// ==UserScript==
// @name         YouTube搜索結果時間排序（改進版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license MIT
// @description  自動將YouTube搜索結果按時間排序，延遲執行並只排序一次
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511756/YouTube%E6%90%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E6%99%82%E9%96%93%E6%8E%92%E5%BA%8F%EF%BC%88%E6%94%B9%E9%80%B2%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/511756/YouTube%E6%90%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E6%99%82%E9%96%93%E6%8E%92%E5%BA%8F%EF%BC%88%E6%94%B9%E9%80%B2%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hasExecuted = false;
    let lastCheckedUrl = '';

    function addSortParameter(url) {
        if (url.includes('&sp=')) {
            return url;
        }
        return url + '&sp=CAI%253D';
    }

    function checkAndModifyUrl() {
        const currentUrl = window.location.href;

        // 檢查是否為搜索結果頁面且之前沒有執行過
        if (currentUrl.includes('results?search_query=') && !hasExecuted && currentUrl !== lastCheckedUrl) {
            const newUrl = addSortParameter(currentUrl);
            lastCheckedUrl = currentUrl;

            // 如果URL需要修改，則進行跳轉
            if (newUrl !== currentUrl) {
                hasExecuted = true;
                window.location.href = newUrl;
            }
        } else if (!currentUrl.includes('results?search_query=')) {
            // 如果不是搜索結果頁面，重置執行狀態
            hasExecuted = false;
            lastCheckedUrl = '';
        }
    }

    // 延遲 5 秒後執行檢查
    setTimeout(() => {
        checkAndModifyUrl();

        // 使用 MutationObserver 監聽 URL 變化
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    checkAndModifyUrl();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }, 2000);
})();