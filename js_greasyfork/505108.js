// ==UserScript==
// @name         IPTV Content Extractor
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  提取并复制IPTV源列表、源地址
// @author       zephyr
// @match        http://www.foodieguide.com/iptvsearch*
// @match        http://foodieguide.com/iptvsearch*
// @match        http://tonkiang.us/*
// @match        https://www.foodieguide.com/iptvsearch*
// @match        https://foodieguide.com/iptvsearch*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/505108/IPTV%20Content%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/505108/IPTV%20Content%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #copyButton {
            position: fixed;
            top: 40px;
            right: 20px;
            padding: 10px 15px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 1000;
        }
        #copyButton:hover {
            background-color: #45a049;
        }
    `);

    // 创建并插入按钮
    const button = document.createElement('button');
    button.id = 'copyButton';
    button.innerText = '一键复制提取内容';
    document.body.appendChild(button);

    // 按钮点击事件
    button.addEventListener('click', function() {
        // 创建一个Set来保存提取的数据
        let extractedData = new Set();

        // 获取所有 resultplus 或 result 元素
        document.querySelectorAll('div.resultplus, div.result').forEach(resultDiv => {

            // 提取频道名称
            const channelDiv = resultDiv.querySelector('div.channel a div');
            const title = channelDiv ? channelDiv.textContent.trim() : '未知频道';

            // 提取地址: 优先定位到 b 标签的文本（用于提取 IP 地址或其他文本），跳过 <img>
            const aTag = resultDiv.querySelector('div.channel > a');
            let address = '';

            if (aTag) {
                const bTag = aTag.querySelector('b');
                if (bTag) {
                    address = [...bTag.childNodes]
                        .filter(node => node.nodeType === Node.TEXT_NODE)  // 只保留文本节点
                        .map(node => node.textContent.trim())  // 去除空格
                        .join('');  // 合并所有文本
                }
            }

            // 提取第二个 tba 或第二个 td
            let secondValue = '';
            const tbaElements = resultDiv.querySelectorAll('tba');
            if (tbaElements.length >= 2) {
                secondValue = tbaElements[1].textContent.trim();
            } else {
                const tdElements = resultDiv.querySelectorAll('td');
                if (tdElements.length >= 2) {
                    secondValue = tdElements[1].textContent.trim();
                }
            }

            // 如果频道名称和URL都存在，则按指定格式添加到Set中
            if (title && (address || secondValue)) {
                extractedData.add(`${title},${address || secondValue}`);
            }
        });

        // 将Set中的数据拼接成最终的字符串，每行一个频道
        const finalData = Array.from(extractedData).join('\n');

        // 复制到剪贴板
        GM_setClipboard(finalData);

        // 通知用户
        alert('提取内容已复制到剪贴板!');
    });

})();
