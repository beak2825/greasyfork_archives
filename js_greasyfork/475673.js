// ==UserScript==
// @name         buff一键提取10个磨损值
// @namespace    https://example.com
// @version      1.0
// @description  提取网页中的文字并复制到剪贴板
// @include      https://buff.163.com/goods/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/475673/buff%E4%B8%80%E9%94%AE%E6%8F%90%E5%8F%9610%E4%B8%AA%E7%A3%A8%E6%8D%9F%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/475673/buff%E4%B8%80%E9%94%AE%E6%8F%90%E5%8F%9610%E4%B8%AA%E7%A3%A8%E6%8D%9F%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function createButton() {
        const button = document.createElement('button');
        button.textContent = '提取并复制';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.left = '300px'; // 修改为距左边框的距离
        button.style.transform = 'translateY(-30%)'; // 垂直居中对齐
        button.style.zIndex = '9999';
        button.addEventListener('click', extractAndCopyText);
        document.body.appendChild(button);
    }

    // 提取指定格式的文字并复制到剪贴板
    function extractAndCopyText() {
        const elements = document.querySelectorAll('tbody.list_tb_csgo .wear-value'); // 替换为实际的元素选择器

        let extractedText = '';
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const text = element.textContent.trim();
            const wearValue = text.substring(text.indexOf(':') + 1).trim();
            extractedText += wearValue;
            if (i !== elements.length - 1) {
                extractedText += ',';
            }
        }

        GM_setClipboard(extractedText); // 复制到剪贴板

        console.log('提取完毕，已复制到剪贴板');
    }

    createButton();
})();