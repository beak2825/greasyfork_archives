// ==UserScript==
// @name         苏宁手机页面跳转
// @namespace    http://tampermonkey.net/
// @description  苏宁手机版商品页面直接跳转到pc页面
// @author       kjl
// @include      *//m.suning.com/*
// @include      *//product.m.suning.com/*
// @version      0.4
// @grant        none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/369308/%E8%8B%8F%E5%AE%81%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/369308/%E8%8B%8F%E5%AE%81%E6%89%8B%E6%9C%BA%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //直接打开pc端页面
    location.assign("https://product.suning.com/0000000000/"+location.href.toString().match(/\d+.html/g));
})();