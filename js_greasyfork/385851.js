// ==UserScript==
// @name         移除B站视频播放页面广告
// @namespace    http://tampermonkey.net/
// @version      114514.1919
// @description  移除B站视频页面广告 & 自动展开推荐视频列表
// @author       SENPAI
// @match        *://*.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385851/%E7%A7%BB%E9%99%A4B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/385851/%E7%A7%BB%E9%99%A4B%E7%AB%99%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%A1%B5%E9%9D%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var delay = 5000; //根据网速自行调整脚本执行延时
   
    setTimeout(function(){
        $('#bannerAd').remove();
        $('#slide_ad').remove();
        $('.rec-footer').get(0).click();
    },delay);
})();