// ==UserScript==
// @name        去除灰色滤镜
// @namespace   org.glavo
// @version     0.1
// @license     Apache 2.0
// @author      Glavo
// @description 去除 Bilibili、AcFun、知乎、简书、百度贴吧、京东等网站的哀悼灰色滤镜。
// @match       *://*.zhihu.com/*
// @match       *://*.jianshu.com/*
// @match       *://*.bilibili.com/*
// @match       *://*.acfun.cn/*
// @match       *://*.baidu.com/*
// @match       *://*.jd.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455712/%E5%8E%BB%E9%99%A4%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455712/%E5%8E%BB%E9%99%A4%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==


// https://stackoverflow.com/a/46516659/7659948
GM_addStyle ( `
    html {
        filter:grayscale(0) !important;
        -webkit-filter:grayscale(0) !important;
    }
` );