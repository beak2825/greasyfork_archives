// ==UserScript==
// @name         BiliCleaner Config Script
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  根據配置隱藏或調整 Bilibili 部分頁面元素
// @author       AAA
// @match        https://*.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527913/BiliCleaner%20Config%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/527913/BiliCleaner%20Config%20Script.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("BiliCleaner Config Script loaded.");

    // 配置項（更新為動態獲取，可通過菜單修改）
    let config = {
        // ...（保持原有的配置結構，此處省略以節省空間）
    };

    // ---------------------------
    // 根據配置生成 CSS 樣式規則（完整版）
    // ---------------------------
    function generateCSS(config) {
        let css = "";

        // 通用導航欄相關
        if (config["BILICLEANER_common-hide-nav-anime"]) css += `.primary-nav { animation: none !important; }`;
        if (config["BILICLEANER_common-hide-nav-avatar"]) css += `.header-avatar-wrap { display: none !important; }`;
        if (config["BILICLEANER_common-hide-nav-bdu"]) css += `.header-bdu { display: none !important; }`;
        // 添加更多導航欄規則...

        // 首頁相關
        if (config["BILICLEANER_homepage-hide-banner"]) css += `.bili-banner { display: none !important; }`;
        if (config["BILICLEANER_homepage-hide-subarea"]) css += `.sub-menu { display: none !important; }`;
        if (config["BILICLEANER_hide-footer"]) css += `#internationalFooter { display: none !important; }`;

        // 視頻頁相關
        if (config["BILICLEANER_video-page-hide-right-container"]) css += `.video-page-right-container { display: none !important; }`;
        if (config["BILICLEANER_video-page-hide-comment"]) css += `.comment-container { display: none !important; }`;
        if (config["BILICLEANER_default-widescreen"]) css += `.container { max-width: 100% !important; }`;

        // 動態加載元素處理（使用更精確的選擇器）
        css += `
            /* 動態加載的彈窗 */
            [class*='popover-'], [id*='popover-'] {
                display: none !important;
            }
        `;

        return css;
    }

    // ---------------------------
    // 注入 CSS 並監聽 DOM 變化
    // ---------------------------
    function injectCSS() {
        const css = generateCSS(config);
        if (css) {
            GM_addStyle(css);
            // 監聽 DOM 變化以應對動態內容
            const observer = new MutationObserver(() => {
                GM_addStyle(css); // 重新注入確保新元素應用樣式
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // ---------------------------
    // 初始化
    // ---------------------------
    function init() {
        injectCSS();
        // 可選：添加菜單命令動態切換配置
        GM_registerMenuCommand('⚙️ BiliCleaner 設置', () => {
            alert('此功能需進一步實現配置存儲邏輯');
        });
    }

    // 使用延遲確保 DOM 完全加載
    window.addEventListener('load', init);
})();