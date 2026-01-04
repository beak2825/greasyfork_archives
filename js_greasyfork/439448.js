// ==UserScript==
// @name         九江学院电子资源平台链接直接跳转助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于九江学院电子资源平台链接直接跳转助手
// @license      九江学院电子资源平台链接直接跳转助手
// @author       文人病
// @match        *://jxjjxy.cwkeji.cn/ermsClient/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439448/%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%E7%94%B5%E5%AD%90%E8%B5%84%E6%BA%90%E5%B9%B3%E5%8F%B0%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/439448/%E4%B9%9D%E6%B1%9F%E5%AD%A6%E9%99%A2%E7%94%B5%E5%AD%90%E8%B5%84%E6%BA%90%E5%B9%B3%E5%8F%B0%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var urls = $(".green").attr("href");
    $(window).attr('location',urls);
})();