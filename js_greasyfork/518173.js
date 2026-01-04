// ==UserScript==
// @name         抖音下载表情包（图片，动图）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  支持聊天窗口、表情包页面、评论区表情包下载
// @author       huangjie
// @match        *://*.douyin.com/*
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518173/%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD%E8%A1%A8%E6%83%85%E5%8C%85%EF%BC%88%E5%9B%BE%E7%89%87%EF%BC%8C%E5%8A%A8%E5%9B%BE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518173/%E6%8A%96%E9%9F%B3%E4%B8%8B%E8%BD%BD%E8%A1%A8%E6%83%85%E5%8C%85%EF%BC%88%E5%9B%BE%E7%89%87%EF%BC%8C%E5%8A%A8%E5%9B%BE%EF%BC%89.meta.js
// ==/UserScript==

var index = 1;

(function () {
    'use strict';
    // 1. 添加下载按钮样式代码
    GM_addStyle(`
        .download-btn {
            z-index:999;
            position: absolute;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            border-radius: 8px;
        }
    `);
    // 2. 添加下载按钮
    setInterval(addButton, 1000);
})();

// 遍历所有图片
function addButton() {
    const imgTags = document.querySelectorAll('img');

    // 遍历所有img标签
    imgTags.forEach((img) => {
        if (img.width >= 60) {
            addButton2(img)
        }
    });
}

// 正式添加下载按钮
function addButton2(img) {
    if (img.add) {
        return;
    }
    // 标记已经添加
    img.add = true;
    // 添加边框样式
    img.style.border = '2px solid red';
    // 创建下载按钮元素
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '下载';
    downloadBtn.className = 'download-btn';

    // 设置下载按钮的点击事件，调用download函数并传入图片的src作为参数
    downloadBtn.addEventListener('click', () => {
        const url = img.src;
        download(url);
    });

    // 将下载按钮添加到img标签的父元素中，并使其相对于img标签定位
    img.parentNode.insertBefore(downloadBtn, img);
}

// 4. 根据url下载图片
function download(url) {
    // 创建 XMLHttpRequest 对象
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = 'blob';

    xhr.onload = function () {
        if (xhr.status === 200) {
            const contentType = xhr.getResponseHeader('Content-Type'); // 获取响应头的文件类型
            let extension = ''; // 文件扩展名

            // 根据 Content-Type 确定扩展名
            if (contentType.includes('jpeg')) {
                extension = '.jpg';
            } else if (contentType.includes('png')) {
                extension = '.png';
            } else if (contentType.includes('gif')) {
                extension = '.gif';
            } else if (contentType.includes('webp')) {
                extension = '.webp';
            } else {
                extension = ''; // 默认无扩展名
                console.warn('未知文件类型，可能需要手动添加扩展名');
            }

            // 生成文件名：时间戳 + 扩展名
            const timestamp = Date.now(); // 当前时间戳
            const fileName = `img_${timestamp}${extension}`;

            // 创建下载链接
            const newUrl = window.URL.createObjectURL(xhr.response);
            const a = document.createElement('a');
            a.href = newUrl;
            a.download = fileName; // 使用生成的文件名
            a.click();

            // 释放对象 URL
            window.URL.revokeObjectURL(newUrl);

            // 更新计数
            index++;
        } else {
            console.error(`文件下载失败，状态码: ${xhr.status}`);
        }
    };

    xhr.onerror = function () {
        console.error('下载过程中发生错误');
    };

    // 发送请求
    xhr.send();
}