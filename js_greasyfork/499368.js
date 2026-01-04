// ==UserScript==
// @name         强制亚马逊新标签页打开
// @name:en      Force Amazon Links to Open in New Tab
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  让亚马逊网页链接在新标签页中打开，提升浏览效率。
// @description:en  Opens Amazon web links in new tabs, enhancing browsing efficiency.
// @author       祀尘
// @match        https://www.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499368/%E5%BC%BA%E5%88%B6%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/499368/%E5%BC%BA%E5%88%B6%E4%BA%9A%E9%A9%AC%E9%80%8A%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听文档上的点击事件，使用事件委托处理
    document.addEventListener('click', function(event) {
        let anchor = event.target.closest('a');
        if (anchor && anchor.href && !anchor.href.startsWith('https://www.amazon.com/vdp/')) {
            // 检查被点击元素或其父元素是否包含指定类名或 id 中包含 size_name，或 class 名称包含 s-pagination-item
            if (event.target.closest('.a-button-inner') || event.target.id.includes('size_name') || event.target.closest('.s-pagination-item') || event.target.closest('.a-pagination')) {
                return; // 不在新标签页中打开
            }
            event.preventDefault();
            window.open(anchor.href, '_blank');
        }
    }, true);

    // 覆盖 window.open 方法，以确保在新标签页中打开 URL
    const originalOpen = window.open;
    window.open = function(url, target = '_blank', features) {
        if (['_self', '_parent', '_top'].includes(target)) {
            target = '_blank';
        }
        return originalOpen.call(window, url, target, features);
    };

})();
