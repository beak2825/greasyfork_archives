// ==UserScript==
// @name         自动播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description    学无止境，勇攀高峰！
// @author         网络服务（QQ：953278312）
// @include        *basic.smartedu.cn*
// @include        *gp.chinahrt.com*
// @grant        none
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/489373/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/489373/%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var t;
    setTimeout(function(){
        t = window.setInterval(play,10000);//重复执行某个方法
        function play() {
            var video=document.querySelector('video');
            //window.alert(video.paused)
            if(video.paused){
                //window.alert("1")
                video.play();
            }
        }
    },10000);
    // Your code here...
})();
