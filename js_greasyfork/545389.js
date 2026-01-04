// ==UserScript==
// @name         去 VIP 遮罩 – butai0
// @namespace    https://github.com/yourname
// @version      1.0
// @description  移除 butai0.xyz 上的 VIP 弹窗 / 遮罩
// @author       你的名字
// @match        https://www.butai0.xyz/*
// @match        https://butai0.xyz/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545389/%E5%8E%BB%20VIP%20%E9%81%AE%E7%BD%A9%20%E2%80%93%20butai0.user.js
// @updateURL https://update.greasyfork.org/scripts/545389/%E5%8E%BB%20VIP%20%E9%81%AE%E7%BD%A9%20%E2%80%93%20butai0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* 通用遮罩黑名单（CSS 隐藏 + DOM 删除双保险） */
    const css = `
        .vip-mask,
        .vip-popup,
        .vip-modal,
        .vip-dialog,
        .vip-overlay,
        [class*="vip"][class*="mask"],
        [class*="vip"][class*="popup"],
        [id*="vip"][id*="mask"],
        [id*="vip"][id*="popup"] {
            display: none !important;
            visibility: hidden !important;
        }
    `;

    /* 插入样式 */
    const style = document.createElement('style');
    style.textContent = css;
    document.documentElement.appendChild(style);

    /* 等待 DOM 后删除节点（防止懒加载） */
    const killVip = () => {
        document.querySelectorAll(`
            .vip-mask,
            .vip-popup,
            .vip-modal,
            .vip-dialog,
            .vip-overlay,
            [class*="vip"][class*="mask"],
            [class*="vip"][class*="popup"],
            [id*="vip"][id*="mask"],
            [id*="vip"][id*="popup"]
        `).forEach(el => el.remove());
    };

    /* 页面变化时持续清理 */
    const obs = new MutationObserver(killVip);
    obs.observe(document, { childList: true, subtree: true });

    /* 首次立即执行一次 */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', killVip);
    } else {
        killVip();
    }
})();