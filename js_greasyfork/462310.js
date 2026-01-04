// ==UserScript==
// @name         驾考宝典练习页去除多余div内容
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  驾考宝典练习页扩展
// @author       niushuai233
// @match        https://www.jiakaobaodian.com/mnks/exercise/*
// @match        https://www.jiakaobaodian.com/mnks/exam/*
// @require      https://update.greasyfork.org/scripts/494892/1376206/jquery-351.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jiakaobaodian.com
// @grant        none
// @license      Apache 2
// @downloadURL https://update.greasyfork.org/scripts/462310/%E9%A9%BE%E8%80%83%E5%AE%9D%E5%85%B8%E7%BB%83%E4%B9%A0%E9%A1%B5%E5%8E%BB%E9%99%A4%E5%A4%9A%E4%BD%99div%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/462310/%E9%A9%BE%E8%80%83%E5%AE%9D%E5%85%B8%E7%BB%83%E4%B9%A0%E9%A1%B5%E5%8E%BB%E9%99%A4%E5%A4%9A%E4%BD%99div%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".layout-header").remove();
    $(".layout-footer").remove();
    $(".com-side-car-sales-rank").remove();
    $(".com-jiaxiao-list-random").remove();
    $(".common-link").remove();
    $(".mnks-exercise").css("min-height", "86vh");
    $(".container").css("min-height", "88vh");
    // Your code here...
})();