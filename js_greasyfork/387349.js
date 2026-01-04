// ==UserScript==
// @name         菜鸟教程去广告，清爽学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.runoob.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387349/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%B8%85%E7%88%BD%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/387349/%E8%8F%9C%E9%B8%9F%E6%95%99%E7%A8%8B%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E6%B8%85%E7%88%BD%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var ad = document.getElementsByClassName('ad-600160');//获取广告元素
    var ad_parent = ad[0].parentNode;//广告元素的父节点
    ad_parent.removeChild(ad[0]);//移除广告节点

    var ad2 = document.getElementsByClassName('adsbygoogle');//获取广告元素
    var ad2_parent = ad2[0].parentNode;//广告元素的父节点
    ad2_parent.removeChild(ad2[0]);//移除广告节点


})();