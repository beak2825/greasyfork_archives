// ==UserScript==
// @name         哔哩哔哩视频播放自动二倍速，取消默认静音
// @namespace    http://tampermonkey.net/
// @version      2024-10-29
// @description  哔哩哔哩视频播放自动二倍速，取消默认静音，主要是自己在手机端通过via浏览器的电脑模式看b站视频时用的脚本，上传平台是为了方便自己多端更新和测试。
// @author       wzc25151
// @match        https://www.bilibili.com/video*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511684/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E9%80%9F%EF%BC%8C%E5%8F%96%E6%B6%88%E9%BB%98%E8%AE%A4%E9%9D%99%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/511684/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E9%80%9F%EF%BC%8C%E5%8F%96%E6%B6%88%E9%BB%98%E8%AE%A4%E9%9D%99%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isSetPlaybackoRate = false;//是否设置过倍速
    var isSetVideoNoMuted = false;//是否设置过静音
    var rateInterval;
    var noMutedInterval;

    function setPlaybackRate(){
        var rate2xBtn = $('[data-value="2"]:contains("2.0x")');
        if(isSetPlaybackoRate) return;
        if(!rate2xBtn.length) return;
        rate2xBtn.click();
        isSetPlaybackoRate = true;
        clearInterval(rateInterval);
    }

    function setVideoMuted(){
        var volumeBtn = $('[aria-label="音量"]:contains("")');
        if(isSetVideoNoMuted)return;
        if(!volumeBtn.length)return;
        //volumeBtn.click();//发现用鼠标点击音量图标有作用，用这个代码模拟点击没作用
        document.querySelector('video').muted =false;
        isSetVideoNoMuted = true;
        clearInterval(noMutedInterval);
    }



    function onLoadStart(){
        //发现via浏览器上使用document.querySelector('video')来设置就不会自动开播了
        document.querySelector('video').playbackRate = 2;//直接设置播放倍数
        rateInterval  = setInterval(setPlaybackRate,1000);//防止直接设置播放倍数不生效，这里模拟点击来设置倍数

        //发现各种模拟点击播放在via上没用，不折腾了
        // document.querySelector('video').play();
        //$('[aria-label="播放/暂停"]:contains("")').click();
        // setTimeout($('[aria-label="播放/暂停"]:contains("")').click(),1000);
    }

    function onPlaying(){
        document.querySelector('video').muted =false;//取消静音，发现b站需要在视频正在播放的状态下才生效
        noMutedInterval  = setInterval(setVideoMuted,1000);//防止上行代码不生效
    }
    // $('video').on('playing', onLoadStart).trigger('loadstart');
    $('video').on('playing', onPlaying).trigger('playing');
    $('video').on('loadstart', onLoadStart).trigger('loadstart');
})();