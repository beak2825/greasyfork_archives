// ==UserScript==
// @name         SeedHub - 显示扫码转存二维码
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  显示SeedHub网盘扫码转存二维码
// @author      visionzk
// @license     MIT
// @match        https://www.seedhub.cc/link_start*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/543663/SeedHub%20-%20%E6%98%BE%E7%A4%BA%E6%89%AB%E7%A0%81%E8%BD%AC%E5%AD%98%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/543663/SeedHub%20-%20%E6%98%BE%E7%A4%BA%E6%89%AB%E7%A0%81%E8%BD%AC%E5%AD%98%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 强制显示 .mobile-pan 及其子元素
    GM_addStyle(`
        .mobile-pan,
        .mobile-pan * {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            height: auto !important;
            width: auto !important;
            max-height: none !important;
            max-width: none !important;
            position: static !important;
            clip: auto !important;
        }
    `);

    // 2. 隐藏 #qrcode 下的第一个 canvas
    GM_addStyle(`
        #qrcode canvas:first-of-type {
            display: none !important;
            visibility: hidden !important;
        }
    `);

    // 3. 动态检查（防止元素延迟加载）
    function applyStyles() {
        // 确保 .mobile-pan 显示
        const mobilePan = document.querySelector('.mobile-pan');
        if (mobilePan) {
            const setDisplayVisible = (element) => {
                element.style.display = 'block';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
                Array.from(element.children).forEach(child => setDisplayVisible(child));
            };
            setDisplayVisible(mobilePan);
        }

        // 隐藏 #qrcode 下的第一个 canvas
        const qrcodeCanvas = document.querySelector('#qrcode canvas:first-of-type');
        if (qrcodeCanvas) {
            qrcodeCanvas.style.display = 'none';
            qrcodeCanvas.style.visibility = 'hidden';
        }
    }

    // 初始执行
    applyStyles();

    // 监听 DOM 变化（适用于动态加载内容）
    const observer = new MutationObserver(applyStyles);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 确保在页面完全加载后再次检查
    window.addEventListener('load', applyStyles);
})();