// ==UserScript==
// @name         summper-plus南+浏览优化
// @namespace    www.summer-plus.net
// @version      1.0.1
// @description  只有详情会打开新页签,分页查询不会处理
// @author       JunKai Wang
// @match        *://www.summer-plus.net/*
// @match        *://www.spring-plus.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524295/summper-plus%E5%8D%97%2B%E6%B5%8F%E8%A7%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/524295/summper-plus%E5%8D%97%2B%E6%B5%8F%E8%A7%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取页面根 URL
    const baseUrl = window.location.protocol + "//" + window.location.hostname;

    // 为整个页面添加事件监听，使用事件委托
    document.body.addEventListener('click', function(event) {
        const link = event.target.closest('a');  // 获取最近的 <a> 标签

        // 确保点击的是一个 <a> 标签且 href 属性存在
        if (link && link.href) {
            const href = link.getAttribute('href');
            // 如果链接是相对路径，将其转换为完整 URL
            const fullHref = href.startsWith('http') ? href : baseUrl + '/' + href;
            // console.log('Full URL:', fullHref);

            // 使用 URL 对象提取路径部分
            const url = new URL(fullHref);
            const pathname = url.pathname;
            // console.log('Pathname:', pathname);

            // 使用正则表达式确保路径中是独立的 'read.php'
            const isReadLink = /\/read\.php/.test(pathname);  // 确保是独立的 read.php
            // console.log('Is read.php link:', isReadLink);

            if (isReadLink) {
                // 如果是 read.php 链接，在新标签页打开
                event.preventDefault();
                window.open(fullHref, '_blank');  // 在新标签页打开链接
            } else {
                // 对其他链接不做处理
                // console.log('No action for thread.php or other links.');
            }
        }
    });
})();
