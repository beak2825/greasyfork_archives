// ==UserScript==
// @name         简单易用一键保存当前网页，无需复杂操作。自动化离线保存，方便又高效
// @namespace    保存当前网页实现离线浏览
// @version      1.1
// @description  永久保存重要内容
// @author       让雅克卢梭博客园
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523307/%E7%AE%80%E5%8D%95%E6%98%93%E7%94%A8%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%EF%BC%8C%E6%97%A0%E9%9C%80%E5%A4%8D%E6%9D%82%E6%93%8D%E4%BD%9C%E3%80%82%E8%87%AA%E5%8A%A8%E5%8C%96%E7%A6%BB%E7%BA%BF%E4%BF%9D%E5%AD%98%EF%BC%8C%E6%96%B9%E4%BE%BF%E5%8F%88%E9%AB%98%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/523307/%E7%AE%80%E5%8D%95%E6%98%93%E7%94%A8%E4%B8%80%E9%94%AE%E4%BF%9D%E5%AD%98%E5%BD%93%E5%89%8D%E7%BD%91%E9%A1%B5%EF%BC%8C%E6%97%A0%E9%9C%80%E5%A4%8D%E6%9D%82%E6%93%8D%E4%BD%9C%E3%80%82%E8%87%AA%E5%8A%A8%E5%8C%96%E7%A6%BB%E7%BA%BF%E4%BF%9D%E5%AD%98%EF%BC%8C%E6%96%B9%E4%BE%BF%E5%8F%88%E9%AB%98%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    const currentUrl = window.location.href;

    // 创建一个按钮元素
    const button = document.createElement('button');
    button.textContent = '保存到 Archive.today';
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
