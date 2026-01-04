// ==UserScript==
// @name         右键增强：Google搜索、打开链接
// @description  选文字+右键，后台google搜索；选链接+右键，后台打开链接；选“图片+链接”（比如封面图）+右键，后台打开网页。
// @author       ChatGPT
// @match        *://*/*
// @namespace    https://greasyfork.org/users/1171320
// @version      1.0
// @author         yzcjd
// @author2       ChatGPT4 辅助
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535796/%E5%8F%B3%E9%94%AE%E5%A2%9E%E5%BC%BA%EF%BC%9AGoogle%E6%90%9C%E7%B4%A2%E3%80%81%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/535796/%E5%8F%B3%E9%94%AE%E5%A2%9E%E5%BC%BA%EF%BC%9AGoogle%E6%90%9C%E7%B4%A2%E3%80%81%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==



(function () {
    'use strict';

    let lastRightClickTime = 0;
    const doubleClickThreshold = 250;

    // 简单 URL 提取正则
    const urlRegex = /(https?:\/\/[^\s"'<>\u3000-\u303F\uFF00-\uFFEF]+)/;

    document.addEventListener('contextmenu', (e) => {
        const now = Date.now();
        const delta = now - lastRightClickTime;
        lastRightClickTime = now;

        if (delta < doubleClickThreshold) return;

        const isEditable = e.target.isContentEditable ||
            ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
        if (isEditable) return;

        const link = e.target.closest('a[href]');
        const selection = window.getSelection()?.toString().trim();

        const hasTextSelection = !!selection;

        // 如果满足：链接 或 选中文字，才拦截
        if (link || hasTextSelection) {
            e.preventDefault(); // ⚠️ 必须先阻止右键菜单

            setTimeout(() => {
                if (link && link.href) {
                    // ✅ 优先 HTML 链接
                    GM_openInTab(link.href, { active: false, insert: true });
                } else if (selection) {
                    // ✅ 若选中文本中含 URL，优先打开该 URL
                    const match = selection.match(urlRegex);
                    if (match && match[1]) {
                        GM_openInTab(match[1], { active: false, insert: true });
                    } else {
                        // 🔍 否则搜索
                        const query = encodeURIComponent(selection);
                        const url = `https://www.google.com/search?q=${query}`;
                        GM_openInTab(url, { active: false, insert: true });
                    }
                }
            }, 0);
        }
    });
})();
