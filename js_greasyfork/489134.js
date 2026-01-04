// ==UserScript==
// @name         添加按钮 HuggingFace 主站跳转到镜像站
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically re-add the stylish redirect button on HuggingFace pages using MutationObserver
// @author       nobody
// @match        *://huggingface.co/*
// @grant        none
// @run-at       document-end
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/489134/%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE%20HuggingFace%20%E4%B8%BB%E7%AB%99%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%95%9C%E5%83%8F%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/489134/%E6%B7%BB%E5%8A%A0%E6%8C%89%E9%92%AE%20HuggingFace%20%E4%B8%BB%E7%AB%99%E8%B7%B3%E8%BD%AC%E5%88%B0%E9%95%9C%E5%83%8F%E7%AB%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButtonIfNeeded() {
        // 检查按钮是否已经存在
        if (document.getElementById('mirror-redirect-button')) return;

        // 找到放置按钮的合适位置，这个选择器可能需要根据页面的实际结构进行调整
        const targetElement = document.querySelector('.container.relative h1');
        if (!targetElement) return;

        // 创建按钮并设置样式
        const button = document.createElement('button');
        button.textContent = '跳转往镜像站🚀';
        button.id = 'mirror-redirect-button';
        // 应用样式，可以是自定义的，也可以尝试复用页面上已有的样式类
        button.className = 'btn cursor-pointer text-sm flex-auto sm:flex-none'; // 假设这是页面上已有的样式类
        button.style.marginLeft = '10px'; // 可选的，根据需要调整样式
        button.onclick = function() {
            window.location.href = window.location.href.replace('huggingface.co', 'hf-mirror.com');
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
