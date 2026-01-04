// ==UserScript==
// @name         良师在线刷视频|湖北工业大学继续教育|ls365.net
// @namespace
// @version      1.1
// @description  脚本将每秒钟检查一次视频播放状态和是否出现“学习下一节”按钮，如果视频未播放则自动播放，并将所有视频的播放速度加速到2倍，如果页面上出现“学习下一节”按钮，脚本将自动点击该按钮以自动进入下一节。
// @icon         http://ls365.net/img/favicon.ico
// @match        *.ls365.net/*
// @grant        none
// @license      GPL-3.0 License
// @namespace    
// @downloadURL https://update.greasyfork.org/scripts/464450/%E8%89%AF%E5%B8%88%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%A7%86%E9%A2%91%7C%E6%B9%96%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%7Cls365net.user.js
// @updateURL https://update.greasyfork.org/scripts/464450/%E8%89%AF%E5%B8%88%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%A7%86%E9%A2%91%7C%E6%B9%96%E5%8C%97%E5%B7%A5%E4%B8%9A%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%7Cls365net.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 每隔 1000 毫秒执行一次匿名函数
    setInterval(function(){
        // 获取第一个视频元素
        var video = document.getElementsByTagName("video")[0];
        if(video){
            // 如果视频暂停，则播放视频
            if(video.paused){
                video.play();
            }
            // 如果页面中存在类名为 'btn bg_blue' 的元素，则点击它
            if(document.getElementsByClassName('btn bg_blue')[0]){
                document.getElementsByClassName('btn bg_blue')[0].click();
            }
        }
    }, 1000);

    // 获取页面中所有视频元素，将它们的播放速度设为 2 倍速
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.playbackRate = 2;
    });
})();

