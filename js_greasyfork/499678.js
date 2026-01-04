// ==UserScript==
// @name         Twitter to X Redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Redirects twitter.com to x.com twitter 转 x
// @author       JunFengLi666
// @match        *://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499678/Twitter%20to%20X%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/499678/Twitter%20to%20X%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前 URL
    var currentUrl = window.location.href;

    // 将 www.twitter.com 转换为 www.x.com
    var newUrl = currentUrl.replace('twitter.com', 'x.com');

    // 重定向到新 URL
    window.location.replace(newUrl);
})();
