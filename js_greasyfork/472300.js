// ==UserScript==
// @name         提取IP端口
// @namespace    
// @version      0.1
// @description  test
// @author       You
// @license MIT
// @match        https://www.zoomeye.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472300/%E6%8F%90%E5%8F%96IP%E7%AB%AF%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/472300/%E6%8F%90%E5%8F%96IP%E7%AB%AF%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    const button = document.createElement('button');
    button.innerHTML = '提取IP:端口';
    button.style.position = 'fixed';
    button.style.bottom = '60px';
    button.style.right = '20px';
    button.style.zIndex = '9999';

    // 添加按钮到页面
    document.body.appendChild(button);

    // 按钮点击事件处理函数
    button.addEventListener('click', function() {
        const ipAddresses = [];

        // 获取所有class为"search-result-item-info"的<div>标签
        const searchResultInfos = document.querySelectorAll('div.search-result-item-info');

        // 遍历所有搜索结果项
        for (const info of searchResultInfos) {
            // 在每个搜索结果项中查找包含IP和端口信息的<a>标签
            const link = info.querySelector('a[href*="http://"]');

            if (link) {
                // 获取链接的href属性值，然后提取出其中的IP和端口信息
                const href = link.href;
                const match = href.match(/http:\/\/([\d.]+):(\d+)/);
                if (match) {
                    const ip = match[1];
                    const port = match[2];
                    const ipAddress = `${ip}:${port}`;
                    ipAddresses.push(ipAddress);
                }
            }
        }

        // 复制提取到的IP地址到剪贴板
        if (ipAddresses.length > 0) {
            const ipAddressesText = ipAddresses.join('\n');
            copyToClipboard(ipAddressesText);
        }
    });

    // 复制文本到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed'; // 使元素不可见
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
})();
