// ==UserScript==
// @name                微博热搜隐藏
// @name:zh-CN          微博右侧边栏隐藏
// @namespace           https://greasyfork.org/users/YOUR_USERNAME
// @version            1.0.2
// @description        隐藏新浪微博右侧边栏，热搜，推荐博主，让界面更清爽
// @description:zh-CN  隐藏新浪微博右侧边栏，让界面更清爽
// @author             YOUR_USERNAME
// @license            MIT
// @match              *://*.weibo.com/*
// @match              *://*.weibo.cn/*
// @grant              none
// @supportURL         https://github.com/YOUR_USERNAME/weibo-sidebar-hider/issues
// @homepageURL        https://github.com/YOUR_USERNAME/weibo-sidebar-hider
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/536255/%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/536255/%E5%BE%AE%E5%8D%9A%E7%83%AD%E6%90%9C%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

/* ==UserStyle==
@name           Weibo Sidebar Hider
@namespace      github.com/YOUR_USERNAME/weibo-sidebar-hider
@version        1.0.0
@description    Hide the right sidebar on Sina Weibo pages
@author         YOUR_USERNAME
==/UserStyle== */

(function() {
    'use strict';

    // Create and inject CSS to hide the sidebar
    const style = document.createElement('style');
    style.textContent = `
        /* Hide the right sidebar */
       .Main_side_i7Vti,
        [class*='rightSide'],
        [class*='Side_sideBox'],
        .Right_person_1UjYy,
        .woo-picture-slot{
        display: none !important;
        }

    `;
    document.head.appendChild(style);
})();
