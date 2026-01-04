// ==UserScript==
// @name         保密在线
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  音频10倍速，点击视频可暂停
// @author       AN drew
// @match        *://www.baomi.org.cn/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494474/%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/494474/%E4%BF%9D%E5%AF%86%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let t1=setInterval(function(){
        if($('#player-con').length>0)
        {
            if($('#player-con').length>0)
            {
                clearInterval(t1);
                $('#player-con').click(function(){
                    $('.prism-play-btn').get(0).click();
                });
            }
            if($('.prism-controlbar').length>0)
            {
                $('.prism-controlbar').click(function(e){
                    e.stopPropagation();
                })
            }
            if($('.prism-volume-control').length>0)
            {
                $('.prism-volume-control').click(function(e){
                    e.stopPropagation();
                })
            }
            if($('.prism-thumbnail').length>0)
            {
                $('.prism-thumbnail').click(function(e){
                    e.stopPropagation();
                })
            }
        }
    },1000)

    setInterval(function(){
        if($('.audio-fixed').length>0)
        {
            document.querySelector('.audio-html').playbackRate=10;
        }
    },1000);
})();