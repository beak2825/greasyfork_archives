// ==UserScript==
// @name         证券从业课程培训视频插件
// @namespace    http://training.sac.net.cn/learnspace/learn/
// @version      0.2
// @description  16倍速, 静音播放
// @author       X5ys
// @match        http://training.sac.net.cn/learnspace/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434106/%E8%AF%81%E5%88%B8%E4%BB%8E%E4%B8%9A%E8%AF%BE%E7%A8%8B%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/434106/%E8%AF%81%E5%88%B8%E4%BB%8E%E4%B8%9A%E8%AF%BE%E7%A8%8B%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // Your code here...
    // console.log("set ok");
    if(document.querySelector("head > title").innerHTML != "课件视频播放"){
        console.log(document.querySelector("head > title").innerHTML);
        return;
    }
    var video;
    var itv = setInterval(get_video_tag, 500);
    function get_video_tag(){
        video = document.querySelector("#container_media > video");
        if (video){
            console.log("EXT LOG: 已找到页面中的 video");
            video.playbackRate=16;
            console.log("EXT LOG: 已设置为 16 倍速播放");
            video.muted = true;
            console.log("EXT LOG: 视频已静音播放");
            clearInterval(itv);
        }else{
            console.log("EXT LOG: 未找到页面中的视频");
        }
    }
})();