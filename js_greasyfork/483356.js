// ==UserScript==
// @name         星迹 fts 自动下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于自动下载星迹共享天文台拍摄影像
// @author       FelixLiuyw
// @match        http://xjlkghz.tpddns.cn:*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483356/%E6%98%9F%E8%BF%B9%20fts%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/483356/%E6%98%9F%E8%BF%B9%20fts%20%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 下载队列
    let downloadQueue = [];
    let activeDownloads = 0;
    const maxActiveDownloads = 5; // 网站可以同时下载的数量
    const downloadTime = 120000; // 每个文件的下载时间（毫秒）1000ms = 1s

    // 当下载完成时调用
    function onDownloadComplete(downloadUrl) {
        activeDownloads--;
        console.log(`下载完成: ${downloadUrl}. 当前活跃下载数: ${activeDownloads}`);
        // 尝试开始下一个下载
        startNextDownload();
    }

    // 从队列中开始下一个下载
    function startNextDownload() {
        while (activeDownloads < maxActiveDownloads && downloadQueue.length > 0) {
            const downloadUrl = downloadQueue.shift();
            executeDownload(downloadUrl);
            activeDownloads++;
            console.log(`开始下载: ${downloadUrl}. 当前活跃下载数: ${activeDownloads}`);
        }
    }

    // 执行文件下载
    function executeDownload(downloadUrl) {
        // 创建一个不可见的 <a> 元素用于触发下载
        var link = document.createElement("a");
        link.href = downloadUrl;
        link.download = ""; // 或者设置特定文件名 link.download = "downloadedFile.fts";
        link.style.display = "none"; // 使元素不可见

        document.body.appendChild(link); // 加入到文档中
        link.click(); // 模拟用户点击下载

        // 由于安全限制，这里不能直接检测下载何时完成，我们只能假设它将会花费大约60秒
        // 设置一个定时器，假设大约60秒后下载完成，从而触发下载完成后的行为
        setTimeout(() => {
            onDownloadComplete(downloadUrl);
        }, downloadTime);

        document.body.removeChild(link); // 最后记得移除这个元素
    }

    // 创建下载按钮
    const downloadButton = document.createElement('button');
    downloadButton.innerText = '下载 .fts 文件';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '10px';
    downloadButton.style.right = '10px';
    downloadButton.style.zIndex = '9999';

    // 将按钮加入页面
    document.body.appendChild(downloadButton);

    // 按钮点击事件，开始下载队列中的所有 .fts 文件
    downloadButton.addEventListener('click', function() {
        const links = document.querySelectorAll('a[href$=".fts"]');
        downloadQueue = Array.from(links).map(link => link.href); // 将 .fts 链接加入下载队列
        startNextDownload(); // 开始下载
    });

})();