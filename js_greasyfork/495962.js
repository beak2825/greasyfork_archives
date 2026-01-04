// ==UserScript==
// @name         提取评论并生成HTML
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  提取评论和图片并生成HTML页面，处理相对路径的表情包图片，并适配移动端
// @author       xxxxzui
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495962/%E6%8F%90%E5%8F%96%E8%AF%84%E8%AE%BA%E5%B9%B6%E7%94%9F%E6%88%90HTML.user.js
// @updateURL https://update.greasyfork.org/scripts/495962/%E6%8F%90%E5%8F%96%E8%AF%84%E8%AE%BA%E5%B9%B6%E7%94%9F%E6%88%90HTML.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加一个按钮到页面
    const button = document.createElement('button');
    button.textContent = '下载评论和图片';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    document.body.appendChild(button);

    // 当按钮被点击时，执行提取和生成HTML的功能
    button.addEventListener('click', function() {
        console.log("开始提取评论和图片");

        // 获取指定容器中的评论
        const container = document.querySelector("#main > form:nth-child(13)");
        if (!container) {
            console.error("未找到指定的容器");
            return;
        }
        const comments = container.querySelectorAll('.js-post');

        console.log("评论数: " + comments.length);

        // 创建一个新的HTML文档
        let newHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>提取的评论和图片</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 10px; padding: 10px; }
                    .comment { border: 1px solid #ccc; margin: 10px; padding: 10px; }
                    .comment img { max-width: 100px; cursor: pointer; }
                    .comment-header { font-weight: bold; }
                </style>
                <script>
                    function enlargeImage(img) {
                        const src = img.src;
                        const modal = document.createElement('div');
                        modal.style.position = 'fixed';
                        modal.style.top = '0';
                        modal.style.left = '0';
                        modal.style.width = '100%';
                        modal.style.height = '100%';
                        modal.style.backgroundColor = 'rgba(0,0,0,0.8)';
                        modal.style.display = 'flex';
                        modal.style.alignItems = 'center';
                        modal.style.justifyContent = 'center';
                        modal.style.cursor = 'pointer';
                        modal.onclick = function() { document.body.removeChild(modal); };

                        const modalImg = document.createElement('img');
                        modalImg.src = src;
                        modalImg.style.maxWidth = '90%';
                        modalImg.style.maxHeight = '90%';
                        modal.appendChild(modalImg);
                        
                        document.body.appendChild(modal);
                    }
                </script>
            </head>
            <body>
        `;

        comments.forEach((comment, index) => {
            console.log("处理评论 " + (index + 1));

            const floorElem = comment.querySelector('.tiptop .s3');
            const timeElem = comment.querySelector('.tiptop .gray');
            const userIdElem = comment.querySelector('.user-pic strong');
            const textElem = comment.querySelector('.f14');

            const floor = floorElem ? floorElem.textContent.trim() : '未知楼层';
            const time = timeElem ? timeElem.textContent.trim() : '未知时间';
            const userId = userIdElem ? userIdElem.textContent.trim() : '未知用户';
            let textContent = textElem ? textElem.innerHTML : '';

            // 替换相对路径的图片链接为绝对路径
            textContent = textContent.replace(/src="\/?images\//g, 'src="https://www.south-plus.net/images/');

            newHtml += `
                <div class="comment">
                    <div class="comment-header">
                        <span>楼层: ${floor}</span> | 
                        <span>用户ID: ${userId}</span> | 
                        <span>时间: ${time}</span>
                    </div>
                    <div class="comment-body">
                        ${textContent}
                    </div>
                </div>
            `;
        });

        // 获取页面标题作为文件名
        const pageTitle = document.querySelector("#breadcrumbs > span.crumbs-item.current > strong").textContent.trim();
        const pageUrl = window.location.href;

        newHtml += `
            <div class="original-link">
                <p>原文链接: <a href="${pageUrl}" target="_blank">${pageUrl}</a></p>
            </div>
            </body>
            </html>
        `;

        // 创建一个Blob对象
        const blob = new Blob([newHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        // 创建一个下载链接
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `${pageTitle}.html`;
        downloadLink.click();

        console.log("生成的HTML文件已下载");

        // 释放URL对象
        URL.revokeObjectURL(url);
    });
})();
