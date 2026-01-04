// ==UserScript==
// @name         Wikipedia Open Specific Links in New Window (Including Homepage)
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在维基百科中点击特定蓝色链接时自动弹出新窗口，排除图片和媒体文件链接，并确保在首页也生效。
// @author       You
// @match        https://zh.wikipedia.org/zh-cn/*
// @match        https://zh.wikipedia.org/wiki/Wikipedia:%E9%A6%96%E9%A1%B5
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527673/Wikipedia%20Open%20Specific%20Links%20in%20New%20Window%20%28Including%20Homepage%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527673/Wikipedia%20Open%20Specific%20Links%20in%20New%20Window%20%28Including%20Homepage%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取所有蓝色链接
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        // 判断链接是否在正文部分，并排除图片和媒体文件链接
        if (link.closest('#bodyContent') && !link.closest('.thumb') && !link.href.includes('/wiki/File:')) {
            link.addEventListener('click', function(event) {
                window.open(link.href, '_blank');
                event.preventDefault(); // 阻止默认行为，避免当前页面跳转
            });
        }
    });
})();
