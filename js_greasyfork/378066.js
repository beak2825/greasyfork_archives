// ==UserScript==
// @name         修改B站视频速度及展示等
// @namespace    http://tampermonkey.net/
// @version      0.1.17
// @description  try to take over the world!
// @author       Decradish
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/378066/%E4%BF%AE%E6%94%B9B%E7%AB%99%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E5%8F%8A%E5%B1%95%E7%A4%BA%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/378066/%E4%BF%AE%E6%94%B9B%E7%AB%99%E8%A7%86%E9%A2%91%E9%80%9F%E5%BA%A6%E5%8F%8A%E5%B1%95%E7%A4%BA%E7%AD%89.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var iPlaybackRate = 1.7, //rate
		tmMedia = document.getElementsByTagName("video")[0] || document.getElementsByTagName("bwp-video")[0]; //视频dom
 
    //默认取消弹幕（是的，我就是不喜欢在弹幕网站里看弹幕）
    var evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, false);
    var barrageInterval = setInterval(function(){
        var oBarrageBtn = document.querySelector('.bilibili-player-video-danmaku-switch input[type="checkbox"]');
        if(!oBarrageBtn){return false;}
 
        oBarrageBtn.dispatchEvent(evt);
        clearInterval(barrageInterval);
    }, 100);
 
    //设置播放速率
    tmMedia.playbackRate = iPlaybackRate;
	tmMedia.onplay = function(){
        console.log('onplay');
		tmMedia.playbackRate = iPlaybackRate;
	};
	tmMedia.oncanplay = function(){
        console.log('oncanplay');
		tmMedia.playbackRate = iPlaybackRate;
	};

    //检测播放速率，若被更改则重置
    var watchSpeed = setInterval(function(){
        var curSpeed = tmMedia.playbackRate;

        if(curSpeed !== iPlaybackRate){
            tmMedia.playbackRate = iPlaybackRate;
            clearInterval(watchSpeed);
        }
    }, 100);
 
    // Websocket完成后会重置下视频速率，这里监听下console.log设置视频播放速率。为了防止以后B站去除这个逻辑，旧版方法就不删除了
    var originallog = window.console.log;
    window.console.log = function(txt) {
        // Do really interesting stuff
        // alert("I'm doing interesting stuff here !");
 
        if('[Websocket]: On Open.' === txt){
            setTimeout(function(){
                tmMedia.playbackRate = iPlaybackRate;
            }, 0);
        }
 
        originallog.apply(console, arguments);
    };
 
    //自动播放
    var evt4Play = document.createEvent('MouseEvents');
        evt4Play.initEvent('click', true, false);
    var playInterval = setInterval(function(){
        var oWidescreenBtn = document.getElementsByClassName('bilibili-player-video-btn-widescreen')[0];
        var oVideoStateBlackside = document.getElementsByClassName('video-state-blackside')[0];
        if(!oVideoStateBlackside){return false;}
 
        tmMedia.play();
        oWidescreenBtn.dispatchEvent(evt4Play);
        // 暗色
        // document.getElementsByTagName('body')[0].style.filter = 'inver(1) hue-rotate(180deg)';
        // document.querySelectorAll('video, img, .bilibili-player-video-control-wrap *').forEach(function(i) {i.style.filter = 'invert(1) hue-rotate(180deg)';});
        clearInterval(playInterval);
    }, 100);
})();