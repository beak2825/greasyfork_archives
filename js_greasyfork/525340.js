// ==UserScript==
// @name         Sophia计分考试提取题目工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在https://app.sophia.org/页面添加提取题目按钮，点击后提取所有<div class="question-body">内容，先删除所有<div class="assessment-two-cols__right">元素，过滤提取内容中的换行符后直接复制，展示在弹窗，按钮居中放置在窗口顶部，点击关闭可关闭所有自己创建的窗口，弹窗展示 2 秒后自动关闭
// @author       3588
// @match        https://app.sophia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525340/Sophia%E8%AE%A1%E5%88%86%E8%80%83%E8%AF%95%E6%8F%90%E5%8F%96%E9%A2%98%E7%9B%AE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/525340/Sophia%E8%AE%A1%E5%88%86%E8%80%83%E8%AF%95%E6%8F%90%E5%8F%96%E9%A2%98%E7%9B%AE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建提取题目按钮
    const extractButton = document.createElement('button');
    extractButton.textContent = '提取题目';
    extractButton.style.position = 'fixed';
    extractButton.style.top = '50%';
    extractButton.style.left = '50%';
    extractButton.style.transform = 'translate(-50%, -50%)';
    extractButton.style.backgroundColor = 'yellow';
    // 为按钮添加边框样式
    extractButton.style.border = '2px solid #333';
    extractButton.style.borderRadius = '5px';
    document.body.appendChild(extractButton);

    // 用于存储所有创建的显示窗口
    const createdWindows = [];

    extractButton.addEventListener('click', function () {
        // 删除所有<div class="assessment-two-cols__right">元素
        const elementsToRemove = document.querySelectorAll('div.assessment-two-cols__right');
        elementsToRemove.forEach((element) => {
            element.parentNode.removeChild(element);
        });

        // 查找所有<div class="question-body">元素
        const questionBodies = document.querySelectorAll('div.question-body');
        let allText = '';

        // 遍历元素，将文本内容拼接起来
        questionBodies.forEach((body) => {
            allText += body.textContent;
        });

        // 过滤换行符
        allText = allText.replace(/[\r\n]/g, '');

        // 直接复制提取的内容
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = allText;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);

        // 创建显示窗口
        const displayWindow = document.createElement('div');
        displayWindow.style.position = 'fixed';
        displayWindow.style.top = '50%';
        displayWindow.style.left = '50%';
        displayWindow.style.transform = 'translate(-50%, -50%)';
        displayWindow.style.backgroundColor = 'white';
        displayWindow.style.padding = '20px';
        displayWindow.style.border = '1px solid #ccc';
        displayWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        displayWindow.style.zIndex = '9999';
        displayWindow.style.width = '500px';
        displayWindow.style.maxHeight = '80vh';
        displayWindow.style.overflowY = 'auto';
        displayWindow.style.wordBreak = 'break-all';

        // 创建按钮容器，用于将按钮居中放到窗口顶部
        const buttonContainer = document.createElement('div');
        buttonContainer.style.textAlign = 'center';
        buttonContainer.style.marginBottom = '10px';

        // 创建关闭按钮
        const closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.addEventListener('click', function () {
            createdWindows.forEach((window) => {
                if (window.parentNode) {
                    window.parentNode.removeChild(window);
                }
            });
            // 清空存储的窗口数组
            createdWindows.length = 0;
        });
        buttonContainer.appendChild(closeButton);

        // 先将按钮容器添加到显示窗口
        displayWindow.appendChild(buttonContainer);

        // 创建文本显示区域
        const textArea = document.createElement('pre');
        textArea.textContent = allText;
        textArea.style.whiteSpace = 'pre-wrap';
        displayWindow.appendChild(textArea);

        // 将显示窗口添加到页面
        document.body.appendChild(displayWindow);
        // 将当前创建的窗口添加到存储数组中
        createdWindows.push(displayWindow);

        // 2 秒后自动关闭窗口
        setTimeout(() => {
            createdWindows.forEach((window) => {
                if (window.parentNode) {
                    window.parentNode.removeChild(window);
                }
            });
            // 清空存储的窗口数组
            createdWindows.length = 0;
        }, 2000);
    });
})();