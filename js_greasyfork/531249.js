// ==UserScript==
// @name         Amazon ASIN Scraper with Button
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  爬取亚马逊搜索页面的 ASIN，并添加运行按钮
// @author       You
// @match        https://www.amazon.com/s*
// @grant        clipboardWrite
// @downloadURL https://update.greasyfork.org/scripts/531249/Amazon%20ASIN%20Scraper%20with%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/531249/Amazon%20ASIN%20Scraper%20with%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getASINs() {
        const asinElements = document.querySelectorAll('[data-asin]');
        const asins = [];

        asinElements.forEach(element => {
            const asin = element.getAttribute('data-asin');
            if (asin && asin !== "") {
                asins.push(asin);
            }
        });

        return asins;
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback();
        }).catch(err => {
            console.error('复制失败:', err);
        });
    }

    function showCopyFeedback() {
        const feedback = document.createElement('div');
        feedback.textContent = '已复制!';
        feedback.style.position = 'fixed';
        feedback.style.top = '110px';
        feedback.style.left = '10px';
        feedback.style.backgroundColor = '#232F3E';
        feedback.style.color = 'white';
        feedback.style.padding = '8px 15px';
        feedback.style.borderRadius = '4px';
        feedback.style.zIndex = '99999';
        feedback.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(feedback);

        setTimeout(() => {
            feedback.remove();
        }, 1500);
    }

    function displayASINs(asins) {
        let outputDiv = document.getElementById('asin-output');

        if (!outputDiv) {
            outputDiv = document.createElement('div');
            outputDiv.id = 'asin-output';
            outputDiv.style.cssText = `
                position: fixed;
                top: 70px;
                left: 10px;
                background-color: white;
                border: 1px solid #DDD;
                border-radius: 4px;
                padding: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                z-index: 9999;
                font-family: Arial, sans-serif;
                max-height: 70vh;
                overflow-y: auto;
            `;
            document.body.appendChild(outputDiv);
        } else {
            outputDiv.innerHTML = '';
        }

        // 添加复制按钮
        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制结果';
        copyBtn.style.cssText = `
            background-color: #232F3E;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 15px;
            margin-bottom: 12px;
            cursor: pointer;
            font-family: 'Amazon Ember', Arial, sans-serif;
            transition: background-color 0.3s;
        `;
        copyBtn.addEventListener('click', () => {
            copyToClipboard(asins.join('\n'));
        });
        outputDiv.appendChild(copyBtn);

        // 添加结果计数
        const countInfo = document.createElement('div');
        countInfo.textContent = `找到 ${asins.length} 个ASIN:`;
        countInfo.style.cssText = `
            color: #666;
            font-size: 14px;
            margin-bottom: 10px;
        `;
        outputDiv.appendChild(countInfo);

        const asinList = document.createElement('ul');
        asinList.style.cssText = `
            margin: 0;
            padding: 0;
            list-style: none;
            font-size: 14px;
        `;

        asins.forEach(asin => {
            const listItem = document.createElement('li');
            listItem.textContent = asin;
            listItem.style.cssText = `
                padding: 8px 0;
                margin: 4px 0;
                border-bottom: 1px solid #EEE;
                line-height: 1.5;
            `;
            asinList.appendChild(listItem);
        });

        outputDiv.appendChild(asinList);
    }

    function createButton() {
        const button = document.createElement('button');
        button.textContent = '抓取当前页ASIN';

        button.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            background-color: #FF9900;
            color: white;
            border: 1px solid #E88834;
            border-radius: 4px;
            padding: 10px 20px;
            font-weight: bold;
            cursor: pointer;
            font-family: 'Amazon Ember', Arial, sans-serif;
            transition: background-color 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            font-size: 14px;
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#FF8F00';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#FF9900';
        });

        button.addEventListener('click', () => {
            const asins = getASINs();
            displayASINs(asins);
        });

        document.body.appendChild(button);
    }

    createButton();
})();