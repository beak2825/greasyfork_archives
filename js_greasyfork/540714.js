// ==UserScript==
// @name         Ci-en 創作者排行卡片放大＋左靠全寬
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  同 v1.2，並將主容器向左靠齊（margin-left:0）
// @author       
// @match        https://ci-en.dlsite.com/ranking/creators/daily*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540714/Ci-en%20%E5%89%B5%E4%BD%9C%E8%80%85%E6%8E%92%E8%A1%8C%E5%8D%A1%E7%89%87%E6%94%BE%E5%A4%A7%EF%BC%8B%E5%B7%A6%E9%9D%A0%E5%85%A8%E5%AF%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/540714/Ci-en%20%E5%89%B5%E4%BD%9C%E8%80%85%E6%8E%92%E8%A1%8C%E5%8D%A1%E7%89%87%E6%94%BE%E5%A4%A7%EF%BC%8B%E5%B7%A6%E9%9D%A0%E5%85%A8%E5%AF%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    /* —— 0. 全站容器：左靠顯示 —— */
    body,
    .l-container,
    .l-body,
    .p-ranking {
        max-width: 1600px !important;
        width: 100% !important;
        margin-left: 500 !important;     /* ← 改這行：左邊貼齊視窗 */
        margin-right: 0; /* 保持右邊自動空白 */
    }

    /* —— 1. 卡片區塊：Grid —— */
    .c-card-creator-archives {
        display: grid !important;
        grid-template-columns: 36px 120px 1fr 1000px !important;
        column-gap: 20px !important;
        row-gap: 12px !important;
        padding: 14px 18px !important;
        align-items: center;
    }

    /* —— 2. 排名標籤 —— */
    .c-card-creator-archives-label {
        font-size: 1.25rem !important;
        font-weight: 700 !important;
    }

    /* —— 3. 頭像 —— */
    .c-card-creator-archives-icon {
        width: 120px !important;
        height: 120px !important;
    }
    .c-card-creator-archives-icon img {
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
        border-radius: 8px !important;
    }

    /* —— 4. 文字區 —— */
    .c-card-creator-archives-name {
        font-size: 1.2rem !important;
        line-height: 1.35 !important;
    }
    .c-card-creator-archives-content {
        font-size: 1rem !important;
        line-height: 1.45 !important;
        margin-top: 6px !important;
    }

    /* —— 5. 「追蹤」按鈕 —— */
    .c-card-creator-archives-nav {
        margin-top: 10px !important;
    }
    .c-card-creator-archives-nav button {
        padding: 7px 16px !important;
        font-size: 0.98rem !important;
        border-radius: 5px !important;
    }

    /* —— 6. 作品縮圖容器 —— */
    .c-card-creator-archives-thg {
        width: 220px !important;
    }
    `);
})();
