// ==UserScript==
// @name         灵动 MD 链接复制
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  在网页上添加一个动态按钮，鼠标接近时显示，点击后将标题和URL转换为Markdown链接并复制到剪贴板
// @author       RrOrange
// @homepage     https://github.com/zhiyu1998/rrorange-tampermonkey-list
// @license      MIT
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/530599/%E7%81%B5%E5%8A%A8%20MD%20%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/530599/%E7%81%B5%E5%8A%A8%20MD%20%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    var button = document.createElement('button');
    button.innerText = 'Copy MD Link';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '-100px'; // 默认隐藏在屏幕外
    button.style.zIndex = '10000';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4f6f46';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.transition = 'right 0.3s ease'; // 平滑过渡效果

    // 将按钮添加到页面
    document.body.appendChild(button);

    // 鼠标移动事件：检测鼠标位置并控制按钮显示
    document.addEventListener('mousemove', function(event) {
        var mouseX = event.clientX;
        var windowWidth = window.innerWidth;
        if (windowWidth - mouseX < 100) { // 鼠标距离右侧小于100px时显示
            button.style.right = '20px'; // 按钮滑入
        } else if (mouseX < windowWidth - 120) { // 鼠标离开按钮区域
            button.style.right = '-100px'; // 按钮滑回隐藏
        }
    });

    // 点击事件：复制 Markdown 链接
    button.addEventListener('click', function() {
        var title = document.title;
        var url = window.location.href;
        var mdLink = '[' + title + '](<' + url + '>)';
        GM_setClipboard(mdLink);
        GM_notification({text: "Markdown链接已复制到剪贴板！", title: "成功", timeout: 2000});
    });
})();
