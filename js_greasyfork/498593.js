// ==UserScript==
// @name         Copy Data to Clipboard for mooc1-api.chaoxing.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Copy collected data to clipboard for mooc1-api.chaoxing.com
// @author       laijiahao
// @match        *://mooc1-api.chaoxing.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498593/Copy%20Data%20to%20Clipboard%20for%20mooc1-apichaoxingcom.user.js
// @updateURL https://update.greasyfork.org/scripts/498593/Copy%20Data%20to%20Clipboard%20for%20mooc1-apichaoxingcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮到页面
    const button = document.createElement('button');
    button.innerText = '复制数据到剪贴板';
    button.id = 'copyButton';
    document.body.appendChild(button);

    // 添加按钮样式
    GM_addStyle(`
        #copyButton {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 1000;
            padding: 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        #copyButton:hover {
            background-color: #45a049;
        }
    `);

    // 模拟 obj 对象
    const obj = [
        // 你的数据对象
    ];

    // 按钮点击事件
    button.addEventListener('click', () => {
        let allData = '';
        const obj = document.getElementsByClassName('marBom60');

        for (const doc of obj) {
            const markNameElement = doc.getElementsByClassName('mark_name')[0];
            const colorGreenContent = doc.getElementsByClassName('colorGreen')[0].innerText.match(/[A-Za-z]/g).join('');

            const matches = markNameElement.innerText.match(/\((.*?)\)/g); // 找到所有匹配的括号对
            if (matches) {
                const lastMatch = matches[matches.length - 1]; // 取最后一个匹配项
                const newText = markNameElement.innerText.replace(lastMatch, `(${colorGreenContent})`); // 替换最后一个匹配项
                allData += newText + '\n'; // 收集替换后的文本
            }

            allData += doc.getElementsByClassName('mark_letter')[0].innerText + '\n';
            allData += doc.getElementsByClassName('colorGreen')[0].innerText + '\n';
        }

        // 打印所有数据
        console.log(allData);

        // 将所有数据复制到剪贴板
        GM_setClipboard(allData);
        alert('数据已复制到剪贴板');
    });
})();