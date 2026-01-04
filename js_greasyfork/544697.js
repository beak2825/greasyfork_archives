// ==UserScript==
// @name         自动切换暗黑模式20250805
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  根据系统设置自动为网页启用暗黑模式
// @author       gc
// @match        *://*/*
// @exclude      https://greasyfork.org/*
// @exclude      https://openuserjs.org/*
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/544697/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F20250805.user.js
// @updateURL https://update.greasyfork.org/scripts/544697/%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F20250805.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 检查系统是否偏好暗黑模式
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // 如果系统偏好暗黑模式，则应用暗黑样式
    if (prefersDark) {
        applyDarkMode();
    }
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (e.matches) {
            applyDarkMode();
        } else {
            removeDarkMode();
        }
    });
    // 应用暗黑模式样式
    function applyDarkMode() {
        // 添加全局暗黑样式
        GM_addStyle(`
            html.dark-mode {
                filter: invert(1) hue-rotate(180deg);
            }
            html.dark-mode img,
            html.dark-mode video,
            html.dark-mode iframe,
            html.dark-mode canvas,
            html.dark-mode svg {
                filter: invert(1) hue-rotate(180deg);
            }
        `);
        // 添加暗黑模式类
        document.documentElement.classList.add('dark-mode');
        // 记录已应用暗黑模式
        localStorage.setItem('darkModeApplied', 'true');
    }
    // 移除暗黑模式样式
    function removeDarkMode() {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('darkModeApplied', 'false');
    }
    // 添加快捷键切换功能：Cmd+I
    document.addEventListener('keydown', (e) => {
        // metaKey对应Cmd键，key为'i'（不区分大小写）
        // 排除在输入框、文本域等可输入区域触发
        const isCmdI = e.metaKey && !e.altKey && !e.ctrlKey && e.key.toLowerCase() === 'i' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
        if (isCmdI) {
            e.preventDefault(); // 阻止默认行为
            e.stopPropagation(); // 阻止事件冒泡
            // 切换暗黑模式状态
            if (document.documentElement.classList.contains('dark-mode')) {
                removeDarkMode();
            } else {
                applyDarkMode();
            }
        }
    });
})();