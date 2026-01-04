// ==UserScript==
// @name         里屋格式优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  调节分栏比例和图片展示大小
// @author       You
// @match        https://www.253874.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481446/%E9%87%8C%E5%B1%8B%E6%A0%BC%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481446/%E9%87%8C%E5%B1%8B%E6%A0%BC%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        // 调整 frameset 宽度
        const outerFrameSet = document.getElementById('gb_bodys');
        if (outerFrameSet) {
            // 设置第一列为页面宽度的 30%，第二列占据剩余空间
            outerFrameSet.cols = "20%,*";
        }

        const posts = document.querySelectorAll('.post_list');
        posts.forEach(post => {
            const images = post.querySelectorAll('img');
            images.forEach(img => {
                // 跳过gif表情包
                if (img.src.toLowerCase().endsWith('.gif')) {
                    return;
                }

                // 设置图片的初始高度，保持宽高比
                img.style.height = '300px';
                img.style.width = 'auto';

                let originalHeight = img.naturalHeight;
                let originalWidth = img.naturalWidth;

                // 点击时切换图片大小
                img.addEventListener('click', () => {
                    if (img.style.height === '300px') {
                        img.style.height = originalHeight + 'px';
                        img.style.width = originalWidth + 'px';
                    } else {
                        img.style.height = '300px';
                        img.style.width = 'auto';
                    }
                });
            });
        });
    });
})();