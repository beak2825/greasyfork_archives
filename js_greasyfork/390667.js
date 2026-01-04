// ==UserScript==
// @name 搜索跳转
// @description     播放视频
// @include         *baidu*.com/*
// @version         0.1
// @grant none
// @namespace
// @namespace https://greasyfork.org/users/381425
// @downloadURL https://update.greasyfork.org/scripts/390667/%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/390667/%E6%90%9C%E7%B4%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //获取解析网址
    var currentUrl = "https://g.wangwei.me/#q="+window.location.href.split("wd=")[1];
    window.location.href=currentUrl; 
})();