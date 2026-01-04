// ==UserScript==
// @name         b站三倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yuqixuan
// @match       *://www.bilibili.com/video/*
// @match       *://m.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412328/b%E7%AB%99%E4%B8%89%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/412328/b%E7%AB%99%E4%B8%89%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function run(video){
        let uli = document.createElement('li')
        uli.className = 'bilibili-player-video-btn-speed-menu-list'
        uli.innerHTML = '3.0x'
        uli.addEventListener('click', () => {
            video.playbackRate = 3;
            document.getElementsByClassName('bilibili-player-video-btn-speed-name')[0].innerText='3.0x'
        })
        let first = document.getElementsByClassName('bilibili-player-video-btn-speed-menu')[0].firstElementChild
        document.getElementsByClassName('bilibili-player-video-btn-speed-menu')[0].insertBefore(uli, first)
    }
    setTimeout(()=>{
        let video = document.querySelector('video')
        run(video)
        video.addEventListener('ended', function(e) {
            console.log('视频播放完毕')
            setTimeout(()=>{
                run(video)
                video.playbackRate=3;
                document.getElementsByClassName('bilibili-player-video-btn-speed-name')[0].innerText='3.0x'
            },1000)
        })
    },1000)
})();