// ==UserScript==
// @name         豆瓣音乐重定向
// @namespace    http://your.namespace/
// @version      0.1
// @description  重定向豆瓣音乐链接
// @author       You
// @match        https://artist.douban.com/m/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482373/%E8%B1%86%E7%93%A3%E9%9F%B3%E4%B9%90%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/482373/%E8%B1%86%E7%93%A3%E9%9F%B3%E4%B9%90%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取原始路径部分
    var path = window.location.pathname;

    // 判断是否包含 '/m'
    if (path.includes('/m')) {
        // 移除路径中的 '/m'
        path = path.replace('/m', '');

        // 重定向到指定网址
        window.location.href = 'https://site.douban.com' + path;
    }
})();
