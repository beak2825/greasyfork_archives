// ==UserScript==
// @name         手机虎扑内容自动跳转网页版
// @version      0.1
// @description  手机虎扑,自动跳转网页版
// @author       yann
// @match        *://m.hupu.com/bbs-share/*
// @icon         https://w1.hoopchina.com.cn/images/pc/old/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/1062363
// @downloadURL https://update.greasyfork.org/scripts/464278/%E6%89%8B%E6%9C%BA%E8%99%8E%E6%89%91%E5%86%85%E5%AE%B9%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/464278/%E6%89%8B%E6%9C%BA%E8%99%8E%E6%89%91%E5%86%85%E5%AE%B9%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a=location.href;
    a=a.replace("m.","bbs.");
    a=a.replace("/bbs-share","");
    location.href=a;
})();