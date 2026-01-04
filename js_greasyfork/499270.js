// ==UserScript==
// @name         自动滚动按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在指定网页上显示一个圆形按钮，点击按钮后实现滚轮自动向下滚动，同时阻止屏幕变暗
// @author       You
// @match        http://192.168.31.188:4567/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499270/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/499270/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let scrollInterval = null;
    let isScrolling = false;
    let userActivityInterval = null;

    // 创建按钮元素
    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.width = '50px';
    button.style.height = '50px';
    button.style.background = '#ba68c8'; // 将颜色改为浅紫色
    button.style.borderRadius = '50%';
    button.style.cursor = 'pointer';
    button.style.display = 'flex';
    button.style.justifyContent = 'center';
    button.style.alignItems = 'center';
    button.style.color = 'white';
    button.style.zIndex = '10000'; // 确保按钮在最前面
    button.style.fontSize = '16px';
    button.innerText = '自动';

    // 点击按钮触发滚动
    button.addEventListener('click', function() {
        if (!isScrolling) {
            startScrolling();
            preventScreenDimming(true); // 滚动启用时阻止屏幕变暗
        } else {
            stopScrolling();
            preventScreenDimming(false); // 停止滚动时允许屏幕变暗
        }
    });

    // 添加按钮到页面
    document.body.appendChild(button);

    // 开始滚动
    function startScrolling() {
        isScrolling = true;
        scrollInterval = setInterval(function() {
            window.scrollBy(0, 20); // 滚动距离设置为20像素
        }, 150); // 滚动间隔设置为150毫秒
        button.innerText = '停止';

        // 开始模拟用户活动
        simulateUserActivity();
    }

    // 停止滚动
    function stopScrolling() {
        isScrolling = false;
        clearInterval(scrollInterval);
        button.innerText = '滚动';

        // 停止模拟用户活动
        clearInterval(userActivityInterval);
    }

    // 模拟用户活动，防止屏幕变暗
    function simulateUserActivity() {
        userActivityInterval = setInterval(function() {
            // 创建一个虚拟的 MouseEvent，模拟鼠标移动事件
            const event = new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            document.dispatchEvent(event);
        }, 10 * 1000); // 每隔10秒发送一次虚拟鼠标移动事件
    }

    // 控制屏幕变暗
    function preventScreenDimming(shouldPrevent) {
        if (shouldPrevent) {
            simulateUserActivity(); // 开始模拟用户活动
        } else {
            clearInterval(userActivityInterval); // 停止模拟用户活动
        }
    }

})();
