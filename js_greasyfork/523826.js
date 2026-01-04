// ==UserScript==
// @name         Wall Street Journal content that cannot be viewed without logging in.
// @namespace    Wall Street content that cannot be viewed without logging in (using third-party interfaces to save the page).
// @version      1.1
// @description  save page to archive.today，Bypass login and paywall implementation.
// @author       让雅克卢梭博客园（https://www.cnblogs.com/lusuo）
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523826/Wall%20Street%20Journal%20content%20that%20cannot%20be%20viewed%20without%20logging%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/523826/Wall%20Street%20Journal%20content%20that%20cannot%20be%20viewed%20without%20logging%20in.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 获取当前页面的 URL
    const currentUrl = window.location.href;
 
    // 创建一个按钮元素
    const button = document.createElement('button');
    button.textContent = 'Save the current website';
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