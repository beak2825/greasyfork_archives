// ==UserScript==
// @name         zteam自动重定向sso登录前界面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zteam自动重定向sso登录前界面, 防止频繁跳回首页
// @author       You
// @match        https://devops.ztn.cn/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510837/zteam%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91sso%E7%99%BB%E5%BD%95%E5%89%8D%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/510837/zteam%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91sso%E7%99%BB%E5%BD%95%E5%89%8D%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self === window.top) {
        const isRedirect = !['https://devops.ztn.cn/console/', 'https://devops.ztn.cn'].includes(window.location.href);
        // Save the current URL to localStorage
        if (isRedirect) {
            localStorage.setItem('LAST_FULL_URL', window.location.href);
        }

        var lastUrl = localStorage.getItem('LAST_FULL_URL');
        if (lastUrl && !isRedirect && lastUrl !== isRedirect) {
            // Redirect to the last URL
            window.location.href = lastUrl;
        }
    }
})();