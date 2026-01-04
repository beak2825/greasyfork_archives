// ==UserScript==
// @name         重庆理工自考刷课脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @license       MIT
// @description  重庆理工大学在线学习平台刷课脚本
// @match        *://cqlg.360xkw.com/*
// @downloadURL https://update.greasyfork.org/scripts/514812/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E8%87%AA%E8%80%83%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/514812/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E8%87%AA%E8%80%83%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.onreadystatechange = function(){
        if(document.readyState === 'complete'){
            var courseAll = document.getElementsByClassName('kmList')[0].querySelectorAll('li');
            var videoEl = document.getElementById('live_video');
            var playList = document.getElementsByClassName('layui-colla-content layui-show')[0].querySelectorAll('li');
            var playIndex = 0;
            courseAll.forEach((item, index) => {
                item.addEventListener('click', () => {
                    console.log('更新了科目，重置播放P数与播放列表');
                    playList = document.getElementsByClassName('layui-colla-content layui-show')[0].querySelectorAll('li');
                    playIndex = 0;
                })
            })
            function getPlayIndex (){
                for(var i=0;i<playList.length;i++){
                    var className = playList[i].children[0].getAttribute('class');
                    if(className.indexOf('onLive')>0){
                        playIndex = i;
                        break;
                    }
                }
            };
            if(videoEl){
                console.log('找到视频实例，开始监听');
                // console.log('开始1.5倍速播放视频'); // 倍速播放会导致视频刷完了但是时长不够
                // videoEl.playbackRate = 1.5;

                const currentTime = videoEl.currentTime; // 获取当前播放时间（秒）
                const now = new Date();
                const timestampDirect = Date.now(); // 直接获取的当前时间戳
                const videoDuration = videoEl.duration; // 获取视频总时长
                const remainingTime = videoDuration - currentTime; // 计算剩余播放时间 (单位：秒)
                const videoEndTime = new Date(now.getTime() + remainingTime * 1000); // 视频结束的本地时间戳

                console.log(`当前时间戳:${timestampDirect},已播放时间（秒）:${currentTime},未播放时间（秒）:${remainingTime},视频将在本地时间戳结束:${videoEndTime.getTime()}`);

                // 计算并打印剩余时间（单位：毫秒）
                console.log('距离视频结束还有（毫秒）:', remainingTime * 1000);
                videoEl.volume = 0.01;
                // 播放结束
                videoEl.addEventListener('ended',function(){
                    if(playIndex < playList.length-1){
                        console.log('播放结束，自动下一P');
                        setTimeout(function(){
                            playList[++playIndex].querySelector('a').click();
                        },1000);
                    }else{
                        alert('所有视频已播放完毕');
                    }
                })
                // 播放开始
                videoEl.addEventListener('play', function () {
                    getPlayIndex();
                    console.log('正在播放第：'+ playIndex,'P');
                    // videoEl.playbackRate = 1.5;
                });
            }else{
                alert('视频实例没找到')
            }
        }
    }
})();
