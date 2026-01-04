// ==UserScript==
// @name         [linuxdo]隐藏狗粮帖
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide posts with the "狗粮" tag
// @author       Ferrari
// @match        *://*.linux.do/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linux.do
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497711/%5Blinuxdo%5D%E9%9A%90%E8%97%8F%E7%8B%97%E7%B2%AE%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/497711/%5Blinuxdo%5D%E9%9A%90%E8%97%8F%E7%8B%97%E7%B2%AE%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isVisible = false; // 初始状态设置为不可见

    // 定义隐藏特定<tr>元素的函数
    function applyVisibilityToTr() {
        let trElements = document.querySelectorAll('tr');

        trElements.forEach(function(tr) {
            if (tr.classList.contains('tag-狗粮') ||
                tr.classList.contains('狗粮')) {
                // 根据isVisible变量来隐藏或显示<tr>
                tr.style.display = isVisible ? '' : 'none';
            }
        });
    }

    // 创建显示/隐藏按钮
    function createToggleButton() {
        let toggleButton = document.createElement('button');
        toggleButton.innerHTML = '显示狗粮帖';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '20px';
        toggleButton.style.right = '20px';
        toggleButton.style.zIndex = 1000;

        toggleButton.addEventListener('click', function() {
            // 切换isVisible状态
            isVisible = !isVisible;
            // 更新按钮的文本
            toggleButton.innerHTML = isVisible ? '隐藏狗粮帖' : '显示狗粮帖';
            // 重新应用隐藏逻辑
            applyVisibilityToTr();
        });

        document.body.appendChild(toggleButton);
    }

    // 使用MutationObserver API来监听DOM的变化
    const observer = new MutationObserver(mutations => {
        applyVisibilityToTr();
    });

    // 配置和启动observer
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始化隐藏逻辑
    createToggleButton();
    applyVisibilityToTr();
})();