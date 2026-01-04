// ==UserScript==
// @name         虎扑自动跳转
// @version      0.1
// @description  手机版虎扑,自动跳转到对应的网页版
// @author       中出zc
// @match        *://m.hupu.com/bbs/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/220160
// @downloadURL https://update.greasyfork.org/scripts/520593/%E8%99%8E%E6%89%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520593/%E8%99%8E%E6%89%91%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a = location.href;
    a = a.replace("https://m.hupu.com/bbs/", "https://bbs.hupu.com/");
    location.href = a;
})();