// ==UserScript==
// @name         重定向B站视频分享链接
// @namespace    https://greasyfork.org/zh-CN/scripts/479942
// @version      0.1.4
// @description  将B站链接重定向到单独的视频页面
// @author       rteta
// @match        https://www.bilibili.com/*bvid=*
// @exclude      https://www.bilibili.com/festival/*
// @exclude      https://www.bilibili.com/video/*/?bvid=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479942/%E9%87%8D%E5%AE%9A%E5%90%91B%E7%AB%99%E8%A7%86%E9%A2%91%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/479942/%E9%87%8D%E5%AE%9A%E5%90%91B%E7%AB%99%E8%A7%86%E9%A2%91%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    var cleanUrl = url.split('&')[0];
    window.location.href = cleanUrl.replace("/?bvid=", "/video/") + "/?t=0";
})();

//将域名里的 /?bvid= 替换为 /video/ 并且在末尾加上 /?t=0