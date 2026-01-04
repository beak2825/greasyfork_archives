// ==UserScript==
// @name         xiaohongshu download images and record links
// @name:zh-CN   小红书下载图片、文章
// @namespace    http://yourwebsite.com
// @version      1.0
// @license      MIT
// @description  Download images and videos from new version weibo UI webpage.
// @description:zh-CN 循环打开页面链接
// @author       Your Name
// @match        https://www.xiaohongshu.com/explore/*
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/477230/xiaohongshu%20download%20images%20and%20record%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/477230/xiaohongshu%20download%20images%20and%20record%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 等待页面加载完毕
    window.addEventListener('load', function() {
        // 获取包含文本内容的<div>元素
        var divElement = document.getElementById('detail-desc');
        var titleElement = document.getElementById('detail-title');
        // 获取<div>元素中的文本内容
        var textContent = divElement.textContent;
        // 获取<div>元素中的文本内容
        var titleContent = "#"+titleElement.textContent+"#";
        // 创建一个Blob对象并保存到本地文件
        var blob = new Blob([titleContent+textContent], { type: 'text/plain' });
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'text_content.txt'; // 文件名
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        var elements = document.querySelectorAll('.swiper-slide');
        var imageUrls = [];

        elements.forEach(function(element, index) {
            var styleAttribute = element.getAttribute('style');
            var matches = styleAttribute.match(/background-image:\s*url\((['"]?)(.*?)\1\)/);

            if (matches && matches.length > 2) {
                var imageUrl = matches[2];
                var fileName = 'image_' + index + '.jpg'; // 图片文件名，可以根据需要修改

                // 使用 GM_download 下载图片
                GM_download({
                    url: imageUrl,
                    name: fileName,
                    onerror: function(error) {
                        console.error('下载图片失败:', error);
                    },
                    onload: function() {
                        console.log('下载图片成功:', fileName);
                    }
                });
            }
        });

        console.log('提取的图片URL:', imageUrls);


        // 获取视频元素
        var videoElement = document.querySelector('video');

        if (videoElement) {
            var videoUrl = videoElement.src;
           // 触发下载
            GM_download({
                url: videoUrl,
                name: 'video.mp4', // 下载文件名
                onload: function() {
                    console.log('视频下载完成');
                },
                onerror: function(error) {
                    console.error('视频下载失败:', error);
                }
            });
        }
    });








})();


