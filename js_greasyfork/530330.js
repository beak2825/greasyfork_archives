// ==UserScript==
// @name         美间图片下载器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在美间网站添加免积分下载按钮，直接下载图片
// @author       You
// @match        https://www.meijian.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530330/%E7%BE%8E%E9%97%B4%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530330/%E7%BE%8E%E9%97%B4%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加按钮样式
    GM_addStyle(`
        #free-download-btn {
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        #free-download-btn:hover {
            background-color: #45a049;
        }
    `);

    // 创建下载按钮
    function createDownloadButton() {
        const button = document.createElement('button');
        button.id = 'free-download-btn';
        button.textContent = '免积分下载';
        button.addEventListener('click', downloadImage);
        document.body.appendChild(button);
    }

    // 下载图片函数
    function downloadImage() {
        // 查找目标div块
        const contentWrapper = document.getElementById('mj-content-wrapper');
        if (!contentWrapper) {
            alert('未找到图片内容区域');
            return;
        }

        // 在内容区域中查找图片
        const imgElement = contentWrapper.querySelector('img#img[alt="img"]');
        if (!imgElement) {
            alert('未找到目标图片');
            return;
        }

        const imageUrl = imgElement.getAttribute('src');
        if (!imageUrl) {
            alert('未找到图片地址');
            return;
        }

        // 从URL中提取文件名
        const fileName = imageUrl.split('/').pop();

        // 使用GM_download下载图片
        GM_download({
            url: imageUrl,
            name: fileName,
            onload: () => {
                alert('图片下载成功！');
            },
            onerror: (error) => {
                alert('下载失败: ' + error);
            }
        });
    }

    // 等待页面加载完成后添加按钮
    window.addEventListener('load', function() {
        // 延迟一点时间确保DOM完全加载
        setTimeout(createDownloadButton, 1000);
    });

    // 也可以在DOMContentLoaded时添加按钮
    document.addEventListener('DOMContentLoaded', function() {
        createDownloadButton();
    });
})();