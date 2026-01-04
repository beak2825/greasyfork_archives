// ==UserScript==
// @name         知乎重定向到 fxzhihu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  将知乎网址重定向到 fxzhihu.com
// @author       juzeon
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525716/%E7%9F%A5%E4%B9%8E%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%20fxzhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/525716/%E7%9F%A5%E4%B9%8E%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%20fxzhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前完整URL
    const currentURL = window.location.href;

    // 检查是否已经是 fxzhihu.com
    if (currentURL.includes('fxzhihu.com')) {
        return;
    }

    // 替换域名，保留前缀
    const newURL = currentURL.replace(/(www|zhuanlan)\.zhihu\.com/, '$1.fxzhihu.com');

    // 执行重定向
    window.location.href = newURL;
})();
