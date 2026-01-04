// ==UserScript==
// @name         腾讯文档自动选择浏览器打开
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  自动选择在浏览器中打开腾讯文档链接，跳过中间页面
// @author       微信11208596
// @match        *://docs.qq.com/*
// @grant        none
// @license      UNLICENSED
// @copyright    2024, Your name
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522552/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/522552/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%B5%8F%E8%A7%88%E5%99%A8%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

/* 版权所有 (c) 2024
 * 保留所有权利
 * 本代码是私有的，未经作者明确授权，不得以任何形式使用、复制、修改或分发。
 */

(function() {
    'use strict';

    // 处理中间页面
    if (location.href.includes('scenario/docs-desktop-client-guide.html')) {
        const urlParams = new URLSearchParams(location.search);
        const targetUrl = urlParams.get('url');
        if (targetUrl) {
            location.replace(decodeURIComponent(targetUrl));
        }
        return;
    }

    // 处理文档列表页面
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (!link || !link.href || !link.href.includes('docs.qq.com')) return;

        // 阻止默认行为
        e.preventDefault();
        e.stopPropagation();

        // 构建直接访问链接
        let finalUrl = link.href;
        if (finalUrl.includes('scenario/docs-desktop-client-guide.html')) {
            const params = new URLSearchParams(new URL(finalUrl).search);
            const docUrl = params.get('url');
            if (docUrl) {
                finalUrl = decodeURIComponent(docUrl);
            }
        }

        // 添加浏览器模式参数
        const url = new URL(finalUrl);
        url.searchParams.set('forceBrowser', '1');
        url.searchParams.set('browserMode', 'true');

        // 在新窗口打开
        window.open(url.href, '_blank');
    }, true);
})();