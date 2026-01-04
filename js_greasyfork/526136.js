// ==UserScript==
// @name         M-Team Old Fashion Preview
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Show original image on hover for M-Team
// @author       You
// @match        https://*.m-team.cc/*
// @match        http://*.m-team.cc/*
// @grant        GM_addStyle
// @grant        GM_log
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526136/M-Team%20Old%20Fashion%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/526136/M-Team%20Old%20Fashion%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加预览图片的样式
    GM_addStyle(`
        .hover-preview-image {
            position: fixed;
            z-index: 999999;
            pointer-events: none;
            max-width: 800px;
            max-height: 800px;
            border: 2px solid #333;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            background: white;
            visibility: hidden;
            transform: translate(20px, -50%);  /* 向右偏移20px，垂直居中 */
        }
        .preview-error {
            position: fixed;
            z-index: 999999;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            pointer-events: none;
            display: none;
        }
    `);

    // 创建预览图片元素
    const preview = document.createElement('img');
    preview.className = 'hover-preview-image';
    document.body.appendChild(preview);

    // 创建错误提示元素
    const errorTip = document.createElement('div');
    errorTip.className = 'preview-error';
    document.body.appendChild(errorTip);

    // 获取缓存的图片URL
    function getOriginalImageUrl(img) {
        const url = img.src;
        if(url.includes('/cache/doubanimg2/')) {
            return url;
        }
        if(url.includes('/api/media/redirect')) {
            try {
                const match = url.match(/cache\/doubanimg2\/[^&]+/);
                if(match) {
                    return 'https://ipcheck.yueing.org/' + match[0];
                }
            } catch (e) {}
        }
        return url;
    }

    // 显示错误提示
    function showError(message, x, y) {
        errorTip.textContent = message;
        errorTip.style.left = `${x}px`;
        errorTip.style.top = `${y}px`;
        errorTip.style.display = 'block';
        setTimeout(() => {
            errorTip.style.display = 'none';
        }, 3000);
    }

    // 处理鼠标进入
    function handleMouseEnter(e) {
        const img = e.target;
        const originalUrl = getOriginalImageUrl(img);

        preview.onload = () => {
            // 获取屏幕尺寸
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            // 计算右侧剩余空间
            const rightSpace = screenWidth - e.clientX;

            // 如果右侧空间不足以显示完整图片（加上偏移和边距）
            if (rightSpace < preview.offsetWidth + 30) {
                // 显示在左侧
                preview.style.transform = 'translate(-100%, -50%)';
                preview.style.left = `${e.clientX - 20}px`;
            } else {
                // 显示在右侧
                preview.style.transform = 'translate(20px, -50%)';
                preview.style.left = `${e.clientX}px`;
            }

            // 计算垂直方向的位置
            let topPosition = e.clientY;

            // 如果图片超出底部
            if (e.clientY + preview.offsetHeight/2 > screenHeight) {
                topPosition = screenHeight - preview.offsetHeight/2;
            }
            // 如果图片超出顶部
            else if (e.clientY - preview.offsetHeight/2 < 0) {
                topPosition = preview.offsetHeight/2;
            }

            preview.style.top = `${topPosition}px`;
            preview.style.visibility = 'visible';
        };

        preview.onerror = () => {
            showError('Image failed to load', e.clientX, e.clientY);
            preview.style.visibility = 'hidden';
        };

        preview.src = originalUrl;
    }

    // 处理鼠标离开
    function handleMouseLeave() {
        preview.style.visibility = 'hidden';
        errorTip.style.display = 'none';
    }

    // 使用事件委托来处理动态加载的图片
    document.addEventListener('mouseover', function(e) {
        if (e.target && (
            e.target.matches('.ant-image-img') ||
            e.target.matches('.torrent-list__thumbnail')
        )) {
            handleMouseEnter(e);
        }
    }, true);

    document.addEventListener('mouseout', function(e) {
        if (e.target && (
            e.target.matches('.ant-image-img') ||
            e.target.matches('.torrent-list__thumbnail')
        )) {
            handleMouseLeave(e);
        }
    }, true);

    // 禁用原有的图片点击预览
    const style = document.createElement('style');
    style.textContent = `
        .ant-image-mask { display: none !important; }
        .ant-image { pointer-events: none; }
        .ant-image img { pointer-events: auto; }
    `;
    document.head.appendChild(style);
})();