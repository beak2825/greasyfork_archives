// ==UserScript==
// @name         zhihu download images and record links
// @name:zh-CN   知乎下载图片、文章
// @namespace    http://yourwebsite.com
// @version      1.1
// @license      MIT
// @description  Download images and videos from new version zhihu UI webpage.
// @description:zh-CN 循环打开页面链接
// @author       mike
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/477642/zhihu%20download%20images%20and%20record%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/477642/zhihu%20download%20images%20and%20record%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 等待页面加载完毕
    window.addEventListener('load', function() {
        // 获取包含文本内容的<div>元素
        var title ="";
        var titleDiv = document.querySelector('.QuestionHeader-title');
        var articleDiv = document.querySelector('div.RichContent-inner');
        // 检查是否找到了div元素
        if (titleDiv) {
            title=titleDiv.textContent;
        }
        if (articleDiv) {
            // 获取div内的文本内容
            const textContent = articleDiv.textContent;
            // 使用正则表达式去除 <img> 标签
            const textWithoutImages = textContent.replace(/<img[^>]*>/g, '');
            console.log('文章标题:', title);
            // 创建一个Blob对象并保存到本地文件
            var blob = new Blob(['标题：'+title+'回答：'+textWithoutImages], { type: 'text/plain' });
            var a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'text_content.txt'; // 文件名
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } else {
            console.log('找不到文章内容的div元素');
        }
        var articleDiv2 = document.querySelector('div.Post-RichTextContainer');
        // 检查是否找到了div元素
        if (articleDiv2) {
            // 获取div内的文本内容
            const textContent = articleDiv2.textContent;
            // 使用正则表达式去除 <img> 标签
            const textWithoutImages = textContent.replace(/<img[^>]*>/g, '');
            console.log('文章内容:', textWithoutImages);
            // 创建一个Blob对象并保存到本地文件
            var blob2 = new Blob([textWithoutImages], { type: 'text/plain' });
            var a2 = document.createElement('a');
            a2.href = window.URL.createObjectURL(blob2);
            a2.download = 'text_content.txt'; // 文件名
            a2.style.display = 'none';
            document.body.appendChild(a2);
            a2.click();
            document.body.removeChild(a2);
        } else {
            console.log('找不到文章内容的div元素');
        }
    });

})();


