// ==UserScript==
// @name         GameBanana Mods Full Images Loader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动加载GameBanana网站Mods上的完整版图片
// @author       Zhao_zzZ
// @match        https://gamebanana.com/mods/*
// @downloadURL https://update.greasyfork.org/scripts/546286/GameBanana%20Mods%20Full%20Images%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/546286/GameBanana%20Mods%20Full%20Images%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElement(selector, callback, maxTries = 50) {
        if (maxTries <= 0) {
            console.log('GameBanana Full Images: 元素未找到:', selector);
            return;
        }
        
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback, maxTries - 1), 100);
        }
    }

    // 处理图片URL，移除尺寸前缀获取完整版
    function getFullImageUrl(thumbnailUrl) {
        // 匹配缩略图URL模式：https://images.gamebanana.com/img/ss/mods/尺寸前缀_文件名.jpg
        const match = thumbnailUrl.match(/https:\/\/images\.gamebanana\.com\/img\/ss\/mods\/(\d+-\d+_)?(.+\.jpg)/);
        if (match) {
            const filename = match[2];
            return `https://images.gamebanana.com/img/ss/mods/${filename}`;
        }
        return thumbnailUrl; // 如果无法解析，返回原URL
    }

    // 处理单个图片元素
    function processImage(img) {
        const originalSrc = img.src;
        const fullImageUrl = getFullImageUrl(originalSrc);
        
        if (fullImageUrl !== originalSrc) {
            console.log('GameBanana Full Images: 替换图片', originalSrc, '->', fullImageUrl);
            
            // 创建新图片对象预加载
            const newImg = new Image();
            newImg.onload = function() {
                img.src = fullImageUrl;
                img.style.transition = 'opacity 0.3s ease-in-out';
            };
            newImg.onerror = function() {
                console.log('GameBanana Full Images: 无法加载完整版图片:', fullImageUrl);
            };
            newImg.src = fullImageUrl;
        }
    }

    // 处理Gallery模块中的所有图片
    function processGallery() {
        const gallery = document.querySelector('.Gallery');
        if (!gallery) return;

        const images = gallery.querySelectorAll('img[src*="images.gamebanana.com"]');
        images.forEach(processImage);
    }

    // 监听DOM变化，处理动态加载的内容
    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新添加的元素是否包含图片
                            const images = node.querySelectorAll ? node.querySelectorAll('img[src*="images.gamebanana.com"]') : [];
                            images.forEach(processImage);
                            
                            // 如果新元素本身就是图片
                            if (node.tagName === 'IMG' && node.src && node.src.includes('images.gamebanana.com')) {
                                processImage(node);
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 主函数
    function init() {
        console.log('GameBanana Full Images: 脚本已启动');
        
        // 等待Gallery模块加载
        waitForElement('.Gallery', function() {
            processGallery();
            observeChanges();
        });
        
        // 也处理可能已经存在的图片
        setTimeout(processGallery, 1000);
    }

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();