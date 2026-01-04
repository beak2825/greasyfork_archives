// ==UserScript==
// @name         toutiao download images and record links
// @name:zh-CN    头条下载图片，头条记录已访问链接并添加readed类
// @namespace    http://yourwebsite.com
// @version      1.2
// @license      MIT
// @description  记录已访问链接并为它们添加readed类
// @author       Your Name
// @match        https://www.toutiao.com*
// @match        https://www.toutiao.com/w/*
// @match        https://www.toutiao.com/article*
// @match        https://www.toutiao.com/trending*
// @grant        GM_addStyle
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/477228/toutiao%20download%20images%20and%20record%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/477228/toutiao%20download%20images%20and%20record%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 等待页面加载完毕
    window.addEventListener('load', function() {
        // 获取包含文本内容的<div>元素 找到div元素
        const articleDiv = document.querySelector('div.article-content');
        if (articleDiv==null) {
            const articleDiv = document.querySelector('div.article');
        }
        // 检查是否找到了div元素
        if (articleDiv) {
            // 获取div内的文本内容
            const textContent = articleDiv.textContent;
            console.log('文章内容:', textContent);
            // 创建一个Blob对象并保存到本地文件
            var blob = new Blob([textContent], { type: 'text/plain' });
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

        // 获取所有链接
        var links = document.querySelectorAll('a.article-item');
        // 从localStorage中获取已访问链接的列表
        var visitedLinks = JSON.parse(localStorage.getItem('visitedLinks')) || [];
        // 遍历所有链接
        links.forEach(function(link) {
            var href = link.href;
            // 检查链接是否已经访问过
            if (visitedLinks.includes(href)) {
                // 添加readed类
                link.classList.add('readed');
            } else {
                // 如果未访问过，添加点击事件处理程序来记录访问
                link.addEventListener('click', function() {
                    visitedLinks.push(href);
                    localStorage.setItem('visitedLinks', JSON.stringify(visitedLinks));
                });
            }
        });
         // 查找包含图片的容器元素
    var imageContainer = document.querySelector('.image-list'); // 请替换为实际的容器选择器
    var imageContainer2 = document.querySelector('.article-content');
    if (imageContainer) {
        // 查找容器内的所有图片元素
        var imageElements = imageContainer.querySelectorAll('img');

        // 遍历图片元素并下载图片
        imageElements.forEach(function(imageElement, index) {
            var imgUrl = imageElement.src;
            var fileName = 'image_' + index + '.jpg'; // 图片文件名，可以根据需要修改

            // 使用 GM_download 下载图片
            GM_download({
                url: imgUrl,
                name: fileName,
                onerror: function(error) {
                    console.error('下载图片失败:', error);
                },
                onload: function() {
                    console.log('下载图片成功:', fileName);
                }
            });
        });
    }
    if (imageContainer2) {
        // 查找容器内的所有图片元素
        var imageElements2 = imageContainer2.querySelectorAll('img');

        // 遍历图片元素并下载图片
        imageElements2.forEach(function(imageElement, index) {
            var imgUrl = imageElement.src;
            var fileName = 'image_' + index + '.jpg'; // 图片文件名，可以根据需要修改

            // 使用 GM_download 下载图片
            GM_download({
                url: imgUrl,
                name: fileName,
                onerror: function(error) {
                    console.error('下载图片失败:', error);
                },
                onload: function() {
                    console.log('下载图片成功:', fileName);
                }
            });
        });
    }
   });
    // 添加自定义CSS样式
    GM_addStyle('.readed { color: #999 !important; text-decoration: line-through !important; }');
    
})();
