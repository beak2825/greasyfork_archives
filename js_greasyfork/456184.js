// ==UserScript==
// @name         学堂在线
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  学堂在线播放完当前小节后，自动播放下一节
// @author       goolete
// @match        https://www.xuetangx.com/learn/*
// @icon         https://www.google.com/s2/favicons?domain=mycourse.cn
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456184/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/456184/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("开始运行");
    setTimeout( function(){
        setTimeout( function(){
            setInterval(function(){
                try{
                    var video = document.getElementsByTagName('video')[0];
                    video.muted = true;
                }catch(e){
                    document.getElementsByClassName('next')[0].click();
                }

                var current = video.currentTime;
                var duration = video.duration;

                if(document.getElementsByClassName('play-btn-tip')[0].textContent == '播放'){
                    //document.getElementsByClassName('xt_video_bit_play_btn')[0].click();
                    video.play();
                }
                if(current > duration-5){
                    document.getElementsByClassName('next')[0].click();
                }
            }, 2000)
        }, 1 * 1000 );//延迟1000毫秒

    }, 4 * 1000 );//延迟5000毫秒

})();