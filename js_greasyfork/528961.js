// ==UserScript==
// @name         全国团体标准PDF下载助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在全国团体标准信息平台标准详情页添加一键下载PDF按钮。处理滑动验证码后的动态内容加载。
// @author       Gemini
// @match        https://www.ttbz.org.cn/StandardManage/Detail/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ttbz.org.cn
// @downloadURL https://update.greasyfork.org/scripts/528961/%E5%85%A8%E5%9B%BD%E5%9B%A2%E4%BD%93%E6%A0%87%E5%87%86PDF%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528961/%E5%85%A8%E5%9B%BD%E5%9B%A2%E4%BD%93%E6%A0%87%E5%87%86PDF%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 主函数，用于查找元素并添加下载按钮
     * @returns {boolean} - 如果成功添加按钮或按钮已存在，则返回true，否则返回false
     */
    function addDownloadButton() {
        // 查找“查看”链接，这是我们添加按钮的锚点
        const viewLink = document.querySelector("a[onclick*='PdfFileStreamGet']");

        // 如果按钮已经存在，则无需重复添加
        if (document.getElementById('pdf-download-button')) {
            return true;
        }

        // 如果“查看”链接还未加载，则稍后重试
        if (!viewLink) {
            return false;
        }

        // 从onclick属性中提取PDF的相对路径
        const onclickAttr = viewLink.getAttribute('onclick');
        const match = onclickAttr.match(/'([^']*)'/);
        if (!match || !match[1]) {
            console.log('【PDF下载助手】: 无法从“查看”链接中提取PDF路径。');
            return false;
        }
        const pdfPath = match[1];
        const downloadUrl = 'https://www.ttbz.org.cn' + pdfPath;

        // 创建新的“一键下载PDF”按钮
        const downloadButton = document.createElement('a');
        downloadButton.id = 'pdf-download-button'; // 添加ID防止重复创建
        downloadButton.href = downloadUrl;
        downloadButton.textContent = '一键下载PDF';
        // 添加空的download属性，浏览器将自动使用服务器提供的文件名
        downloadButton.setAttribute('download', '');

        // 设置按钮样式
        downloadButton.style.marginLeft = '10px';
        downloadButton.style.color = 'white';
        downloadButton.style.backgroundColor = '#4CAF50';
        downloadButton.style.padding = '5px 10px';
        downloadButton.style.border = 'none';
        downloadButton.style.borderRadius = '4px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.textDecoration = 'none';
        downloadButton.title = '下载PDF文件';

        // 将下载按钮插入到“查看”链接的后面
        viewLink.parentNode.insertBefore(downloadButton, viewLink.nextSibling);

        console.log('【PDF下载助手】: 已成功添加PDF下载按钮。');
        return true; // 成功，可以停止轮询
    }

    // 由于网站有滑动验证码，页面内容可能是动态加载的。
    // 我们使用setInterval来反复检查“查看”按钮是否出现，以确保脚本能在正确的时间执行。
    const checkInterval = setInterval(() => {
        if (addDownloadButton()) {
            clearInterval(checkInterval); // 按钮添加成功后，清除定时器
        }
    }, 1000); // 每秒检查一次
})();