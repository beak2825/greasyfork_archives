// ==UserScript==
// @name         Toggle White Overlay on Top of ChatGPT Page
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在 https://chatgpt.com/ 页面顶部添加一个可切换的白色背景覆盖层，鼠标移入时显示，移开时隐藏
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514824/Toggle%20White%20Overlay%20on%20Top%20of%20ChatGPT%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/514824/Toggle%20White%20Overlay%20on%20Top%20of%20ChatGPT%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 延迟执行以确保页面元素完全加载
    setTimeout(() => {
        // 创建一个覆盖层 div
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '60px'; // 根据实际情况调整高度
        overlay.style.backgroundColor = 'white';
        overlay.style.zIndex = '1000'; // 确保覆盖在页面顶部
        overlay.style.opacity = '0'; // 初始状态为隐藏
        overlay.style.transition = 'opacity 0.3s'; // 添加淡入淡出效果
        overlay.style.pointerEvents = 'none'; // 不影响鼠标事件传递

        // 添加鼠标移入和移出事件
        document.body.addEventListener('mousemove', (event) => {
            if (event.clientY <= 60) { // 当鼠标位于页面顶部60px区域内时显示覆盖层
                overlay.style.opacity = '1';
                console.log("覆盖层显示");
            } else {
                overlay.style.opacity = '0';
                console.log("覆盖层隐藏");
            }
        });

        // 将覆盖层添加到页面上
        document.body.appendChild(overlay);
        console.log("覆盖层已添加");
    }, 1000); // 延迟1秒，确保页面加载完成
})();
