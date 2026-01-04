// ==UserScript==
// @name         Saylor 提取考试内容及复制展示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 https://learn.saylor.org/ 页面添加红色提取题目按钮，点击后查找所有 <div class="formulation clearfix"> 元素，将其文本内容提取并在页面中间弹窗展示，弹窗宽度为 500px，同时提供复制和关闭功能，点击按钮后还会点击 <span class="edw-icon edw-icon-Cancel"></span> 元素，并隐藏 <div class="state">、<div class="grade"> 和带有 questionflag editable 类的 div 元素
// @author       3588
// @match        https://learn.saylor.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525233/Saylor%20%E6%8F%90%E5%8F%96%E8%80%83%E8%AF%95%E5%86%85%E5%AE%B9%E5%8F%8A%E5%A4%8D%E5%88%B6%E5%B1%95%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525233/Saylor%20%E6%8F%90%E5%8F%96%E8%80%83%E8%AF%95%E5%86%85%E5%AE%B9%E5%8F%8A%E5%A4%8D%E5%88%B6%E5%B1%95%E7%A4%BA.meta.js
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
    extractButton.style.backgroundColor = 'red';
    extractButton.style.color = 'white';
    document.body.appendChild(extractButton);

    extractButton.addEventListener('click', function () {
        // 点击提取题目按钮后隐藏该按钮
        extractButton.style.display = 'none';

        // 查找所有 <div class="formulation clearfix"> 元素
        const targetDivs = document.querySelectorAll('div.formulation.clearfix');

        if (targetDivs.length > 0) {
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
            // 限制弹窗宽度为 500px
            displayWindow.style.width = '500px';
            displayWindow.style.overflowY = 'auto';

            let allText = '';
            targetDivs.forEach((div) => {
                const textContent = div.textContent;
                const lines = textContent.split('\n').filter(line => line.trim()!== '');
                const formattedText = lines.join('\n');
                allText += formattedText + '\n\n';
            });

            // 创建文本显示区域
            const textArea = document.createElement('pre');
            textArea.textContent = allText;
            displayWindow.appendChild(textArea);

            // 创建复制按钮
            const copyButton = document.createElement('button');
            copyButton.textContent = '复制';
            copyButton.style.marginRight = '10px';
            copyButton.addEventListener('click', function () {
                const tempTextArea = document.createElement('textarea');
                tempTextArea.value = allText;
                document.body.appendChild(tempTextArea);
                tempTextArea.select();
                document.execCommand('copy');
                document.body.removeChild(tempTextArea);
            });
            displayWindow.appendChild(copyButton);

            // 创建关闭按钮
            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.addEventListener('click', function () {
                displayWindow.remove();
                // 关闭窗口后重新显示提取题目按钮
                extractButton.style.display = 'block';
            });
            displayWindow.appendChild(closeButton);

            // 将显示窗口添加到页面
            document.body.appendChild(displayWindow);
        }

        // 查找并点击 <span class="edw-icon edw-icon-Cancel"></span> 元素
        const cancelSpans = document.querySelectorAll('span.edw-icon.edw-icon-Cancel');
        cancelSpans.forEach(span => {
            span.click();
        });

        // 隐藏指定的 div 元素
        const stateDivs = document.querySelectorAll('div.state');
        const gradeDivs = document.querySelectorAll('div.grade');
        const questionFlagDivs = document.querySelectorAll('div.questionflag.editable');

        stateDivs.forEach(div => {
            div.style.display = 'none';
        });

        gradeDivs.forEach(div => {
            div.style.display = 'none';
        });

        questionFlagDivs.forEach(div => {
            div.style.display = 'none';
        });
    });
})();