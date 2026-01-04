// ==UserScript==
// @name         自动去掉B站地址栏的/s
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在谷歌访问B站某些BV视频时, 地址栏会有一个/s, 下拉看不到评论区. 这个脚本自动去掉了地址栏里的/s.
// @author       slw
// @match        https://www.bilibili.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407926/%E8%87%AA%E5%8A%A8%E5%8E%BB%E6%8E%89B%E7%AB%99%E5%9C%B0%E5%9D%80%E6%A0%8F%E7%9A%84s.user.js
// @updateURL https://update.greasyfork.org/scripts/407926/%E8%87%AA%E5%8A%A8%E5%8E%BB%E6%8E%89B%E7%AB%99%E5%9C%B0%E5%9D%80%E6%A0%8F%E7%9A%84s.meta.js
// ==/UserScript==

(function() {
    var originalURL= document.URL;
    var changedURL = originalURL.replace(/\/s/, "");
    window.location.href=changedURL;
})();