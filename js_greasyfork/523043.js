// ==UserScript==
// @name         淘宝商品名称提取
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  提取淘宝商品页面上的特定名称并复制到剪贴板
// @author       luofuchang + Gemini
// @match        https://item.taobao.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523043/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E5%90%8D%E7%A7%B0%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/523043/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E5%90%8D%E7%A7%B0%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let extracted = false;

    function extractAndCopy() {
        if (extracted) return;

        const selector = '[class*="valueItem"][class*="GzWd2LsV"] span[class*="valueItemText"]';

        const elements = document.querySelectorAll(selector);

        if (elements.length === 0) {
            alert("没有找到对应的元素，请检查选择器!");
            console.error("使用 selector：", selector);
            return;
        }

        extracted = true;

        let names = [];
        elements.forEach(element => {
            const text = element.textContent.trim();
            if (text) {
                names.push(text);
            }
        });

        if (names.length === 0) {
            alert("没有找到任何名称。");
            return;
        }

        const resultText = names.join('\r\n');

        // 创建一个临时的 textarea 元素
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = resultText;
        document.body.appendChild(tempTextarea);

        // 选中并复制文本
        tempTextarea.select();
        document.execCommand('copy');

        // 移除临时的 textarea 元素
        document.body.removeChild(tempTextarea);

        alert('内容已复制到剪切板');
    }

    let button = document.createElement('button');
    button.textContent = '提取商品名称并复制';
    button.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 9999;
        padding: 8px 16px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
    button.addEventListener('click', extractAndCopy);
    document.body.appendChild(button);

    GM_addStyle(`
        [class*="valueItem"][class*="GzWd2LsV"] {
            border: 1px solid red;
            margin: 2px;
            display: inline-block;
        }
        [class*="valueItem"][class*="GzWd2LsV"] span[class*="valueItemText"]{
            padding: 5px;
        }
    `);
})();