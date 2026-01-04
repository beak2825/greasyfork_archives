// ==UserScript==
// @name         自动搜索和下载青岛市产权交易相关内容
// @namespace    your-namespace
// @version      1.0
// @description  自动搜索和下载青岛市产权交易的最新相关内容并保存至指定文件夹
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479798/%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%92%8C%E4%B8%8B%E8%BD%BD%E9%9D%92%E5%B2%9B%E5%B8%82%E4%BA%A7%E6%9D%83%E4%BA%A4%E6%98%93%E7%9B%B8%E5%85%B3%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/479798/%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E5%92%8C%E4%B8%8B%E8%BD%BD%E9%9D%92%E5%B2%9B%E5%B8%82%E4%BA%A7%E6%9D%83%E4%BA%A4%E6%98%93%E7%9B%B8%E5%85%B3%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 目标搜索关键词
    const keyword = '青岛市产权交易';

    // 目标文件夹
    const saveFolder = 'E:\青岛市产权交易最新文件';

    // 搜索引擎的URL模板
    const searchEngineUrl = 'https://www.baidu.com/s?wd={keyword}';

    // 获取搜索结果页面
    function getSearchResultPage(url, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                callback(response.responseText);
            }
        });
    }

    // 解析搜索结果页面，获取相关链接
    function parseSearchResultPage(pageHTML) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageHTML, 'text/html');
        const results = doc.querySelectorAll('.result .t a');

        let downloadLinks = [];
        results.forEach(function(result) {
            const link = result.href;
            if (link) {
                downloadLinks.push(link);
            }
        });

        return downloadLinks;
    }

    // 下载指定链接并保存到目标文件夹
    function downloadAndSave(url, savePath, filename) {
        GM_download({
            url: url,
            name: filename,
            saveAs: savePath
        });
    }

    // 启动搜索和下载流程
    function start() {
        const searchUrl = searchEngineUrl.replace('{keyword}', encodeURIComponent(keyword));

        getSearchResultPage(searchUrl, function(searchResultPage) {
            const downloadLinks = parseSearchResultPage(searchResultPage);
            downloadLinks.forEach(function(link, index) {
                const downloadFilename = 'file' + index + '.html'; // 可根据需求修改文件名
                downloadAndSave(link, saveFolder, downloadFilename);
            });
        });
    }

    // 启动脚本
    start();

})();