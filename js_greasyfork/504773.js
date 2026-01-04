// ==UserScript==
// @name         WebP转JPG转换器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  网页中提取webp转JPG
// @author       黎曼
// @match        *://*/*
// @grant        GM_log
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504773/WebP%E8%BD%ACJPG%E8%BD%AC%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/504773/WebP%E8%BD%ACJPG%E8%BD%AC%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const corsProxies = [
        'https://api.allorigins.win/raw?url=',
        'https://cors-anywhere.herokuapp.com/',
    ];

    // 使用所有代理来尝试转换WebP图像为JPG
    function convertWebPToJPGAndDownload(url) {
        console.log('开始尝试多个代理:', url); // 调试信息

        const requests = corsProxies.map(proxy => {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.crossOrigin = 'Anonymous'; // 处理CORS问题
                img.onload = function() {
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);
                    let jpgDataUrl = canvas.toDataURL('image/jpeg');
                    resolve(jpgDataUrl);
                };
                img.onerror = function() {
                    reject('代理失败: ' + proxy);
                };
                img.src = proxy + url;
            });
        });

        Promise.allSettled(requests)
            .then(results => {
                const successResult = results.find(result => result.status === 'fulfilled');
                if (successResult) {
                    console.log('成功转换图像'); // 调试信息

                    let link = document.createElement('a');
                    link.href = successResult.value;
                    link.download = 'converted-image.jpg';
                    link.style.display = 'none'; // 隐藏链接
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    const errors = results.filter(result => result.status === 'rejected').map(result => result.reason);
                    GM_log('所有代理均失败: ' + errors.join(', '));
                }
            })
            .catch(error => {
                GM_log('处理请求时发生错误: ' + error);
            });
    }

    // 创建并添加浮动面板，列出WebP图像
    function createFloatingPanel() {
        let panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = 10000;
        panel.style.padding = '10px';
        panel.style.backgroundColor = 'white';
        panel.style.border = '1px solid black';
        panel.style.maxHeight = '90vh';
        panel.style.overflowY = 'auto';
        panel.style.width = '300px';

        let header = document.createElement('h3');
        header.innerText = 'WebP 图像';
        panel.appendChild(header);

        document.body.appendChild(panel);

        return panel;
    }

    // 将图像URL及其缩略图添加到浮动面板
    function addImageToPanel(panel, img) {
        let container = document.createElement('div');
        container.style.marginBottom = '10px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';

        let thumbnail = document.createElement('img');
        thumbnail.src = img.src;
        thumbnail.style.width = '50px';
        thumbnail.style.height = '50px';
        thumbnail.style.objectFit = 'cover';
        thumbnail.style.marginRight = '10px';

        let imgLink = document.createElement('a');
        imgLink.href = img.src;
        imgLink.innerText = img.src;
        imgLink.target = '_blank';
        imgLink.style.display = 'block';
        imgLink.style.flexGrow = '1';
        imgLink.style.overflow = 'hidden';
        imgLink.style.textOverflow = 'ellipsis';
        imgLink.style.whiteSpace = 'nowrap';
        imgLink.style.marginRight = '10px';

        let downloadButton = document.createElement('button');
        downloadButton.innerText = '下载为JPG';
        downloadButton.style.flexShrink = '0';

        downloadButton.addEventListener('click', function(event) {
            event.stopPropagation();
            event.preventDefault();
            convertWebPToJPGAndDownload(img.src);
        });

        container.appendChild(thumbnail);
        container.appendChild(imgLink);
        container.appendChild(downloadButton);
        panel.appendChild(container);
    }

    // 查找所有WebP图像并在浮动面板中显示
    function findWebPImages() {
        let panel = createFloatingPanel();
        let images = document.querySelectorAll('img');
        console.log('找到的图像数量:', images.length); // 调试信息
        images.forEach((img) => {
            if (img.src.endsWith('.webp')) {
                addImageToPanel(panel, img);
            }
        });
    }

    // 创建并添加显示图像的按钮
    function addShowImagesButton() {
        let button = document.createElement('button');
        button.innerText = '显示WebP图像';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px';
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', findWebPImages);

        document.body.appendChild(button);
    }

    // 页面加载时添加显示图像按钮
    window.addEventListener('load', addShowImagesButton);
})();
