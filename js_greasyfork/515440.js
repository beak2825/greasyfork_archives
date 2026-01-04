// ==UserScript==
// @name         电脑浏览器中打开 m. 手机版网站时自动切换回 www. 电脑版网页
// @namespace    https://greasyfork.org
// @version      1.0.0.8
// @include      *://m.*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @description 澎湃新闻,喜马拉雅,界面新闻,网易新闻,重定向.
// @downloadURL https://update.greasyfork.org/scripts/515440/%E7%94%B5%E8%84%91%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E6%89%93%E5%BC%80%20m%20%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E7%AB%99%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%9B%9E%20www%20%E7%94%B5%E8%84%91%E7%89%88%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/515440/%E7%94%B5%E8%84%91%E6%B5%8F%E8%A7%88%E5%99%A8%E4%B8%AD%E6%89%93%E5%BC%80%20m%20%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E7%AB%99%E6%97%B6%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E5%9B%9E%20www%20%E7%94%B5%E8%84%91%E7%89%88%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a map of mobile to desktop hostnames
    const siteMap = {
        "m.thepaper.cn": "thepaper.cn",
        "m.huxiu.com": "huxiu.com",
        "m.jiemian.com": "jiemian.com",
        "m.ximalaya.com": "www.ximalaya.com",
        "m.dongqiudi.com":"www.dongqiudi.com",
        "m.163.com":"www.163.com",
        "m.stnn.cc":"www.stnn.cc",
        "m.douban.com":"www.douban.com",
        "m.gelonghui.com":"www.gelonghui.com",
        "m.jd.com":"www.jd.com",
        "m.18183.com":"www.18183.com"
    };

    // Check if the current hostname is in the siteMap and redirect if needed
    const desktopHostname = siteMap[location.hostname];
    if (desktopHostname) {
        location.replace(location.href.replace(location.hostname, desktopHostname));
    }
})();