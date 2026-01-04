// ==UserScript==
// @license MIT
// @name         Telegra.ph 图片打包下载
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  获取网页所有图片链接，保存到文本文件并一键下载到本地压缩包。
// @author       FreeL00P
// @match        https://telegra.ph/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdn.jsdelivr.net/npm/jszip@3.1.5/dist/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/484600/Telegraph%20%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/484600/Telegraph%20%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        #imageLinksContainer {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 5px;
            max-width: 400px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 9999;
        }

        #imageLinksTextarea {
            width: 100%;
            height: 200px;
            margin-bottom: 10px;
            padding: 8px;
            box-sizing: border-box;
            resize: vertical;
        }

        #copyButton,
        #downloadButton {
            display: block;
            width: 100%;
            padding: 8px;
            margin-bottom: 5px;
            cursor: pointer;
        }

        #copyButton {
            background-color: #4CAF50;
            color: #fff;
            border: none;
            border-radius: 3px;
        }

        #copyButton:hover {
            background-color: #45a049;
        }

        #downloadButton {
            background-color: #008CBA;
            color: #fff;
            border: none;
            border-radius: 3px;
        }

        #downloadButton:hover {
            background-color: #0077A3;
        }
    `);

    // 获取所有图片链接
    function getAllImagesLinks() {
        const imageElements = document.querySelectorAll('img');
        const imageLinks = Array.from(imageElements).map(img => img.getAttribute('src'));

        // 获取<header>标签下的<h1>标签内容作为文件夹名称
        const folderName = document.querySelector('header h1').textContent.trim();

        // 创建文本框用于显示图片链接
        const container = document.createElement('div');
        container.id = 'imageLinksContainer';

        const textarea = document.createElement('textarea');
        textarea.id = 'imageLinksTextarea';
        textarea.value = imageLinks.join('\n');

        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.id = 'copyButton';
        copyButton.textContent = '复制链接';
        copyButton.addEventListener('click', function () {
            textarea.select();
            document.execCommand('copy');
        });

        // 创建下载按钮
        const downloadButton = document.createElement('button');
        downloadButton.id = 'downloadButton';
        downloadButton.textContent = '一键下载';
        downloadButton.addEventListener('click', function () {
            downloadZip(folderName, imageLinks);
        });

        // 将文本框和按钮添加到页面
        container.appendChild(textarea);
        container.appendChild(copyButton);
        container.appendChild(downloadButton);
        document.body.appendChild(container);
    }

    // 一键下载所有图片并保存到压缩包
    function downloadZip(folderName, imageLinks) {
        // 创建一个 zip 文件
        const zip = new JSZip();

        // 将所有图片链接保存到文本文件
        zip.file(folderName + '/imageLinks.txt', imageLinks.join('\n'));

        // 循环下载图片并添加到 zip 文件
        imageLinks.forEach(function (imageLink, index) {
            GM_xmlhttpRequest({
                method: "GET",
                url: imageLink,
                responseType: "arraybuffer",
                onload: function (response) {
                    zip.file(folderName + '/image_' + index + '.jpg', response.response);
                    if (index === imageLinks.length - 1) {
                        // 下载完成后保存 zip 文件
                        zip.generateAsync({ type: "blob" }).then(function (content) {
                            downloadBlob(content, folderName + '.zip');
                        });
                    }
                }
            });
        });
    }

    // 下载 Blob 对象
    function downloadBlob(blob, fileName) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;

        // 模拟点击链接来触发下载
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 在页面加载完成后调用获取所有图片链接的函数
    window.addEventListener('load', function () {
        getAllImagesLinks();
    });
})();
