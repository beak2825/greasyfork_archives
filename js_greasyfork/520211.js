// ==UserScript==
// @name         NodeSeek 搜索结果新页面打开
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将 NodeSeek 搜索栏的搜索结果在新标签页中打开
// @author       
// @match        *://www.nodeseek.com/*
// @icon         https://www.google.com/s2/favicons?domain=nodeseek.com
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/520211/NodeSeek%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/520211/NodeSeek%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%B0%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：为搜索结果中的 a 标签设置 target="_blank"
    function setSearchLinksTarget() {
        const searchLinks = document.querySelectorAll('.search-hint a'); // 选择所有 .search-hint 中的 a 标签
        if (searchLinks.length > 0) {
            searchLinks.forEach(link => {
                link.setAttribute('target', '_blank'); // 在新标签中打开链接
            });
            console.log('已为', searchLinks.length, '个搜索结果链接设置 target="_blank"');
        }
    }

    // 监听搜索栏的 DOM 变化，确保新生成的搜索结果链接也能被修改
    const observer = new MutationObserver(() => {
        setSearchLinksTarget();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 页面加载完成时也尝试执行一次，确保初始页面的链接也能被修改
    window.addEventListener('load', setSearchLinksTarget);
})();
