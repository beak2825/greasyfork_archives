// ==UserScript==
// @name         微博移动端域名链接自动重定向网页版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动把 m.weibo.cn 改成 m.weibo.com
// @author       ChatGPT
// @match        *://m.weibo.cn/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/531821/%E5%BE%AE%E5%8D%9A%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%9F%9F%E5%90%8D%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531821/%E5%BE%AE%E5%8D%9A%E7%A7%BB%E5%8A%A8%E7%AB%AF%E5%9F%9F%E5%90%8D%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当前地址
    const currentUrl = window.location.href;

    // 如果域名是 m.weibo.cn，替换成 m.weibo.com
    if (currentUrl.includes('m.weibo.cn')) {
        const newUrl = currentUrl.replace('m.weibo.cn', 'm.weibo.com');
        window.location.replace(newUrl);
    }
})();
