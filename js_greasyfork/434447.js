// ==UserScript==
// @name         优慕课定时刷新刷课时
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  网页定时刷新 refresh_interval
// @author       wangjie999
// @match        http://jiaoxue.cugbonline.cn/meol/microlessonunit/viewMicroLessnMulti.do?*
// @icon         https://www.google.com/s2/favicons?domain=cugbonline.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434447/%E4%BC%98%E6%85%95%E8%AF%BE%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%88%B7%E8%AF%BE%E6%97%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/434447/%E4%BC%98%E6%85%95%E8%AF%BE%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%88%B7%E8%AF%BE%E6%97%B6.meta.js
// ==/UserScript==

const refresh_interval = 1000 * 60 * 40;

(function () {
    'use strict';
    var video = document.getElementById("ckplayer_video");

    setInterval(function () {
        window.location.reload(true);
    }, refresh_interval);

    setInterval(() => {
        if (video && video.pause) {
            try{video.play();} catch(e){}
        }else{
           video = document.getElementById("ckplayer_video");
        }
    }, 1500);

    setTimeout(() => {

        if(video){
            video.addEventListener('playing', function () { //播放中
            console.log("播放中");
        });

        video.addEventListener('waiting', function () { //加载
            console.log("加载中");
        });

        video.addEventListener('pause', function () { //暂停开始执行的函数
            console.log("暂停播放");
            video.play();
        });

        video.addEventListener('ended', function () { //结束
            console.log("播放结束");
            window.location.reload(true);
        }, false);
        }

        
    }, 2000);

})();