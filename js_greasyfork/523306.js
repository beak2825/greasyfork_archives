// ==UserScript==
// @name         华尔街日报无需登录查看不可查看内容
// @namespace    华尔街无需登录查看不可查看内容（使用第三方接口保存页面）
// @version      1.3
// @description  保存页面到 archive.today，实现绕过登录及付费墙
// @author       让雅克卢梭博客园
// @match        *://*.wsj.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523306/%E5%8D%8E%E5%B0%94%E8%A1%97%E6%97%A5%E6%8A%A5%E6%97%A0%E9%9C%80%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E4%B8%8D%E5%8F%AF%E6%9F%A5%E7%9C%8B%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/523306/%E5%8D%8E%E5%B0%94%E8%A1%97%E6%97%A5%E6%8A%A5%E6%97%A0%E9%9C%80%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E4%B8%8D%E5%8F%AF%E6%9F%A5%E7%9C%8B%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    const currentUrl = window.location.href;

    // 创建一个按钮元素
    const button = document.createElement('button');
    button.textContent = '保存当前网站';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.backgroundColor = '#007bff';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.padding = '10px 15px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
    button.style.zIndex = '9999';

    // 按钮点击事件
    button.addEventListener('click', () => {
        // 创建一个隐藏的表单并提交到 archive.today
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://archive.today/submit/';
        form.target = '_blank'; // 打开新标签

        // 添加 URL 输入字段
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'url';
        input.value = currentUrl;
        form.appendChild(input);

        // 将表单添加到文档并提交
        document.body.appendChild(form);
        form.submit();

        // 提交后移除表单
        document.body.removeChild(form);
    });

    // 添加拖动功能
    let isDragging = false;
    let offsetX, offsetY;

    button.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - button.getBoundingClientRect().left;
        offsetY = e.clientY - button.getBoundingClientRect().top;
        button.style.cursor = 'grabbing'; // 更改鼠标样式
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            button.style.left = `${x}px`;
            button.style.top = `${y}px`;
            button.style.bottom = 'auto'; // 禁止固定在底部
            button.style.right = 'auto'; // 禁止固定在右边
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        button.style.cursor = 'pointer'; // 恢复鼠标样式
    });

    // 将按钮添加到页面
    document.body.appendChild(button);
})();
