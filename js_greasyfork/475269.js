// ==UserScript==
// @name         知乎直链
// @version      1.0
// @namespace   ggbond
// @description  修改zhihu链接的href
// @author       gg爆
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475269/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475269/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

function processLinks(rootNode) {
    const aElements = rootNode.querySelectorAll('a');

    aElements.forEach(function(aElement) {
        const href = aElement.getAttribute('href');
        if (href && href.startsWith('https://link.zhihu.com/?target=')) {
            // 去掉前缀并进行转义
            const targetUrl = decodeURIComponent(href.replace('https://link.zhihu.com/?target=', ''));
            aElement.href = targetUrl;
            console.log("修改后的href：" + aElement.href);
        }
    });
}

(function() {
    'use strict';

    // 初始页面加载时处理链接
    processLinks(document);

    // 使用事件委托捕获后续加载的链接
    document.addEventListener('click', function(event) {
        const target = event.target;
        if (target.tagName === 'A') {
            processLinks(target.parentElement);
        }
    });
})();
