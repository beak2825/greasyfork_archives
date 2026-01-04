// ==UserScript==
// @name        下载番茄小说
// @namespace    http://yourwebsite.com
// @version      1.1.4
// @license MIT
// @description  下载番茄小说章节内容，仅支持章节
// @author       鸡景行
// @connect      novel.snssdk.com
// @match        *://*.fanqienovel.com/reader/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/480179/%E4%B8%8B%E8%BD%BD%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/480179/%E4%B8%8B%E8%BD%BD%E7%95%AA%E8%8C%84%E5%B0%8F%E8%AF%B4.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function downloadNovelContent() {
        // 获取当前页面的URL
        let currentUrl = window.location.href;

        // 提取URL中的ID，假设ID位于URL的最后一个斜杠之后
        let id = currentUrl.substring(currentUrl.lastIndexOf('/') + 1);
        id = id.split('?')[0];
        // 构建新的API URL
        let apiUrl = `https://novel.snssdk.com/api/novel/book/reader/full/v1/?device_platform=android&parent_enterfrom=novel_channel_search.tab.&aid=2329&platform_id=1&group_id=0&item_id=${id}`;

        // 发送HTTP请求获取数据
        GM_xmlhttpRequest({
            method: 'GET',
            url: apiUrl,
            onload: function(response) {
                let jsonData = JSON.parse(response.responseText);
                let content = jsonData.data.content;

                // 创建一个虚拟DOM以解析HTML内容
                let parser = new DOMParser();
                let htmlDoc = parser.parseFromString(content, 'text/html');

                // 获取章节标题
                let titleElement = htmlDoc.querySelector('.tt-title');
                let chapterTitle = titleElement ? titleElement.textContent.trim() : 'Untitled';

                // 获取文章内容
                let articleElement = htmlDoc.querySelector('article');
                let articleContent = articleElement ? articleElement.textContent : '';

                // 替换不需要的元素为换行符
                articleContent = articleContent.replace(/<\/div>|<\/p>/g, '\n');
                articleContent = chapterTitle + " " + articleContent
                // 创建一个 Blob 对象
                let blob = new Blob([articleContent], { type: 'text/plain' });

                // 创建下载链接
                let url = URL.createObjectURL(blob);

                // 创建下载按钮并触发点击
                let downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `${chapterTitle}.txt`; // 使用章节标题作为文件名
                downloadLink.style.display = 'none';
                document.body.appendChild(downloadLink);
                downloadLink.click();

                // 释放 Blob 对象的URL
                URL.revokeObjectURL(url);
            },
            onerror: function(error) {
                console.error('发生错误：', error);
            }
        });
    }

    // 添加齿轮菜单
    GM_registerMenuCommand("下载小说内容", downloadNovelContent);
})();
