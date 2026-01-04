// ==UserScript==
// @name         打开选中的链接
// @namespace    chatgptandkuarquersnamespace
// @version      1.0
// @description  用快捷键打开所选内容中的所有链接
// @author       ChatGPTAndKuarquer
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476353/%E6%89%93%E5%BC%80%E9%80%89%E4%B8%AD%E7%9A%84%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/476353/%E6%89%93%E5%BC%80%E9%80%89%E4%B8%AD%E7%9A%84%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 打开所有链接
    function openAllLinks(links) {
        const uniqueLinks = [...new Set(links)];
        uniqueLinks.forEach(link => {
            window.open(link, '_blank');
        });
    }

    // 提取所选内容中的链接
    function extractLinks() {
        const selectedContent = window.getSelection();
        const links = [];
        const range = selectedContent.getRangeAt(0);
        const elements = range.cloneContents().querySelectorAll('a');
        elements.forEach(element => {
            links.push(element.href);
        });
        openAllLinks(links);
    }

    // 监听点击事件，当按下Ctrl键并点击时执行链接提取操作
    document.addEventListener('click', function(event) {
        if (event.ctrlKey && event.button === 0) {
            extractLinks();
        }
    });

})();