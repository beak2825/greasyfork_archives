// ==UserScript==
// @name bilibili b站动态页右侧不展示公告与话题
// @description 小孩子不懂事写着玩的，这么基础的功能居然一直没其他人做过，，，
// @namespace  http://tampermonkey.net/
// @version  1.01
// @author 404eyeman
// @match *://t.bilibili.com/*
// @match *://t.bilibili.com
// @icon https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant  none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474913/bilibili%20b%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E5%8F%B3%E4%BE%A7%E4%B8%8D%E5%B1%95%E7%A4%BA%E5%85%AC%E5%91%8A%E4%B8%8E%E8%AF%9D%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/474913/bilibili%20b%E7%AB%99%E5%8A%A8%E6%80%81%E9%A1%B5%E5%8F%B3%E4%BE%A7%E4%B8%8D%E5%B1%95%E7%A4%BA%E5%85%AC%E5%91%8A%E4%B8%8E%E8%AF%9D%E9%A2%98.meta.js
// ==/UserScript==


var a=function() {
       document.querySelector(".right").style.display='none';
document.querySelector(".bili-dyn-banner").style.display='none';
document.querySelector(".topic-panel").style.display='none';
    };

setTimeout(a,180);
setTimeout(a,1080);
setTimeout(a,2080);