// ==UserScript==
// @name         bilibili哔哩哔哩3，3.5，4倍速工具
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  按a：3倍速，按s：3.5倍速，按d：4倍速，按z取消特殊倍速即变成2倍速，按x：2.5倍速
// @author       李华1100
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455190/bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A93%EF%BC%8C35%EF%BC%8C4%E5%80%8D%E9%80%9F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/455190/bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A93%EF%BC%8C35%EF%BC%8C4%E5%80%8D%E9%80%9F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a_speed=3;
    var s_speed=3.5;
     var d_speed=4;
    document.onkeydown=function(e){//对整个页面监听
    var keyNum=window.event ? e.keyCode :e.which;//获取被按下的键值
    
    if(keyNum==65){
        if(document.querySelector('video')){     
        document.querySelector('video').playbackRate = a_speed;
        }else{ 
        document.querySelector('bwp-video').playbackRate = a_speed;
        }
    }
    if(keyNum==68){
        if(document.querySelector('video')){
        document.querySelector('video').playbackRate = d_speed;
        }else{
        document.querySelector('bwp-video').playbackRate = d_speed;
        }
    }
    if(keyNum==83){
        if(document.querySelector('video')){   
        document.querySelector('video').playbackRate = s_speed;
        }else{
        document.querySelector('bwp-video').playbackRate = s_speed;
        }
    }
    if(keyNum==88){
        if(document.querySelector('video')){   
        document.querySelector('video').playbackRate = 2.5;
        }else{
        document.querySelector('bwp-video').playbackRate = 2.5;
        }
    }
    if(keyNum==90){
        if(document.querySelector('video')){
        document.querySelector('video').playbackRate = 2;
        }else{
        document.querySelector('bwp-video').playbackRate = 2;
        }
    }
    }
})();