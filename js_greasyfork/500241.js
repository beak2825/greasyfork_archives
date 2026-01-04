// ==UserScript==
// @name         Imgur链接替换器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  重定向内地无法访问imgur的链接
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500241/Imgur%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/500241/Imgur%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceImgurLinks() {
        // 替换图片src属性
        const images = document.querySelectorAll('img[src^="https://i.imgur.com/"]');
        images.forEach(img => {
            img.src = img.src.replace('https://i.imgur.com/', 'https://search.pstatic.net/common?src=https://i.imgur.com/');
        });

        // 替换a标签href属性
        const links = document.querySelectorAll('a[href^="https://i.imgur.com/"]');
        links.forEach(link => {
            link.href = link.href.replace('https://i.imgur.com/', 'https://search.pstatic.net/common?src=https://i.imgur.com/');
        });

        // 替换内联样式中的背景图片URL
        const elementsWithStyle = document.querySelectorAll('[style*="https://i.imgur.com/"]');
        elementsWithStyle.forEach(el => {
            el.style.cssText = el.style.cssText.replace(/https:\/\/i\.imgur\.com\//g, 'https://search.pstatic.net/common?src=https://i.imgur.com/');
        });
    }

    // 初始执行
    replaceImgurLinks();

    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(replaceImgurLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();
