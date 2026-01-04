// ==UserScript==
// @name         👑 腾讯元宝--屏蔽小说广告
// @namespace    http://tampermonkey.net/
// @version      7.2
// @description  屏蔽腾讯元宝上当鼠标浮在某些特定文字会弹出小说广告。
// @author       You & AI Assistant
// @match        https://yuanbao.tencent.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541345/%F0%9F%91%91%20%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D--%E5%B1%8F%E8%94%BD%E5%B0%8F%E8%AF%B4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/541345/%F0%9F%91%91%20%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D--%E5%B1%8F%E8%94%BD%E5%B0%8F%E8%AF%B4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 战术一：CSS 精准覆盖 (负责样式) ---
    console.log('[腾讯元宝净化] 样式覆盖模块已启动。');
    const styleTargetSelector = '.hyc-common-markdown__books-text--underline';
    GM_addStyle(`
        ${styleTargetSelector} {
            /* 视觉样式重置 */
            cursor: text !important;
            color: inherit !important;
            
            /* 两种下划线方式一并封杀！ */
            text-decoration: none !important; /* 封杀常规下划线 */
            border-bottom: none !important;   /* 封杀用边框伪造的下划线 */
        }
    `);

    // --- 战术二：持续巡逻并移除 (负责弹窗) ---
    console.log('[腾讯元宝净化] 弹窗移除模块已启动。');
    const popupSelector = '.hyc-common-markdown__books-popup';

    const removePopups = () => {
        const popups = document.querySelectorAll(popupSelector);
        if (popups.length > 0) {
            popups.forEach(popup => {
                popup.remove();
                console.log('Tampermonkey: 发现并移除了一个广告弹窗 ->', popup);
            });
        }
    };

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                removePopups();
                break;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();