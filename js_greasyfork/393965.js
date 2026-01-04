// ==UserScript==
// @name         国内主流网站视频去Logo
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  腾讯、优酷、爱奇艺、B站直播logo
// @match        http*://v.qq.com/*
// @match        http*://v.youku.com/*
// @match        http*://www.iqiyi.com/*
// @match        https://live.bilibili.com/*
// @resource     https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393965/%E5%9B%BD%E5%86%85%E4%B8%BB%E6%B5%81%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E5%8E%BBLogo.user.js
// @updateURL https://update.greasyfork.org/scripts/393965/%E5%9B%BD%E5%86%85%E4%B8%BB%E6%B5%81%E7%BD%91%E7%AB%99%E8%A7%86%E9%A2%91%E5%8E%BBLogo.meta.js
// ==/UserScript==



setTimeout(function (){
     document.querySelectorAll(".iqp-logo-box").forEach(function(item,index,arr){item.style.display='none';});
    document.querySelectorAll(".iqp-logo-top").forEach(function(item,index,arr){item.style.display='none';});
     document.querySelectorAll(".txp_waterMark_pic").forEach(function(item,index,arr){item.style.display='none';});
    document.querySelectorAll(".spv-logo").forEach(function(item,index,arr){item.style.display='none';});
    document.querySelectorAll(".bilibili-live-player-video-logo").forEach(function(item,index,arr){item.style.display='none';});

}, 3000);