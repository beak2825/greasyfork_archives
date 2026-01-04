// ==UserScript==
// @name          Anime1 背景主題 (優化版)
// @namespace     k100466jerry
// @description   Anime1 背景主題更新 + 效能優化
// @author        k100466jerry
// @include       https://anime1.me/*
// @run-at        document-start
// @grant         none
// @version       2025.8.20
// @downloadURL https://update.greasyfork.org/scripts/434820/Anime1%20%E8%83%8C%E6%99%AF%E4%B8%BB%E9%A1%8C%20%28%E5%84%AA%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/434820/Anime1%20%E8%83%8C%E6%99%AF%E4%B8%BB%E9%A1%8C%20%28%E5%84%AA%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    /** 安全取得背景圖清單 */
    const picList = (() => {
        try {
            return JSON.parse(localStorage.getItem('背景圖片網址連結')) || [];
        } catch (e) {
            console.warn("背景圖片網址連結 解析錯誤", e);
            return [];
        }
    })();

    /** 隨機圖片，預設一張備援 */
    const fallbackPic = 'https://imgur.com/fdKXU4N.png';
    const 背景圖片網址 = picList.length > 0
        ? picList[Math.floor(Math.random() * picList.length)]
        : fallbackPic;

    /** 直接套用 URL，不做 Base64 轉換以避免耗時 */
    const css = `
        :root {
            --base: transparent;
            --base2: transparent;
            background-color: rgba(245, 245, 245, 0) !important;
        }
        body {
            background: #08090d url(${背景圖片網址}) no-repeat center top !important;
            background-attachment: fixed !important;
            background-size: cover !important;
        }
        /* 修正 .site 預設背景會蓋掉圖片的問題 */
        .site {
            background: transparent !important;
        }
        .site-content, .site-content h1, .site-content h2, .site-content h3,
        .site-content h4, .site-content h5, .site-content h6,
        .archive .entry-title a, .site-content a {
            color: #f9f9f9 !important;
        }
        .tablepress .even td { background-color: #66666675 !important; }
        .tablepress .odd td  { background-color: #666666b0 !important; }
        .widget-area, .content-area { background-color: #3d3d3d66 !important; }
        thead th { background-color: #c3e7f99c !important; font-weight: 700; }
        table td { background: transparent; border: 1px solid #e6e6e6; }
    `;

    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
})();
