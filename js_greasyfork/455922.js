// ==UserScript==
// @name            禁用微博首页黑白特效
// @name:en         Disable grayscale on Weibo.com
// @namespace       http://neet.coffee/
// @version         0.32
// @description     禁用微博首页部分黑白特效
// @description:en  Disable the grayscale effects on weibo.com
// @author          Neet-Nestor
// @license         MIT
// @match           *://*.weibo.com/*
// @icon            https://weibo.com/favicon.ico
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/455922/%E7%A6%81%E7%94%A8%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E9%BB%91%E7%99%BD%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455922/%E7%A6%81%E7%94%A8%E5%BE%AE%E5%8D%9A%E9%A6%96%E9%A1%B5%E9%BB%91%E7%99%BD%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.querySelectorAll('.grayTheme').forEach((ele) => {
        ele.classList.remove('grayTheme');
    });

    // Periodically check for any more grayTheme to remove
    setInterval(() => {
        document.querySelectorAll('.grayTheme').forEach((ele) => {
            ele.classList.remove('grayTheme');
        });
    }, 1000);
})();