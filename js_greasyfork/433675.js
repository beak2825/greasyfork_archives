// ==UserScript==
// @icon         http://wechatapppro-1252524126.file.myqcloud.com/apppuKyPtrl1086/image/kblzqm3w07gcrw7zvlir.jpg
// @name         小鹅通倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  小鹅通倍速播放,支持到 4 倍速
// @author       Bamboo
// @include      /^http(s?)://*.pc.xiaoe-tech.com/**$/
// @match        *://*.pc.xiaoe-tech.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/433675/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/433675/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
var website_url = window.location.href || document.location.href;
var website_host = window.location.host || document.location.host;

; (function () {
    'use strict';

     setTimeout(function () {
         $(document).ready(function () {
             console.log('小etong........')
             let prepend3Html = '<li cname="3">3x </li>';
             let prepend35Html = '<li cname="3.5">3.5x</li>';
             let prepend4Html = '<li cname="4">4x</li>';
             $('.xgplayer-playbackrate ul').prepend(prepend3Html);
             $('.xgplayer-playbackrate ul').prepend(prepend35Html);
             $('.xgplayer-playbackrate ul').prepend(prepend4Html);

             $('.xgplayer-playbackrate ul').on('click', 'li', function(e) {
                 $(this).siblings().each(function(){
                    if($(this).prop('class').indexOf('selected') != -1){
                         $(this).prop('class', '');
                    }
                 });

                 $(this).addClass('selected');
                 // $(this).attr('aria-checked', true);
                 // $(this).children('.vjs-control-text').text(', selected')
                 //$('#xiaoe-new-player-style .vjs-playback-rate .vjs-menu-content li.vjs-selected').css('color', '#FFF');
                 document.querySelector("video").playbackRate = $(this).attr('cname');
                 document.querySelector("video").play();
                 console.log('当前播放速度是：', document.querySelector("video").playbackRate)
             });

                document.querySelector("video").addEventListener('play', function () { //播放开始执行的函数
                    console.log("开始播放");
                    if ($('.xgplayer-playbackrate p').innerText.indexOf('x') > -1) {
                                            document.querySelector("video").playbackRate = $('.xgplayer-playbackrate p').innerText.replace('x', '')
                    }
                });
         });
     }, 5000);
})();