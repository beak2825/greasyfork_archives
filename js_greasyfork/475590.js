// ==UserScript==
// @name         Pixiv反代链接替换
// @namespace    https://www.cccpserver.cf
// @version      1.02
// @description  使用国内反代节点替换Pixiv日本图片节点
// @author       HELPMEEADICE
// @match        *://www.pixiv.net/*
// @license GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475590/Pixiv%E5%8F%8D%E4%BB%A3%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/475590/Pixiv%E5%8F%8D%E4%BB%A3%E9%93%BE%E6%8E%A5%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replacePximgLinks() {
        const links = document.querySelectorAll('a[href*="i.pximg.net"]');
        const images = document.querySelectorAll('img[src*="i.pximg.net"]');

        links.forEach(link => {
            link.href = link.href.replace(/i\.pximg\.net/g, 'i.pixivcat.com');
        });

        images.forEach(image => {
            image.src = image.src.replace(/i\.pximg\.net/g, 'i.pixivcat.com');
        });
    }

    replacePximgLinks();

    // Listen for changes in the DOM, in case the page uses AJAX to load content
    const observer = new MutationObserver(replacePximgLinks);
    observer.observe(document.body, { subtree: true, childList: true });
})();
