// ==UserScript==
// @name         bilibili哔哩哔哩长按倍速
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  长按a三倍速，长按s四倍速
// @author       西电网信院的废物lx（rytter）
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444636/bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/444636/bilibili%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%95%BF%E6%8C%89%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var speed=1;
    var a_speed=3;
    var s_speed=4;
    document.onkeydown=function(e){//对整个页面监听
    var keyNum=window.event ? e.keyCode :e.which;//获取被按下的键值
    if(keyNum==83){
        if(document.querySelector('video')){
        if(document.querySelector('video').playbackRate!=s_speed){
        speed=document.querySelector('video').playbackRate;
        }
        document.querySelector('video').playbackRate = s_speed;
        }else{
        if(document.querySelector('bwp-video').playbackRate!=s_speed){
        speed=document.querySelector('bwp-video').playbackRate;
        }
        document.querySelector('bwp-video').playbackRate = s_speed;
        }
    }
    if(keyNum==65){
        if(document.querySelector('video')){
        if(document.querySelector('video').playbackRate!=a_speed){
        speed=document.querySelector('video').playbackRate;
        }
        document.querySelector('video').playbackRate = a_speed;
        }else{
        if(document.querySelector('bwp-video').playbackRate!=a_speed){
        speed=document.querySelector('bwp-video').playbackRate;
        }
        document.querySelector('bwp-video').playbackRate = a_speed;
        }
    }
    }
    document.onkeyup=function(e){//对整个页面监听
    var keyNum=window.event ? e.keyCode :e.which;//获取被按下的键值
    if(keyNum==83){
        if(document.querySelector('video')){
        document.querySelector('video').playbackRate = speed;
        }else{
        document.querySelector('bwp-video').playbackRate = speed;
        }
    }
    if(keyNum==65){
        if(document.querySelector('video')){
        document.querySelector('video').playbackRate = speed;
        }else{
        document.querySelector('bwp-video').playbackRate = speed;
        }
    }
    }
      // Your code here...
})();