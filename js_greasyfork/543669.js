// ==UserScript==
// @name         Fandom 图片下载器（选悬浮标识）
// @name:en      Fandom Image Hover Downloader
// @namespace    https://github.com/your-username-here
// @version      1.3
// @description  在 Fandom wiki 网站上，当鼠标悬停在图片上时显示一个下载按钮，点击即可下载原图。采用JS动态计算尺寸，彻底修复图标变形问题。
// @description:en Shows a download button on mouse hover over images on Fandom wiki sites. Uses JS dynamic sizing to definitively fix icon distortion.
// @author       Gemini & Camellia895
// @match        *://*.fandom.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543669/Fandom%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E9%80%89%E6%82%AC%E6%B5%AE%E6%A0%87%E8%AF%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543669/Fandom%20%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%88%E9%80%89%E6%82%AC%E6%B5%AE%E6%A0%87%E8%AF%86%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 全局常量 ---
    const DOWNLOAD_SVG_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="60%" height="60%"><path d="M12 15.5l-5-5h3V2h4v8.5h3l-5 5zM5 20h14v-2H5v2z"></path></svg>`;

    // --- 工具函数: 节流 ---
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // --- 核心功能 ---

    function getOriginalImageUrl(url) {
        const match = url.match(/^(.*?\.(?:png|jpg|jpeg|gif|webp|bmp|svg))/i);
        return match ? match[1] : url.split('/revision/')[0] || url;
    }

    function getFilenameFromUrl(url) {
        try {
            return decodeURIComponent(url.split('/').pop());
        } catch (e) {
            return url.split('/').pop();
        }
    }

    async function downloadFile(url, filename) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`网络响应错误: ${response.statusText}`);
            const blob = await response.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
        } catch (error) {
            console.error('下载失败:', error);
            alert(`下载失败: ${filename}\n原因: ${error.message}`);
        }
    }

    /**
     * 为单个图片元素添加悬浮下载功能。
     * @param {HTMLImageElement} imgElement - 目标图片元素。
     */
    function addHoverDownloader(imgElement) {
        if (imgElement.dataset.hoverDownloaderAdded) return;
        imgElement.dataset.hoverDownloaderAdded = 'true';

        const container = imgElement.closest('a') || imgElement.parentElement;
        if (!container) return;

        if (window.getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        container.addEventListener('mouseenter', () => {
            if (container.querySelector('.hover-download-overlay-gemini')) return;

            const overlay = document.createElement('div');
            overlay.className = 'hover-download-overlay-gemini';
            overlay.style.cssText = `
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                background-color: rgba(0, 0, 0, 0.45);
                display: flex; align-items: center; justify-content: center;
                cursor: pointer; z-index: 9999;
                transition: opacity 0.2s ease;
            `;

            const iconContainer = document.createElement('div');
            iconContainer.style.cssText = `
                /* 外观和居中样式 */
                background-color: rgba(0, 0, 0, 0.6);
                border-radius: 50%;
                border: 2px solid white;
                box-sizing: border-box;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

            // [v1.3] 核心修复：使用 JavaScript 动态计算尺寸
            // 1. 获取容器的实际渲染尺寸
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            // 2. 找到较短的一边
            const shorterSide = Math.min(containerWidth, containerHeight);
            // 3. 将图标尺寸设置为较短边的 50%，确保为正方形且不变形
            const iconSize = shorterSide * 0.5;

            iconContainer.style.width = `${iconSize}px`;
            iconContainer.style.height = `${iconSize}px`;
            // 确保图标在极小图片上不会过小
            iconContainer.style.minWidth = '35px';
            iconContainer.style.minHeight = '35px';


            iconContainer.innerHTML = DOWNLOAD_SVG_ICON;
            overlay.appendChild(iconContainer);

            overlay.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const imageUrl = imgElement.src || imgElement.dataset.src;
                const originalUrl = getOriginalImageUrl(imageUrl);
                const filename = getFilenameFromUrl(originalUrl);

                iconContainer.innerHTML = '...';
                await downloadFile(originalUrl, filename);
                if(overlay.parentElement) overlay.remove();
            };

            container.appendChild(overlay);
        });

        container.addEventListener('mouseleave', () => {
            const activeOverlay = container.querySelector('.hover-download-overlay-gemini');
            if (activeOverlay) activeOverlay.remove();
        });
    }

    /**
     * 扫描整个页面，为所有符合条件的图片添加下载功能。
     */
    function processPage() {
        const images = document.querySelectorAll('img[src*="static.wikia.nocookie.net/"]:not([data-hover-downloader-added])');
        images.forEach(img => {
            if (img.offsetParent !== null && (img.clientWidth > 30 && img.clientHeight > 30)) {
                 addHoverDownloader(img);
            }
        });
    }

    // --- 主执行逻辑 ---
    const throttledProcessPage = throttle(processPage, 500);
    const observer = new MutationObserver(throttledProcessPage);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    });

    window.addEventListener('load', () => {
        throttledProcessPage();
        setTimeout(throttledProcessPage, 1000);
    });

})();