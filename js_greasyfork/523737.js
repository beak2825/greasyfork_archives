// ==UserScript==
// @name         智谱清言会话清除
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a button to clear localStorage and refresh the page on chatglm.cn
// @author       gu5ang
// @match        https://chatglm.cn/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523737/%E6%99%BA%E8%B0%B1%E6%B8%85%E8%A8%80%E4%BC%9A%E8%AF%9D%E6%B8%85%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/523737/%E6%99%BA%E8%B0%B1%E6%B8%85%E8%A8%80%E4%BC%9A%E8%AF%9D%E6%B8%85%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建按钮
    const button = document.createElement('button');
    button.textContent = 'Clear Storage';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = '#4CAF50'; // 设置背景颜色
    button.style.border = 'none'; // 移除边框
    button.style.color = 'white'; // 设置字体颜色
    button.style.padding = '15px 32px'; // 设置内边距
    button.style.textAlign = 'center'; // 文本居中
    button.style.textDecoration = 'none'; // 移除文本装饰
    button.style.display = 'inline-block'; // 设置为行内块元素
    button.style.fontSize = '16px'; // 设置字体大小
    button.style.margin = '4px 2px'; // 设置外边距
    button.style.cursor = 'pointer'; // 设置鼠标样式为指针
    button.style.borderRadius = '8px'; // 设置圆角

    // 添加悬停效果
    button.onmouseover = function () {
        this.style.backgroundColor = '#45a049';
    };
    button.onmouseout = function () {
        this.style.backgroundColor = '#4CAF50';
    };

    // 清除localStorage并刷新页面的函数
    button.onclick = function () {
        localStorage.clear();
        window.location.reload();
    };

    // 将按钮添加到页面
    document.body.appendChild(button);
})();