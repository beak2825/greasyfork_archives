// ==UserScript==
// @name         页面下载为html文件
// @namespace    http://your-namespace.com
// @version      0.1
// @description  Adds a floating button to download the HTML page with a renamed file
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479677/%E9%A1%B5%E9%9D%A2%E4%B8%8B%E8%BD%BD%E4%B8%BAhtml%E6%96%87%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/479677/%E9%A1%B5%E9%9D%A2%E4%B8%8B%E8%BD%BD%E4%B8%BAhtml%E6%96%87%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个悬浮按钮
    var downloadButton = document.createElement('button');
    downloadButton.textContent = 'Download Page';

    // 设置按钮的样式
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '20px';
    downloadButton.style.right = '20px';
    downloadButton.style.zIndex = '9999';

    // 添加按钮到页面
    document.body.appendChild(downloadButton);

    // 定义下载函数
    function downloadPageAndRename() {
        // 获取当前页面的HTML内容
        var htmlContent = document.documentElement.outerHTML;

        // 创建Blob对象，存储HTML内容
        var blob = new Blob([htmlContent], { type: 'text/html' });

        // 创建a标签
        var a = document.createElement('a');

        // 设置a标签的href为Blob URL
        a.href = URL.createObjectURL(blob);

        // 设置a标签的下载属性
        a.download = 'downloaded_page.html';

        // 模拟点击a标签进行下载
        a.click();
    }

    // 为按钮添加点击事件
    downloadButton.addEventListener('click', downloadPageAndRename);
})();
