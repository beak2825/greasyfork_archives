// ==UserScript==
// @name         动漫链接转换及迅雷下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  读取列表链接并转换为磁力链接，添加迅雷一键下载按钮
// @author       1010n111
// @match        https://www.kisssub.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532164/%E5%8A%A8%E6%BC%AB%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%8F%8A%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/532164/%E5%8A%A8%E6%BC%AB%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E5%8F%8A%E8%BF%85%E9%9B%B7%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建一个按钮
    const downloadButton = document.createElement('button');
    downloadButton.textContent = '迅雷一键下载';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '10px';
    downloadButton.style.right = '10px';
    document.body.appendChild(downloadButton);

    // 处理按钮点击事件
    downloadButton.addEventListener('click', function () {
        // 假设列表项是 <a> 标签，根据实际网页结构修改
        const links = document.querySelectorAll('#data_list > tr > td:nth-child(3) > a');
        //把links用convertToMagnetLink全部转换为磁力链接,并把每个磁力链接 每行一个拼接,复制到剪切板
        let magnetLinks = '';
        links.forEach(function (link) {
            const href = link.href;
            // 这里需要根据你的实际情况将链接转换为磁力链接，以下是一个简单示例，实际转换逻辑需根据具体情况实现
            const magnetLink = convertToMagnetLink(href);
            if (magnetLink) {
                magnetLinks += magnetLink + '\n';
            }
        })
        // 复制到剪切板
        navigator.clipboard.writeText(magnetLinks);
        alert('磁力链接已复制到剪切板');
    });


    function extractIdFromUrl(url) {
        // 使用正则表达式匹配 'show-' 后面的字符串，直到 '.html'
        const match = url.match(/show-([a-f0-9]+)\.html/);

        // 如果匹配成功，返回匹配的字符串，否则返回null
        return match ? match[1] : null;
    }

    // 这里只是一个示例的转换函数，实际的转换逻辑可能很复杂
    function convertToMagnetLink(url) {
        const id = extractIdFromUrl(url);
        if (id) {
            // 使用提取的ID构造磁力链接
            return `magnet:?xt=urn:btih:${id}`;
        }
        return null;
    }
})();


