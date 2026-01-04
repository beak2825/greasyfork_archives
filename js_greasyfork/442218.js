// ==UserScript==
// @name         限制哔哩哔哩视频播放不了
// @namespace    https://coycs.com/
// @version      0.2.5
// @author       燕子

// @include           *://*.bilibili.com/video/*
// @include           *://*.bilibili.com/bangumi/play/*


// @include           *://m.bilibili.com/video/*
// @include           *://m.bilibili.com/anime/*
// @include           *://m.bilibili.com/bangumi/play/*

// @grant        none
// @license MIT
// @description 限制哔哩哔哩视频播放不了安装这个会限制哔哩哔哩视频播放 卸载就好了
// @downloadURL https://update.greasyfork.org/scripts/442218/%E9%99%90%E5%88%B6%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%B8%8D%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/442218/%E9%99%90%E5%88%B6%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E4%B8%8D%E4%BA%86.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var xianzhi = setInterval(function () {
        document.querySelector('video').playbackRate = 0
    }, 500);
    window.fn = function () {
        clearInterval(xianzhi)
        document.querySelector('video').playbackRate = 1
    }
})();