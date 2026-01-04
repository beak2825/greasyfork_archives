// ==UserScript==
// @name         Bilibili Live Unmasker (B站直播去马赛克脚本)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  通过更温和的方式隐藏B站直播的马赛克块，避免触发“违规操作”提示。
// @author       morinekiyohisa
// @match        *://live.bilibili.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540316/Bilibili%20Live%20Unmasker%20%28B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%A9%AC%E8%B5%9B%E5%85%8B%E8%84%9A%E6%9C%AC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540316/Bilibili%20Live%20Unmasker%20%28B%E7%AB%99%E7%9B%B4%E6%92%AD%E5%8E%BB%E9%A9%AC%E8%B5%9B%E5%85%8B%E8%84%9A%E6%9C%AC%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MASK_ID = 'web-player-module-area-mask-panel';
    let hide_timer = null; // 用于延迟执行的计时器

    const hideMaskGently = () => {
        const maskPanel = document.getElementById(MASK_ID);
        if (maskPanel && maskPanel.style.opacity !== '0') {
            // 不直接删除，也不用display:none
            // 而是让它完全透明，并且无法被鼠标点击
            // 这是最不容易被检测到的方法
            maskPanel.style.setProperty('opacity', '0', 'important');
            maskPanel.style.setProperty('pointer-events', 'none', 'important');
            console.log('[B站直播去马赛克脚本] 已成功将马赛克“隐身”。');
        }
    };

    const observer = new MutationObserver(mutations => {
        // 不要立即执行！B站的脚本可能在看着我们！
        // 我们设置一个非常短的延迟，比如100毫秒，来错开检测。
        // 这模仿了“慢半拍”的反应，从而绕过检测。
        clearTimeout(hide_timer); // 如果在延迟期间有新的变化，则重置计时器
        hide_timer = setTimeout(hideMaskGently, 100);
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
    });

    // 页面加载时也尝试执行一次
    setTimeout(hideMaskGently, 500);

})();