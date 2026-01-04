// ==UserScript==
// @name         新图网预览图片去水印
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove !con and !ys from image URLs on ixintu.com
// @author       www.z-l.top
// @match        https://ixintu.com/*
// @icon         https://api.iowen.cn/favicon/ixintu.com.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490071/%E6%96%B0%E5%9B%BE%E7%BD%91%E9%A2%84%E8%A7%88%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490071/%E6%96%B0%E5%9B%BE%E7%BD%91%E9%A2%84%E8%A7%88%E5%9B%BE%E7%89%87%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有图片元素
    const images = document.querySelectorAll('img');

    // 循环遍历每个图片元素
    images.forEach(image => {
        // 获取图片链接
        let imageUrl = image.getAttribute('src');

        // 检查链接是否包含"!con""!con0"或"!ys"，如果包含则去除
        if (imageUrl.includes('!con0')) {
            imageUrl = imageUrl.replace('!con0', '');
            image.setAttribute('src', imageUrl);
        }
                if (imageUrl.includes('!con1')) {
            imageUrl = imageUrl.replace('!con1', '');
            image.setAttribute('src', imageUrl);
        }
              if (imageUrl.includes('!con')) {
            imageUrl = imageUrl.replace('!con', '');
            image.setAttribute('src', imageUrl);
        }

        if (imageUrl.includes('!ys')) {
            imageUrl = imageUrl.replace('!ys', '');
            image.setAttribute('src', imageUrl);
        }
    });
})();
