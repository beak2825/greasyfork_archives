// ==UserScript==
// @name 搜索跳转微软桌面
// @description     播放视频
// @include         *baidu*.com/*
// @version         0.1
// @grant none
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/390904/%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%BE%AE%E8%BD%AF%E6%A1%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/390904/%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC%E5%BE%AE%E8%BD%AF%E6%A1%8C%E9%9D%A2.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //获取解析网址
    var currentUrl = "https://g.wangwei.me/#q="+window.location.href.split("word=")[1];
    window.location.href=currentUrl; 
})();