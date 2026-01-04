// ==UserScript==
// @name         OneNav导航链接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  直接替换所有卡片链接为data-url中的真实链接
// @author       annet
// @match        *://www.miaoaaa.com/*
// @match        *://www.acgbox.link/*
// @author       annet
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535810/OneNav%E5%AF%BC%E8%88%AA%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/535810/OneNav%E5%AF%BC%E8%88%AA%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待DOM加载完成
    window.addEventListener('load', function() {
        // 找到所有包含data-url属性的卡片链接
        const cardLinks = document.querySelectorAll('a.card[data-url]');

        cardLinks.forEach(link => {
            const dataUrl = link.getAttribute('data-url');
            if (dataUrl && link.href !== dataUrl) {
                // 替换href属性
                link.href = dataUrl;

                // 移除可能存在的限制属性
                link.removeAttribute('rel');
                link.removeAttribute('data-toggle');
                link.removeAttribute('data-placement');
            }
        });

        // 处理直达按钮的链接（可选，根据需求）
        const goLinks = document.querySelectorAll('a.togo[data-id]');
        goLinks.forEach(goLink => {
            const dataId = goLink.getAttribute('data-id');
            const parentLink = document.querySelector(`a.site-${dataId}[data-url]`);
            if (parentLink) {
                const dataUrl = parentLink.getAttribute('data-url');
                if (dataUrl && goLink.href !== dataUrl) {
                    goLink.href = dataUrl;
                    goLink.removeAttribute('rel');
                }
            }
        });

        console.log('链接替换完成：已处理', cardLinks.length, '个卡片链接和', goLinks.length, '个直达按钮');
    });
})();