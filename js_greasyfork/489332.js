// ==UserScript==
// @name         添加按钮镜像站跳转回 HuggingFace 主站
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically add a button to redirect from the mirror site back to the original HuggingFace page
// @author       nobody
// @match        *://hf-mirror.com/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/489332/%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE%E9%95%9C%E5%83%8F%E7%AB%99%E8%B7%B3%E8%BD%AC%E5%9B%9E%20HuggingFace%20%E4%B8%BB%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/489332/%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE%E9%95%9C%E5%83%8F%E7%AB%99%E8%B7%B3%E8%BD%AC%E5%9B%9E%20HuggingFace%20%E4%B8%BB%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButtonIfNeeded() {
        // 检查按钮是否已经存在
        if (document.getElementById('hf-redirect-button')) return;

        // 找到放置按钮的合适位置
        const targetElement = document.querySelector('.container.relative h1');
        if (!targetElement) return;

        // 创建按钮并设置样式
        const button = document.createElement('button');
        button.textContent = '跳转返回主站🏙';
        button.id = 'hf-redirect-button';
        // 应用样式，可以是自定义的，也可以尝试复用页面上已有的样式类
        button.className = 'btn cursor-pointer text-sm flex-auto sm:flex-none'; // 假设这是页面上已有的样式类
        button.style.marginLeft = '10px'; // 可选的，根据需要调整样式
        button.onclick = function() {
            window.location.href = window.location.href.replace('hf-mirror.com', 'huggingface.co');
        };

        // 将按钮添加到页面上
        targetElement.appendChild(button);
    }

    // 创建MutationObserver实例来监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                addButtonIfNeeded();
            }
        });
    });

    // 配置观察器选项：子节点的变动
    const config = { childList: true, subtree: true };

    // 开始监听document.body的变化
    observer.observe(document.body, config);

    // 页面初次加载时尝试添加按钮
    addButtonIfNeeded();
})();
