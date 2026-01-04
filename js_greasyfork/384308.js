// ==UserScript==
// @name         Fuckhnkjzyxy
// @namespace    ysypnbh@gmail.com
// @version      0.11
// @description  测试。
// @author       ysypnbh
// @run-at       document-body
// @match      *://*.hunbys.com/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/384308/Fuckhnkjzyxy.user.js
// @updateURL https://update.greasyfork.org/scripts/384308/Fuckhnkjzyxy.meta.js
// ==/UserScript==

$(function() {
    'use strict';
    var window = unsafeWindow
    var isPlaying = true;
    var nowcat = ''
    var video = document.getElementById("video")
    var oldInitVideo = window.LearnCourse.initVideo
    window.LearnCourse.initVideo = function(cbiId,catId,classType,event){
        nowcat=catId
        if(nowcat>=597121){
           alert("为保证20天学习自然日，请您关闭脚本，余下课程请您20天内每日手动看几分钟\n\nby ZeshanwXiao");
        }
        oldInitVideo(cbiId,catId,classType,event)
        console.log(nowcat)
    }
    
    var t1=window.setInterval(function(){
        video.playbackRate = 2
        window.ClassWork.popExam = function(){
        }
        video.onended = function(){
            if(nowcat>=597121){
                return;
            }
            window.location.reload()
        }
        video.play();
    }, 100);
})();
