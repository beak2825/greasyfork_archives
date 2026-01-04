// ==UserScript==
// @name         熊猫星颜直播精简播放界面，窗口全屏
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  自适应窗口宽度，窗口全屏，自适应宽高
// @author       cH
// @match        https://xingyan.panda.tv/
// @include      *://xingyan.panda.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32464/%E7%86%8A%E7%8C%AB%E6%98%9F%E9%A2%9C%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%EF%BC%8C%E7%AA%97%E5%8F%A3%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/32464/%E7%86%8A%E7%8C%AB%E6%98%9F%E9%A2%9C%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%EF%BC%8C%E7%AA%97%E5%8F%A3%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==
// @require      http://cdn.bootcss.com/jquery/2.1.4/jquery.min.js
(function() {
    'use strict';
    if(document.getElementById('swfid')){
        var video = jQuery('#swfid');
    jQuery('body').empty();
    jQuery("body").prepend(video);
    setTimeout(function(){
        var video = jQuery('#swfid');
        video.attr('height',$(window).height());
        video.attr('width',jQuery(window).height()*7/9);
        video.css('margin','0 auto');
        video.css('position','absolute');
         video.css('left','-50%');
         video.css('right','-50%');
                         },1000);
    jQuery(window).resize(function(){
        var video = jQuery('#swfid');
        video.attr('height',$(window).height());
        video.attr('width',jQuery(window).height()*7/9);
        console.log(1);
    });
    }
})();