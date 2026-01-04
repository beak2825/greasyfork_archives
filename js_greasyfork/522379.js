// ==UserScript==
// @name         Emby 高清图片优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  智能优化 Emby 图片显示质量，自动调整分辨率
// @author       You
// @match        *://*/emby/*
// @match        *://*/web/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522379/Emby%20%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/522379/Emby%20%E9%AB%98%E6%B8%85%E5%9B%BE%E7%89%87%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        // 封面图最大宽度（像素）
        posterMaxWidth: 500,
        // 背景图最大宽度（像素）
        backdropMaxWidth: 1200,
        // 默认最大宽度（像素）
        defaultMaxWidth: 800
    };

    // 判断图片类型并返回对应的最大宽度
    function getMaxWidthByUrl(url) {
        if (url.includes('/Primary?')) {
            return CONFIG.posterMaxWidth;
        }
        if (url.includes('/Backdrop?')) {
            return CONFIG.backdropMaxWidth;
        }
        return CONFIG.defaultMaxWidth;
    }

    // 处理图片 URL 的函数
    function processImageUrl(img) {
        if (!img.src || !img.src.includes('emby/Items')) {
            return;
        }

        try {
            const url = new URL(img.src);
            const currentMaxWidth = url.searchParams.get('maxWidth');
            const currentMaxHeight = url.searchParams.get('maxHeight');
            
            // 如果当前限制小于配置的最大宽度，则更新
            if (currentMaxWidth && parseInt(currentMaxWidth) < getMaxWidthByUrl(img.src)) {
                url.searchParams.set('maxWidth', getMaxWidthByUrl(img.src).toString());
                url.searchParams.delete('maxHeight');
                
                if (img.src !== url.toString()) {
                    console.log("更新图片:", url.toString());
                    img.src = url.toString();
                }
            }
        } catch (error) {
            console.error("处理图片URL时出错:", error);
        }
    }

    // 处理所有图片
    function processAllImages() {
        document.querySelectorAll('img[src*="emby/Items"]').forEach(processImageUrl);
    }

    // 创建 MutationObserver
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            // 检查新添加的节点
            mutation.addedNodes.forEach(node => {
                if (node.nodeName === 'IMG') {
                    processImageUrl(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll('img[src*="emby/Items"]').forEach(processImageUrl);
                }
            });

            // 检查属性变化
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'src' && 
                mutation.target.nodeName === 'IMG') {
                processImageUrl(mutation.target);
            }
        });
    });

    // 配置 MutationObserver
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src']
    };

    // 在页面加载开始时就运行脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processAllImages();
            observer.observe(document.body, observerConfig);
        });
    } else {
        processAllImages();
        observer.observe(document.body, observerConfig);
    }

    // 监听页面加载完成事件
    window.addEventListener('load', processAllImages);
})();