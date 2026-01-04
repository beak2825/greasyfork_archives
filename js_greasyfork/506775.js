// ==UserScript==
// @name         URL 输入到 iframe
// @version      1.0
// @description  在页面顶部添加 URL 输入框，点击“访问”按钮后在 iframe 中显示输入的 URL
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/506775/URL%20%E8%BE%93%E5%85%A5%E5%88%B0%20iframe.user.js
// @updateURL https://update.greasyfork.org/scripts/506775/URL%20%E8%BE%93%E5%85%A5%E5%88%B0%20iframe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个 URL 输入框和按钮的容器
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.backgroundColor = '#fff';
    container.style.borderBottom = '1px solid #ddd';
    container.style.zIndex = '9999';
    container.style.padding = '10px';
    container.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    // 创建输入框
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '输入 URL';
    input.style.flex = '1';
    input.style.marginRight = '10px';
    input.style.padding = '5px';
    container.appendChild(input);

    // 创建“访问”按钮
    const button = document.createElement('button');
    button.textContent = '访问';
    button.style.padding = '5px 10px';
    container.appendChild(button);

    // 创建 iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.display = 'none';
    iframe.style.zIndex = '9998';  // 确保 iframe 在输入容器下方
    document.body.appendChild(iframe);

    // 将容器添加到页面中
    document.body.appendChild(container);

    // 处理按钮点击事件，显示 iframe 并加载 URL
    button.addEventListener('click', function() {
        const url = input.value.trim();
        if (url) {
            iframe.src = url;
            iframe.style.display = 'block';
            container.style.display = 'none';
        }
    });

    // 处理 iframe 点击事件，隐藏 iframe 并显示输入容器
    iframe.addEventListener('click', function() {
        iframe.style.display = 'none';
        container.style.display = 'flex';  // 确保恢复为 flex 以保持布局
    });
})();
