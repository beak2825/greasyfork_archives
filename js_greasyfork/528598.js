// ==UserScript==
// @name         image info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示单图页面的图片信息
// @author      ozyl
// @match        *://*/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528598/image%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/528598/image%20info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查页面是否只有一张图片
    const images = document.getElementsByTagName('img');
    if (images.length !== 1 || document.body.children.length > 1) {
        return;
    }

    const img = images[0];

    // 创建信息显示容器
    const infoContainer = document.createElement('div');
    infoContainer.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(250, 250, 250, 0.95);
        padding: 12px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 14px;
        color: #333;
        box-shadow: 0 -1px 8px rgba(0,0,0,0.08);
        display: flex;
        justify-content: center;
        gap: 20px;
        z-index: 9999;
        backdrop-filter: blur(5px);
        border-top: 1px solid rgba(0,0,0,0.05);
    `;

    // 等待图片加载完成
    img.onload = function() {
        updateImageInfo();
    };

    // 如果图片已经加载完成
    if (img.complete) {
        updateImageInfo();
    }

    // 更新图片信息
    function updateImageInfo() {
        const originalSize = `原始尺寸: ${img.naturalWidth} × ${img.naturalHeight}px`;
        const displaySize = `显示尺寸: ${img.width} × ${img.height}px`;

        // 获取图片文件大小
        fetch(img.src)
            .then(response => {
                const size = response.headers.get('content-length');
                const fileSize = size ? `文件大小: ${formatFileSize(size)}` : '文件大小: 未知';

                // 清空容器
                infoContainer.innerHTML = '';

                // 创建信息项
                [originalSize, displaySize, fileSize].forEach(text => {
                    const div = document.createElement('div');
                    div.style.cssText = `
                        background: #ffffff;
                        padding: 8px 15px;
                        border-radius: 4px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                        border: 1px solid rgba(0,0,0,0.08);
                        transition: all 0.2s ease;
                    `;
                    div.textContent = text;
                    div.onmouseover = function() {
                        this.style.background = '#f8f8f8';
                    };
                    div.onmouseout = function() {
                        this.style.background = '#ffffff';
                    };
                    infoContainer.appendChild(div);
                });
            })
            .catch(() => {
                // 如果获取文件大小失败，仍然显示其他信息
                infoContainer.innerHTML = '';
                [originalSize, displaySize, '文件大小: 未知'].forEach(text => {
                    const div = document.createElement('div');
                    div.style.cssText = `
                        background: #ffffff;
                        padding: 8px 15px;
                        border-radius: 4px;
                        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                        border: 1px solid rgba(0,0,0,0.08);
                    `;
                    div.textContent = text;
                    infoContainer.appendChild(div);
                });
            });
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes < 1024) {
            return bytes + 'B';
        } else if (bytes < 1024 * 1024) {
            return (bytes / 1024).toFixed(2) + 'KB';
        } else {
            return (bytes / (1024 * 1024)).toFixed(2) + 'MB';
        }
    }

    // 添加到页面
    document.body.appendChild(infoContainer);

    // 监听窗口大小变化，更新显示尺寸
    window.addEventListener('resize', function() {
        if (infoContainer.children.length > 0) {
            updateImageInfo();
        }
    });
})();
