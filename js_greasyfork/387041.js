// ==UserScript==
// @name         wangke创就业
// @namespace    imxzixuan@gmail.com
// @version      1.0
// @description  用来解除湖南省大学生创新创业就业学院的限制更好的刷课。
// @author       dz
// @run-at       document-body
// @match      *://*.hunbys.com/*
// @require      https://code.jquery.com/jquery-1.8.3.min.js
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/387041/wangke%E5%88%9B%E5%B0%B1%E4%B8%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/387041/wangke%E5%88%9B%E5%B0%B1%E4%B8%9A.meta.js
// ==/UserScript==
//感谢，前辈Zeshawn Xiao的贡献，在他的代码基础增加了自动播放下一集功能。


$(function() {
    'use strict';
    var window = unsafeWindow
    var isPlaying = true;
    var nowcat = ''
    var video = document.getElementById("video")
    var oldInitVideo = window.LearnCourse.initVideo
    window.LearnCourse.initVideo = function(cbiId,catId,classType,event){
        nowcat=catId
        
        oldInitVideo(cbiId,catId,classType,event)
        console.log(nowcat)
    }

    var t1=window.setInterval(function(){
        video.playbackRate = 7
        window.ClassWork.popExam = function(){
        }
         video.onended =function(){

             window.onload=window.LearnCourse.initVideo(6476,nowcat+1,1,event);
             window.location.reload();
         }

        video.play();
    }, 100);
})();

