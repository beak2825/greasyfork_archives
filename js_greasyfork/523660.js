// ==UserScript==
// @name         返回顶部按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在 https://linux.do/t/topic/ 页面添加返回顶部按钮
// @author       Steve5wutongyu6
// @match        https://linux.do/t/topic/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523660/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/523660/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建返回顶部按钮
    function createBackToTopButton() {
        const backToTopButton = document.createElement('button');
        backToTopButton.className = 'btn btn-icon-text btn-small';
        backToTopButton.title = '返回顶部';
        backToTopButton.innerHTML = `
            <svg class="fa d-icon d-icon-arrow-up svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#arrow-up"></use></svg>
            <span class="d-button-label">返回顶部</span>
        `;

        // 添加点击事件
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        return backToTopButton;
    }

    // 添加按钮到页面
    function addBackToTopButton() {
        const footerControls = document.querySelector('.timeline-footer-controls');
        if (footerControls && !footerControls.querySelector('.back-to-top-button')) {
            const backToTopButton = createBackToTopButton();
            backToTopButton.classList.add('back-to-top-button'); // 添加自定义类名以便识别
            footerControls.appendChild(backToTopButton);
        }
    }

    // 定期检查并添加按钮
    setInterval(addBackToTopButton, 1000); // 每 1 秒检查一次

    // 添加一些样式以确保按钮看起来合适
    const style = document.createElement('style');
    style.textContent = `
        .btn-small {
            padding: 5px 10px;
            font-size: 12px;
        }
        .d-icon-arrow-up {
            width: 16px;
            height: 16px;
        }
    `;
    document.head.appendChild(style);
})();