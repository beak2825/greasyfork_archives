// ==UserScript==
// @name         蝌蚪窝视频突破限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.xkd*.com/videos/*
// @match        http://www.xkd12.com/videos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376188/%E8%9D%8C%E8%9A%AA%E7%AA%9D%E8%A7%86%E9%A2%91%E7%AA%81%E7%A0%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/376188/%E8%9D%8C%E8%9A%AA%E7%AA%9D%E8%A7%86%E9%A2%91%E7%AA%81%E7%A0%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
var url=$('.info > div:nth-child(5) > a:nth-child(1)').attr('href'),vele=document.createElement('video');
    $('div.player').html(vele);vele.src=url;$('video').attr({'controls':'controls','preload':'auto'});
    // Your code here...
})();