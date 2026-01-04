// ==UserScript==
// @name         旧版：B站首页、搜索页、视频播放页、个人空间
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  需要换成旧版的时候运行一次后刷新即可
// @author       aotmd
// @match        https://*.bilibili.com/*
// @noframes
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465891/%E6%97%A7%E7%89%88%EF%BC%9AB%E7%AB%99%E9%A6%96%E9%A1%B5%E3%80%81%E6%90%9C%E7%B4%A2%E9%A1%B5%E3%80%81%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%A1%B5%E3%80%81%E4%B8%AA%E4%BA%BA%E7%A9%BA%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/465891/%E6%97%A7%E7%89%88%EF%BC%9AB%E7%AB%99%E9%A6%96%E9%A1%B5%E3%80%81%E6%90%9C%E7%B4%A2%E9%A1%B5%E3%80%81%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E9%A1%B5%E3%80%81%E4%B8%AA%E4%BA%BA%E7%A9%BA%E9%97%B4.meta.js
// ==/UserScript==
var now = new Date();
var time = now.getTime();
time += 365 * 24 * 60 * 60 * 1000; // 一年的毫秒数
now.setTime(time);

/*搜索页老样式:*/
document.cookie = "nostalgia_conf=2; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
/*搜索页老样式:*/
document.cookie = "i-wanna-go-feeds=-1; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com;";
/*首页老样式:*/
document.cookie = "i-wanna-go-back=2; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com;";
/*视频老样式:*/
document.cookie = "go_old_video=1; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
/*番剧页老样式*/
document.cookie = "go-old-ogv-video=1; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
/*我也不知道这个cookie是什么意思*/
document.cookie = "rpdid=|(k|mllmRJJR0J'uY)lkRJRlY; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";
/*个人空间老样式*/
document.cookie = "go-old-space=1; expires=" + now.toUTCString() + "; path=/; domain=.bilibili.com";