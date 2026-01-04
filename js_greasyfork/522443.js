// ==UserScript==
// @name         返回顶部按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页右下角添加返回顶部按钮
// @author       You
// @match        *://*/*
// @exclude      *://cuntou0906.github.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522443/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/522443/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const scrollTopBtn = document.createElement('div');

    // 设置按钮样式
    scrollTopBtn.style.cssText = `
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: rgba(128, 128, 128, 0.6);
        color: #fff;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s, background-color 0.3s;
        z-index: 9999;
        font-size: 16px;
        user-select: none;
        border: none;
    `;

    // 添加向上箭头
    scrollTopBtn.innerHTML = '↑';

    // 添加鼠标悬停效果
    scrollTopBtn.onmouseover = function() {
        this.style.backgroundColor = 'rgba(128, 128, 128, 0.8)';
    };
    scrollTopBtn.onmouseout = function() {
        this.style.backgroundColor = 'rgba(128, 128, 128, 0.6)';
    };

    // 点击事件处理
    scrollTopBtn.onclick = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // 监听滚动事件，控制按钮显示/隐藏
    window.addEventListener('scroll', function() {
        if (window.scrollY > 200) {
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
        }
    });

    // 将按钮添加到页面
    document.body.appendChild(scrollTopBtn);
})();
