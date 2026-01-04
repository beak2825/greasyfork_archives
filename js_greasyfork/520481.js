// ==UserScript==
// @name         解禁p站历史记录
// @namespace    http://greasyfork.org
// @version      0.1
// @description  为Pixiv历史记录页面上的图片添加超链接并修正透明度
// @author       You
// @match        https://www.pixiv.net/history.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixiv.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520481/%E8%A7%A3%E7%A6%81p%E7%AB%99%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/520481/%E8%A7%A3%E7%A6%81p%E7%AB%99%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 延迟执行
    setTimeout(function() {

        // 获取所有符合条件的 span 元素
        const items = document.querySelectorAll('span._history-item.trial');

        console.log('Found', items.length, 'items to process.');

        items.forEach(item => {
            const img = item.querySelector('img');
            if (!img) {
                console.log('No image found in item', item);
                return;
            }

            // 提取文件名中的 pid (4到10位数字)
            const src = img.src;
            const pidMatch = src.match(/(\d{4,10})_.*\.jpg/);

            if (pidMatch) {
                const pid = pidMatch[1]; // 获取提取的 pid
                console.log('Found pid:', pid);

                // 创建一个新的链接元素
                const link = document.createElement('a');
                link.href = `https://www.pixiv.net/artworks/${pid}`;
                link.target = "_blank";
                link.className = "_history-item show-detail list-item";
                link.rel = "noreferrer";
                link.style.position = "relative";

                // 选择包裹图片的 div，并将其添加到链接中
                const divContainer = item.querySelector('div'); // 选择包裹图片的 div 元素，不依赖具体类名
                if (divContainer) {
                    link.appendChild(divContainer); // 将 div 包装到链接中
                }

                // 设置图片的 opacity 为 1
                img.style.opacity = 1;

                // 替换原有的 span 元素
                item.parentNode.replaceChild(link, item);

                console.log('Replaced item with link:', link);
            } else {
                console.log('No pid match for src:', src);
            }
        });

    }, 1000);
})();
