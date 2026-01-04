// ==UserScript==
// @name         证券从业课程培训视频插件
// @namespace    https://www.sacedu.cn
// @version      0.3
// @description  2倍速, 静音播放,自动连播
// @author       X5ys
// @match        https://www.sacedu.cn/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509145/%E8%AF%81%E5%88%B8%E4%BB%8E%E4%B8%9A%E8%AF%BE%E7%A8%8B%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/509145/%E8%AF%81%E5%88%B8%E4%BB%8E%E4%B8%9A%E8%AF%BE%E7%A8%8B%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
// 2024-09-19 
// 新增自动连播
// 由于过高倍速会被检测,目前只有2倍速是安全的

(function() {
    'use strict';
    // Your code here...
    // console.log("set ok");
    //if(document.querySelector("head > title").innerHTML != "SAC证券培训"){
    //    console.log(document.querySelector("head > title").innerHTML);
    //    return;
    //}
    var video,videonew;
    var itv = setInterval(get_video_tag, 500);
    var ichange = setInterval(check_change, 5000);
    function get_video_tag(){
        video = document.querySelector("#content video");
        if (video){
            console.log("EXT LOG: 已找到页面中的 video");
            video.playbackRate=2;
            console.log("EXT LOG: 已设置为 2 倍速播放");
            video.muted = true;
            console.log("EXT LOG: 视频已静音播放");
            clearInterval(itv);
        }else{
            console.log("EXT LOG: 未找到页面中的视频");
        }
    }
    function check_change(){
        videonew = document.querySelector("#content video");
        if (video && videonew && video != videonew){
             video = videonew
             console.log("视频已经切换，重新设置播放");
             itv = setInterval(get_video_tag, 500);
        }
    }
})();