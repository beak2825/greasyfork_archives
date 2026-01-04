// ==UserScript==
// @name 91rb
// @description     播放视频
// @include         *91rb*.net/videos/*
// @version         0.1
// @grant none
// @namespace https://greasyfork.org/users/381425
// @downloadURL https://update.greasyfork.org/scripts/421240/91rb.user.js
// @updateURL https://update.greasyfork.org/scripts/421240/91rb.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //获取解析网址
    var currentUrl = "https://rd.91cdn.xyz/hls/videos/"+window.location.href.split("videos/")[1].split("/")[0].substr(0,window.location.href.split("videos/")[1].split("/")[0].length-3)+"000"+"/"+window.location.href.split("videos/")[1].split("/")[0]+"/"+window.location.href.split("videos/")[1].split("/")[0]+".mp4/index.m3u8";
    window.location.href=currentUrl; 
})();