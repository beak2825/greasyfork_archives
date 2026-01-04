// ==UserScript==
// @name         探索者
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *://www.bilibili.com/*
// @match        *://music.163.com/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381680/%E6%8E%A2%E7%B4%A2%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/381680/%E6%8E%A2%E7%B4%A2%E8%80%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    $(window.document).keyup(function(e) {
        if (e.keyCode == 192) {
            if (url.indexOf("www.bilibili.com")>=0) {
                bilibili();
            } else if (url.indexOf("music.163.com/#/song")>=0) {
                netease();
            }
        };
    });
    function bilibili() {
        var baseUrl = "https://www.bilibili.com/video/av";
        var amount = 50000000;
        var aid = Math.ceil(Math.random()*amount);
        window.location.href = baseUrl + aid;
    }
    function netease() {
        var baseUrl = "https://music.163.com/#/song?id=";
        var amount = 1346104327;
    }
})();
