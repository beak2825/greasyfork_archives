// ==UserScript==
// @name         B站优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉b站弹幕, 开启清爽观影模式
// @author       You
// @match        http://www.bilibili.com/video/*
// @grant        none
// @run-at       @run-at document-idle  
// @downloadURL https://update.greasyfork.org/scripts/28270/B%E7%AB%99%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/28270/B%E7%AB%99%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    clean(2000);

    $( window ).resize(function() {
        clean(100);
    });

    function clean(seconds){

        setTimeout(function(){

            $('#bilibiliPlayer .bilibili-player-video-message').height(0);
            $('#bilibiliPlayer .bilibili-player-auxiliary-area').hide();

            $('#bilibiliPlayer .bilibili-player-video-progress').width(800);
            $('#bilibiliPlayer .bilibili-player-area').width($('#bilibiliPlayer').width() );
            $('.v-title h1').attr("style","overflow:visible");
            $("i[name='ctlbar_danmuku_close']").click();
        },seconds);


    }

})();