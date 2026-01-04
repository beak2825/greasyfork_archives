// ==UserScript==
// @name         CTRL + 鼠标左键图片另存为 WebP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  按住 Ctrl + 鼠标左键将图片另存为 WebP 格式
// @author       DAFEIGEGE
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544813/CTRL%20%2B%20%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE%E5%9B%BE%E7%89%87%E5%8F%A6%E5%AD%98%E4%B8%BA%20WebP.user.js
// @updateURL https://update.greasyfork.org/scripts/544813/CTRL%20%2B%20%E9%BC%A0%E6%A0%87%E5%B7%A6%E9%94%AE%E5%9B%BE%E7%89%87%E5%8F%A6%E5%AD%98%E4%B8%BA%20WebP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听鼠标点击事件
    document.addEventListener('mousedown', (e) => {
        // 检查是否同时按下了 Ctrl 键和鼠标左键
        // e.ctrlKey 可以直接判断 Ctrl 键是否按下
        // e.button === 0 表示鼠标左键
        if (e.ctrlKey && e.button === 0) {
            // 阻止默认的右键菜单或链接跳转行为
            e.preventDefault();
            e.stopPropagation();

            // 获取点击的图片元素
            const target = e.target;
            if (target.tagName === 'IMG') {
                const imageUrl = target.src;

                // 使用 fetch 请求图片数据
                fetch(imageUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        const img = new Image();
                        const url = URL.createObjectURL(blob);
                        img.onload = function() {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);

                            // 将 canvas 内容转换为 WebP 格式的 blob
                            canvas.toBlob(webpBlob => {
                                const downloadLink = document.createElement('a');
                                downloadLink.href = URL.createObjectURL(webpBlob);
                                downloadLink.download = `image_${Date.now()}.webp`; // 设置文件名
                                document.body.appendChild(downloadLink);
                                downloadLink.click();
                                document.body.removeChild(downloadLink);

                                URL.revokeObjectURL(downloadLink.href);
                                URL.revokeObjectURL(url);
                            }, 'image/webp');
                        };
                        img.src = url;
                    })
                    .catch(error => console.error('图片下载或转换失败:', error));
            }
        }
    });
})();