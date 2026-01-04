// ==UserScript==
// @name         做视频网的MP4视频提取
// @namespace    https://blog.csdn.net/weixin_42081389
// @version      0.1
// @description  为了弹出视频的mp4地址
// @author       
// @match        https://www.zuoshipin.com/movie/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393076/%E5%81%9A%E8%A7%86%E9%A2%91%E7%BD%91%E7%9A%84MP4%E8%A7%86%E9%A2%91%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/393076/%E5%81%9A%E8%A7%86%E9%A2%91%E7%BD%91%E7%9A%84MP4%E8%A7%86%E9%A2%91%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    console.log("做视频网的MP4视频提取")
    alert("做视频网的MP4视频提取")
    var mp4_path = $("video[src$='.mp4']").attr("src")
    alert(mp4_path)
    console.log("mp4_path",mp4_path)
})();