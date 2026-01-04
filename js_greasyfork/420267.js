// ==UserScript==
// @name         B站 /s/ 视频号 url 替换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.bilibili.com/s/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420267/B%E7%AB%99%20s%20%E8%A7%86%E9%A2%91%E5%8F%B7%20url%20%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/420267/B%E7%AB%99%20s%20%E8%A7%86%E9%A2%91%E5%8F%B7%20url%20%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg = /.bilibili\.com\/s\/video/;
    var str = window.location.href;
    if (reg.test(window.location.href)) {
        str = str.replace('/s/video/', '/video/');
        window.location.href = str;
    }
})();