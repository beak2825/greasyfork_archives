// ==UserScript==
// @name         YouTube 強制嵌入模式 + 精簡化
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自動跳轉到 YouTube 嵌入模式並隱藏非影片元素
// @match        *://www.youtube.com/watch*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534210/YouTube%20%E5%BC%B7%E5%88%B6%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%BC%8F%20%2B%20%E7%B2%BE%E7%B0%A1%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534210/YouTube%20%E5%BC%B7%E5%88%B6%E5%B5%8C%E5%85%A5%E6%A8%A1%E5%BC%8F%20%2B%20%E7%B2%BE%E7%B0%A1%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 從 URL 提取影片 ID（兼容帶有其他參數的格式）
    const getVideoID = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v') || window.location.pathname.split('/')[2];
    };

    // 檢查是否已在嵌入模式，若否則跳轉
    const redirectToEmbed = () => {
        const videoID = getVideoID();
        if (!videoID || window.location.pathname.startsWith('/embed/')) return;

        // 構建嵌入 URL（可自定義參數）
        const embedURL = `https://www.youtube.com/embed/${videoID}?autoplay=1&controls=1&modestbranding=1`;
        
        // 執行跳轉
        window.stop(); // 停止當前頁面加載
        window.location.replace(embedURL);
    };

    // 當頁面開始加載時觸發
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToEmbed);
    } else {
        redirectToEmbed();
    }

    // 可選：進一步隱藏嵌入頁面的殘留元素（如標題）
    const cleanUpEmbedPage = () => {
        const style = document.createElement('style');
        style.textContent = `
            .ytp-title, /* 隱藏播放器標題 */
            .ytp-chrome-top-buttons /* 隱藏按鈕欄 */
            { display: none !important; }
        `;
        document.head.appendChild(style);
    };

    // 若已在嵌入模式，直接清理頁面
    if (window.location.pathname.startsWith('/embed/')) {
        cleanUpEmbedPage();
    }
})();