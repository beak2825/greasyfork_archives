// ==UserScript==
// @name         不太灵VIP
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  删除不太灵的VIP查看限制和模糊效果
// @author       kkzh
// @match        *://*.mukaku.com/*
// @match        *://*.butailing.com/*
// @match        *://*.butai0.club/*
// @match        *://*.butai0.xyz/*
// @match        *://*.butai0.dev/*
// @match        *://*.butai0.vip/*
// @match        *://*.butai0.one/*
// @match        *://*.0bt0.com/*
// @match        *://*.1bt0.com/*
// @match        *://*.2bt0.com/*
// @match        *://*.3bt0.com/*
// @match        *://*.4bt0.com/*
// @match        *://*.5bt0.com/*
// @match        *://*.6bt0.com/*
// @match        *://*.7bt0.com/*
// @match        *://*.8bt0.com/*
// @match        *://*.9bt0.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540766/%E4%B8%8D%E5%A4%AA%E7%81%B5VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/540766/%E4%B8%8D%E5%A4%AA%E7%81%B5VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 移除了模糊、阻止点击、和常见的VIP类名
    const styles = `
        /* 强制取消模糊 */
        div[style*="filter: blur"],
        div[style*="filter:blur"],
        .blur, .blurred {
            filter: none !important;
            opacity: 1 !important;
            pointer-events: auto !important;
            user-select: auto !important;
        }

        /* 隐藏VIP层 */
        .vip-gate-overlay, .vip-overlay, .vip-gate, .vip-notice,
        [class*="vip-gate"], [class*="vip-overlay"], [class*="vip-notice"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* 恢复滚动条 (部分网站在弹出VIP层时会锁定body滚动) */
        body {
            overflow: auto !important;
        }
    `;

    // 使用 GM_addStyle 绕过 CSP 限制
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(styles);
    } else {
        const style = document.createElement('style');
        style.textContent = styles;
        document.documentElement.appendChild(style);
    }

    // 2. 动态清理函数 (处理无法通过CSS覆盖的情况)
    function cleanRemainingRestrictions() {
        // 清理具有高 z-index 且包含 VIP 字样的元素
        const possibleOverlays = document.querySelectorAll('div[style*="z-index"]');
        possibleOverlays.forEach(el => {
            const zIndex = parseInt(el.style.zIndex);
            if (zIndex > 100) {
                const text = el.textContent;
                if (/vip|专属|开通|会员|升级|付费/i.test(text)) {
                    el.remove();
                }
            }
        });

        // 查找并强制开启模糊元素的属性（处理 JS 动态修改的情况）
        document.querySelectorAll('div').forEach(el => {
            if (el.style.filter && el.style.filter.includes('blur')) {
                el.style.filter = 'none';
                el.style.pointerEvents = 'auto';
            }
        });
    }

    // 3. 使用 MutationObserver 监听动态内容
    function init() {
        const observer = new MutationObserver((mutations) => {
            // 防抖：避免突发大量节点变动导致卡顿
            clearTimeout(window.vipCleanerTimer);
            window.vipCleanerTimer = setTimeout(cleanRemainingRestrictions, 100);
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        // 页面完全加载后再运行一次兜底
        window.addEventListener('load', cleanRemainingRestrictions);
    }

    // 启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
