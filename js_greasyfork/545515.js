// ==UserScript==
// @name         Hi-PDA 4D4Y 默认高清原图
// @namespace    http://tampermonkey.net/
// @version      2025-08-12 01
// @description  Hi-PDA Miscellaneous
// @author       MONKey
// @match        *://*.4d4y.com/*
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545515/Hi-PDA%204D4Y%20%E9%BB%98%E8%AE%A4%E9%AB%98%E6%B8%85%E5%8E%9F%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/545515/Hi-PDA%204D4Y%20%E9%BB%98%E8%AE%A4%E9%AB%98%E6%B8%85%E5%8E%9F%E5%9B%BE.meta.js
// ==/UserScript==


(function() {
        'use strict';

        function replaceImages() {
                // 查找所有图片元素
                const images = document.querySelectorAll('img');

                // 遍历所有图片元素
                images.forEach(img => {
                        let src = img.src;

                        // 检查src是否包含'.png.thumb.jpg'
                        if (src.includes('.thumb.jpg')) {
                                // 如果包含，则进行替换
                                let newSrc = src.replace('.thumb.jpg', '');
                                img.src = newSrc;
                                img.style.maxWidth = '100%';
                        }
                });
        }

        // 使用 MutationObserver 监听 DOM 变化，以便在动态加载内容时也能替换图片
        const observer = new MutationObserver((mutationsList, observer) => {
                for(const mutation of mutationsList) {
                        if (mutation.type === 'childList') {
                                replaceImages();
                                break; // 每次DOM变化后执行一次即可
                        }
                }
        });

        // 配置 observer 监听 body 元素及其子元素的添加
        observer.observe(document.body, { childList: true, subtree: true });

        // 页面初次加载时执行一次替换
        window.addEventListener('load', replaceImages);

})();