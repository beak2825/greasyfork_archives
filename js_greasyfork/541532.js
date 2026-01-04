// ==UserScript==
// @name         ArtStation项目图片8K/4K加载
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  将ArtStation项目中的图片强制替换为8K或4K版本
// @author       You
// @match        https://www.artstation.com/artwork/*
// @match        https://*.artstation.com/projects/*
// @icon         https://www.artstation.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541532/ArtStation%E9%A1%B9%E7%9B%AE%E5%9B%BE%E7%89%878K4K%E5%8A%A0%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/541532/ArtStation%E9%A1%B9%E7%9B%AE%E5%9B%BE%E7%89%878K4K%E5%8A%A0%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function forceHighestQuality() {
        // 遍历所有 <project-asset> 元素
        const assets = document.querySelectorAll('project-asset');

        assets.forEach(asset => {
            if (asset.dataset.processed) return;
            asset.dataset.processed = 'true';

            // 1. 获取 <picture> 和 <img>
            const picture = asset.querySelector('picture.d-flex');
            if (!picture) return;

            const img = picture.querySelector('img.img-fluid');
            if (!img) return;

            // 2. 删除所有 <source> 标签（防止浏览器降级）
            const sources = picture.querySelectorAll('source');
            sources.forEach(source => source.remove());

            // 3. 获取当前图片 URL 并生成各种版本
            const originalSrc = img.src;
            const largeSrc = originalSrc.replace(/\/small\//, '/large/')
                                       .replace(/\/medium\//, '/large/');
            const fourKSrc = originalSrc.replace(/\/small\//, '/4k/')
                                       .replace(/\/medium\//, '/4k/')
                                       .replace(/\/large\//, '/4k/');
            const eightKSrc = originalSrc.replace(/\/small\//, '/8k/')
                                        .replace(/\/medium\//, '/8k/')
                                        .replace(/\/large\//, '/8k/')
                                        .replace(/\/4k\//, '/8k/');

            // 4. 尝试加载 8K 版本，失败则尝试 4K 版本，再失败则回退到 large
            const test8KImg = new Image();
            test8KImg.onload = function() {
                img.src = eightKSrc;
                updateAssetActionsLinks(asset, eightKSrc);
                showImageResolution(img, eightKSrc);
                console.log('Loaded 8K version:', eightKSrc);
            };
            test8KImg.onerror = function() {
                // 尝试加载4K版本
                const test4KImg = new Image();
                test4KImg.onload = function() {
                    img.src = fourKSrc;
                    updateAssetActionsLinks(asset, fourKSrc);
                    showImageResolution(img, fourKSrc);
                    console.log('8K not available, loaded 4K version:', fourKSrc);
                };
                test4KImg.onerror = function() {
                    img.src = largeSrc;
                    updateAssetActionsLinks(asset, largeSrc);
                    showImageResolution(img, largeSrc);
                    console.log('4K not available, fallback to large:', largeSrc);
                };
                test4KImg.src = fourKSrc;
            };
            test8KImg.src = eightKSrc;
        });
    }

    // 显示图片分辨率
    function showImageResolution(img, imgSrc) {
        // 移除已存在的分辨率显示
        const existingResolution = img.parentElement.querySelector('.image-resolution');
        if (existingResolution) {
            existingResolution.remove();
        }

        // 创建分辨率显示div
        const resolutionDiv = document.createElement('div');
        resolutionDiv.className = 'image-resolution';
        resolutionDiv.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
            pointer-events: none;
            max-width: 300px;
            word-break: break-all;
            line-height: 1.3;
        `;
        resolutionDiv.textContent = '加载中...';

        // 确保picture元素有相对定位
        const picture = img.closest('picture');
        if (picture) {
            picture.style.position = 'relative';
            picture.appendChild(resolutionDiv);
        }

        // 获取图片实际分辨率
        const tempImg = new Image();
        tempImg.onload = function() {
            const width = this.naturalWidth;
            const height = this.naturalHeight;

            // 提取图片质量信息
            let quality = '未知';
            let qualityColor = '#ffd700'; // 默认金色

            if (imgSrc.includes('/8k/')) {
                quality = '8K';
                qualityColor = '#ff00ff'; // 紫色，表示最高质量
            } else if (imgSrc.includes('/4k/')) {
                quality = '4K';
                qualityColor = '#ffd700'; // 金色
            } else if (imgSrc.includes('/large/')) {
                quality = 'Large';
                qualityColor = '#00ff00'; // 绿色
            } else if (imgSrc.includes('/medium/')) {
                quality = 'Medium';
                qualityColor = '#ffff00'; // 黄色
            } else if (imgSrc.includes('/small/')) {
                quality = 'Small';
                qualityColor = '#ff6b6b'; // 红色
            }

            // 显示地址和分辨率
            resolutionDiv.innerHTML = `
                <div style="margin-bottom: 2px; color: ${qualityColor};">${quality}</div>
                <div style="font-size: 10px; color: #ccc; margin-bottom: 2px;">${imgSrc}</div>
                <div>${width} × ${height}</div>
            `;
        };
        tempImg.onerror = function() {
            resolutionDiv.innerHTML = `
                <div style="margin-bottom: 2px; color: #ff6b6b;">加载失败</div>
                <div style="font-size: 10px; color: #ccc; margin-bottom: 2px;">${imgSrc}</div>
                <div>未知分辨率</div>
            `;
        };
        tempImg.src = imgSrc;
    }

    // 更新 .asset-actions 中的链接（下载和查看原图）
    function updateAssetActionsLinks(asset, newSrc) {
        const assetActions = asset.querySelector('.asset-actions');
        if (!assetActions) return;

        // 更新下载链接（带 dl=1 参数）
        const downloadLink = assetActions.querySelector('a[download]');
        if (downloadLink) {
            downloadLink.href = newSrc + (downloadLink.href.includes('dl=1') ? '&dl=1' : '');
        }

        // 查看原图链接（不带 dl=1 参数）
        const expandLink = assetActions.querySelector('a:not([download])');
        if (expandLink) {
            expandLink.href = newSrc;
        }
    }

    // 初始处理
    forceHighestQuality();

    // 监听动态加载的内容
    const observer = new MutationObserver(forceHighestQuality);
    observer.observe(document.body, { childList: true, subtree: true });
})();