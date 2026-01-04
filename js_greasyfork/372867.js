// ==UserScript==
// @name         隐藏部分B站模块
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  屏蔽部分广告和推广，推荐搭配"哔哩哔哩（bilibili.com）分区隐藏"脚本使用
// @author       Umiama
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372867/%E9%9A%90%E8%97%8F%E9%83%A8%E5%88%86B%E7%AB%99%E6%A8%A1%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/372867/%E9%9A%90%E8%97%8F%E9%83%A8%E5%88%86B%E7%AB%99%E6%A8%A1%E5%9D%97.meta.js
// ==/UserScript==
window.$(document).ready(function(){
    window.$("div#chief_recommend").css("display","none");//首页推荐
    window.$("div.bangumi-module").find("div.r-con").css("display","none");//番剧-特别推荐
    window.$("div.bangumi-module").find("div.new-comers-module&div.l-con").css("display","none");//番剧-番剧动态
    window.$("div#fixed_app_download").css("display","none");//浮动App推广
    window.$("div.gg-floor-module").css("display","none");//广告
    window.$("div#slide_ad").css("display","none");//播放页滑动广告
});

window.onload = function(){//防止资源加载完成后再次出现
    window.$("div#fixed_app_download").css("display","none");//浮动App推广
    window.$("div.gg-floor-module").css("display","none");//广告
    window.$("div#slide_ad").css("display","none");//播放页滑动广告
};