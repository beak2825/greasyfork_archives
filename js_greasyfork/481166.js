// ==UserScript==
// @name         王者荣耀生成台词文本
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  王者荣耀台词网站生成台词文本，方便查看和下载。
// @author       You
// @match        https://world.honorofkings.com/*
// @match        https://pvp.qq.com/ip/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=honorofkings.com
// @grant        none
// @license      GPL-3.0-or-later

// @downloadURL https://update.greasyfork.org/scripts/481166/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E7%94%9F%E6%88%90%E5%8F%B0%E8%AF%8D%E6%96%87%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/481166/%E7%8E%8B%E8%80%85%E8%8D%A3%E8%80%80%E7%94%9F%E6%88%90%E5%8F%B0%E8%AF%8D%E6%96%87%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function generateQuotesText() {
        const voiceItems = document.querySelectorAll('.dinfo-voice-item');
        let quotesText = '';

        voiceItems.forEach((voiceItem, index) => {
            const speechText = voiceItem.querySelector('span').textContent.trim();
            quotesText += `${index + 1}. ${speechText}\n`;
        });

        // 创建文本框
        const textArea = document.createElement('textarea');
        textArea.value = quotesText;
        textArea.style.width = '100%';
        textArea.style.height = '200px';
        textArea.readOnly = true;

        // 创建下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载为txt文件';
        downloadButton.style.marginTop = '10px';
        downloadButton.addEventListener('click', () => {
            const blob = new Blob([quotesText], { type: 'text/plain' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'quotes.txt';
            link.click();
        });

        // 将文本框和按钮添加到页面
        const container = document.createElement('div');
        container.appendChild(textArea);
        container.appendChild(downloadButton);

        // 将容器添加到页面
        document.body.appendChild(container);
    }

    // 创建一键生成和下载按钮
    const generateAndDownloadButton = document.createElement('button');
    generateAndDownloadButton.textContent = '在网站底部生成台词文本';
    generateAndDownloadButton.style.position = 'fixed';
    generateAndDownloadButton.style.top = '50px';
    generateAndDownloadButton.style.left = '10px';
    generateAndDownloadButton.style.zIndex = '999'; // 添加 z-index
    generateAndDownloadButton.style.border = '1px solid #e4c289';
    generateAndDownloadButton.style.color = '#e4c289';
    generateAndDownloadButton.style.background = '#151515';
    generateAndDownloadButton.style.padding = '0.5em 1em';
    generateAndDownloadButton.addEventListener('click', generateQuotesText);

    // 将按钮添加到页面
    document.body.appendChild(generateAndDownloadButton);
})();
