// ==UserScript==
// @name         CSDN 移除博客中包含下载链接的元素
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除 CSDN 博客页面上包含下载链接的元素，以提高页面可读性，消除不需要的下载推荐内容。
// @author       fly9593
// @match        https://blog.csdn.net/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496209/CSDN%20%E7%A7%BB%E9%99%A4%E5%8D%9A%E5%AE%A2%E4%B8%AD%E5%8C%85%E5%90%AB%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E7%9A%84%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/496209/CSDN%20%E7%A7%BB%E9%99%A4%E5%8D%9A%E5%AE%A2%E4%B8%AD%E5%8C%85%E5%90%AB%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E7%9A%84%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements containing specific links
    function removeDownloadElements() {
        const downloadLinks = document.querySelectorAll('a[href*="download.csdn.net/download"]');
        downloadLinks.forEach(link => {
            let element = link.closest('.recommend-item-box.type_download');
            if (element) {
                element.remove();
            }
        });
    }

    // Run the function once the page has loaded
    window.addEventListener('load', removeDownloadElements);
    // Run the function on AJAX content load (optional)
    const observer = new MutationObserver(removeDownloadElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();