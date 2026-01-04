// ==UserScript==
// @name         超智慧廣告清除 v2.0（優化穩定版）
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自動清除廣告與彈窗，更安全、效能更好，支援 YouTube/新聞/成人網站！
// @author       改良：LEO
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533513/%E8%B6%85%E6%99%BA%E6%85%A7%E5%BB%A3%E5%91%8A%E6%B8%85%E9%99%A4%20v20%EF%BC%88%E5%84%AA%E5%8C%96%E7%A9%A9%E5%AE%9A%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/533513/%E8%B6%85%E6%99%BA%E6%85%A7%E5%BB%A3%E5%91%8A%E6%B8%85%E9%99%A4%20v20%EF%BC%88%E5%84%AA%E5%8C%96%E7%A9%A9%E5%AE%9A%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const host = location.hostname;
    let selectors = [];
    let aggressive = false;

    const adultSites = [
        'xnxx.com', 'xvideos.com', 'pornhub.com', 'redtube.com',
        'javlibrary.com', 'spankbang.com', 'youporngay.com'
    ];

    // --------------------------
    // 依網站選擇 selector
    // --------------------------
    if (host.includes('youtube.com')) {
        selectors = [
            '.ytp-ad-skip-button',
            '.ytp-ad-overlay-close-button',
            '.ytp-ad-module',
            '.video-ads'
        ];

    } else if (adultSites.some(domain => host.includes(domain))) {

        aggressive = true;
        selectors = [
            // iframe 廣告
            'iframe[src*="ads"]',
            'iframe[src*="doubleclick"]',
            // 可能是彈窗或贊助
            '[class*="ad-"]',
            '[id^="ad"]',
            '[class*="sponsor"]',
            '[id*="sponsor"]',
            '[class*="popup" i]',
            '[id*="popup" i]'
        ];

    } else if (
        host.includes('ettoday.net') ||
        host.includes('udn.com') ||
        host.includes('ltn.com.tw')
    ) {

        selectors = [
            'iframe[src*="ads"]',
            '[id^="ad"]',
            '[class^="ad"]',
            '[class*="sponsor"]',
            '[id*="sponsor"]',
            '[class*="popup" i]'
        ];

    } else {
        // 一般網站：安全範圍
        selectors = [
            'iframe[src*="ads"]',
            '[id^="ad-"]',
            '[class^="ad-"]',
            '[class*="banner"]',
            '[class*="popup" i]',
            '[id*="popup" i]'
        ];
    }


    // --------------------------
    // 核心清除函式
    // --------------------------
    const clean = () => {
        if (!selectors.length) return;

        const found = document.querySelectorAll(selectors.join(', '));

        found.forEach(el => {
            // 若是重要內容的父層，不強制移除
            if (el.tagName === 'MAIN' || el.tagName === 'HEADER' || el.tagName === 'NAV') return;
            el.remove?.();
        });

        if (found.length > 0) {
            console.log(`[AdBlock] 已清除 ${found.length} 個元素`);
        }
    };


    // --------------------------
    // MutationObserver 監控
    // --------------------------
    const observer = new MutationObserver(() => clean());
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });


    // --------------------------
    // 首次執行 + 延遲補刀
    // --------------------------
    const startup = () => {
        clean();
        setTimeout(clean, 1000);
        setTimeout(clean, 3000);
        setTimeout(clean, 5000);
        if (aggressive) console.warn('[AdBlock] 成人站強力模式啟動');
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startup();
    } else {
        document.addEventListener('DOMContentLoaded', startup);
    }
})();