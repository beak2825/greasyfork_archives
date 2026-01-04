// ==UserScript==
// @name         bilibili主页跳转到动态
// @version      11.4.5.1.4
// @description  bilibili主页跳转到动态，避免刷视频上瘾，推荐搭配取消推荐栏使用。（https://greasyfork.org/zh-CN/scripts/439625-%E5%B1%8F%E8%94%BDb%E7%AB%99-bilibili-%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E4%B8%AD%E5%8F%B3%E4%BE%A7%E7%9B%B8%E5%85%B3%E8%A7%86%E9%A2%91%E6%8E%A8%E8%8D%90%E4%B8%8E%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A）
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?spm_id_from=
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1229773
// @downloadURL https://update.greasyfork.org/scripts/481597/bilibili%E4%B8%BB%E9%A1%B5%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/481597/bilibili%E4%B8%BB%E9%A1%B5%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to redirect from www.bilibili.com to t.bilibili.com
    function redirectBilibili() {
        var currentURL = window.location.href;
        var redirectToURL = 'https://t.bilibili.com/';

        if (currentURL === 'https://www.bilibili.com/') {
            window.location.href = redirectToURL;
        } else if (currentURL.includes('https://www.bilibili.com/?spm_id_from=')) {
            window.location.href = redirectToURL;
        }
    }

    // Check and perform the redirection
    redirectBilibili();
})();
