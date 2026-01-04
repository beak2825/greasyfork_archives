// ==UserScript==
// @name         自定义网页背景色-深黑色
// @namespace    
// @version      1
// @description  自定义网页背景色，优酷，555视频等，配合谷歌浏览器设置-自定义网页背景色使用。
// @author       wugeng-ChatGPT
// @match        https://v.qq.com/*
// @match              *://*555*.*/*
// @match              *://*5dy*.*/*
// @match              *://fskc*.*/*
// @match              *://*.youku.*/*
// @match              *://bluesky-soft.com/*
// @match              *://yandex.com/*
// @match              *://learn.microsoft.com/*
// @match              *://github.com/*
// @match              *://movie.douban.com/annual/*
// @license MIT
// @grant        GM_addStyle 
// @downloadURL https://update.greasyfork.org/scripts/473815/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%89%B2-%E6%B7%B1%E9%BB%91%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/473815/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%89%B2-%E6%B7%B1%E9%BB%91%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在此处更改所需的背景颜色
    const backgroundColor = '#1E1E1E';

    // 添加样式
    GM_addStyle(`body { background-color: ${backgroundColor} !important; }`);
})();