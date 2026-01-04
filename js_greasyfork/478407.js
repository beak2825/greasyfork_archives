// ==UserScript==
// @name         重定向小雅xiaoya到本地版
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Redirect URL when it starts with specific prefix
// @author       Your name
// @match        https://alist.xiaoya.pro/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478407/%E9%87%8D%E5%AE%9A%E5%90%91%E5%B0%8F%E9%9B%85xiaoya%E5%88%B0%E6%9C%AC%E5%9C%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/478407/%E9%87%8D%E5%AE%9A%E5%90%91%E5%B0%8F%E9%9B%85xiaoya%E5%88%B0%E6%9C%AC%E5%9C%B0%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 输入小雅本地地址
    const localXiaoyaHost = "http://192.168.123.8:5678";

    var newURL = window.location.href.replace(/^https:\/\/alist.xiaoya.pro/, localXiaoyaHost);

    if (newURL !== window.location.href) {
        window.location.href = newURL;
    }
})();
