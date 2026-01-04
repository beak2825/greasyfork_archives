// ==UserScript==
// @name         Toggle White Overlay on Top of ChatGPT Page
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在 https://chatgpt.com/ 页面顶部添加一个可切换的白色背景覆盖层，鼠标移入时显示，移开时隐藏
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514826/Toggle%20White%20Overlay%20on%20Top%20of%20ChatGPT%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/514826/Toggle%20White%20Overlay%20on%20Top%20of%20ChatGPT%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("脚本已启动");

    // 创建覆盖层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '60px';
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '1000';
    overlay.style.opacity = '0'; // 初始状态隐藏
    overlay.style.transition = 'opacity 0.3s';
    overlay.style.pointerEvents = 'none';

    // 鼠标移动事件
    document.body.addEventListener('mousemove', (event) => {
        if (event.clientY <= 60) {
            overlay.style.opacity = '1';
            console.log("覆盖层显示");
        } else {
            overlay.style.opacity = '0';
            console.log("覆盖层隐藏");
        }
    });

    // 使用 MutationObserver 监控页面加载
    const observer = new MutationObserver(() => {
        if (document.body && !document.body.contains(overlay)) {
            document.body.appendChild(overlay);
            console.log("覆盖层已添加到页面");
            observer.disconnect(); // 覆盖层添加后停止观察
        }
    });

    // 监视页面的变化，确保覆盖层添加在动态加载内容后
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();
