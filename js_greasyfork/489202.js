// ==UserScript==
// @name         linuxdo-自动刷帖脚本
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  实现一个动态平滑滚动的效果，模拟人类滚动网页的行为
// @author       Kenneth
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489202/linuxdo-%E8%87%AA%E5%8A%A8%E5%88%B7%E5%B8%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/489202/linuxdo-%E8%87%AA%E5%8A%A8%E5%88%B7%E5%B8%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义滚动速度范围
    var minScrollSpeed = 30; // 最小滚动像素
    var maxScrollSpeed = 100; // 最大滚动像素
    var autoScroll = false;
    var scrollTimer = null;

    // 创建控制按钮
    var button = document.createElement('button');
    button.textContent = '开始动态滚动';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.cursor = 'pointer';

    // 按钮点击事件处理
    button.onclick = function() {
        autoScroll = !autoScroll;
        button.textContent = autoScroll ? '停止动态滚动' : '开始动态滚动';
        if (autoScroll) {
            startDynamicSmoothScroll();
        } else {
            stopDynamicSmoothScroll();
        }
    };

    document.body.appendChild(button);

    // 开始动态平滑滚动
    function startDynamicSmoothScroll() {
        if (scrollTimer !== null) return; // 防止重复开始

        scrollTimer = setInterval(function() {
            var dynamicScrollSpeed = Math.floor(Math.random() * (maxScrollSpeed - minScrollSpeed + 1)) + minScrollSpeed;
            window.scrollBy({ top: dynamicScrollSpeed, behavior: 'smooth' });
        }, 200); // 维持200毫秒间隔
    }

    // 停止动态平滑滚动
    function stopDynamicSmoothScroll() {
        if (scrollTimer !== null) {
            clearInterval(scrollTimer);
            scrollTimer = null;
        }
    }
})();
