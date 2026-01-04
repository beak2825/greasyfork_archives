// ==UserScript==
// @name         移除百度经验的视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://jingyan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390581/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E7%9A%84%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/390581/%E7%A7%BB%E9%99%A4%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E7%9A%84%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let video = document.querySelector('.clearfix.feeds-video-box')
    video.parentNode.removeChild(video)
    // Your code here...
})();