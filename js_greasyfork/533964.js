// ==UserScript==
// @name         Z-Library 持久化 Glass 主题切换器
// @namespace    http://tampermonkey.net/
// @version      2025-04-25.4
// @description  通过菜单按钮循环切换 g1, g2, g3 glass 主题，并保存选择。
// @author       fever
// @match        https://z-library.sk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=z-library.sk
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533964/Z-Library%20%E6%8C%81%E4%B9%85%E5%8C%96%20Glass%20%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533964/Z-Library%20%E6%8C%81%E4%B9%85%E5%8C%96%20Glass%20%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const themes = ['g1', 'g2', 'g3'];
    const storageKey = 'zlibGlassTheme'; // 存储键名

    /**​
     * 应用指定的主题
     * @param {string} themeName - 要应用的主题 (g1, g2, or g3)
     */
    function applyTheme(themeName) {
        const htmlNode = document.documentElement;
        if (!htmlNode) return;

        // 确保传入的是有效主题之一，否则用第一个作为默认
        if (!themes.includes(themeName)) {
            themeName = themes[0];
        }

        // 移除旧主题类
        htmlNode.classList.remove('dark', 'light', ...themes);
        // 添加 glass 和新主题类
        htmlNode.classList.add('glass', themeName);
    }

    /**​
     * 切换到下一个主题并保存
     */
    function cycleAndSaveTheme() {
        // 获取当前应用的主题（从 DOM 或存储中读取，优先从存储读取以保证循环正确性）
        let currentTheme = GM_getValue(storageKey, themes[0]); // 如果没存过，默认 g1

        let currentIndex = themes.indexOf(currentTheme);
        // 如果当前存储的主题无效（比如手动修改过存储），从头开始
        if (currentIndex === -1) {
            currentIndex = 0;
        }

        // 计算下一个主题的索引
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];

        // 应用新主题
        applyTheme(nextTheme);

        // 保存新选择
        GM_setValue(storageKey, nextTheme);
        console.log(`主题已切换并保存为: ${nextTheme}`); // 可以在控制台看到切换信息
    }

    // --- 脚本执行 ---

    // 1. 页面加载时，立即读取并应用保存的主题
    //    使用 @run-at document-start 来尽量减少页面闪烁
    const savedTheme = GM_getValue(storageKey, themes[0]); // 读取保存的主题，若无则默认 g1
    applyTheme(savedTheme); // 立即应用

    // 2. 注册菜单命令
    GM_registerMenuCommand('切换并保存 Glass 主题 (g1/g2/g3)', cycleAndSaveTheme);

})();
