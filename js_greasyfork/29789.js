// ==UserScript==
// @name         花椒直播精简播放界面
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自适应窗口宽度
// @author       cH
// @match        http://www.huajiao.com/
// @include      *://*huajiao.com/l/*
// @include      *://*huajiao.com/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29789/%E8%8A%B1%E6%A4%92%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/29789/%E8%8A%B1%E6%A4%92%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==
// @require      http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
(function() {
    'use strict';
    var video = $('#player');
    video.attr('height',$(window).height());
    $('body').css('min-width','0px');
    $('body').empty();
    $("body").prepend(video);
    $(window).resize(function(){
        video.attr('height',$(window).height());
    });
})();