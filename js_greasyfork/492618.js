// ==UserScript==
// @name         V2EX Image Redirector
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redirects specific image URLs on V2EX to a different URL.
// @author       Your name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492618/V2EX%20Image%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/492618/V2EX%20Image%20Redirector.meta.js
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