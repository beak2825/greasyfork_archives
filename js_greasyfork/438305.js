// ==UserScript==
// @name         师加网自动切换播放列表视频
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  师加网，单主题下有多个视频的，定时检测视频是否停止播放并切换当前课程下的下一个视频
// @author       JCB
// @license      MIT
// @match        *://nlts.teacherplus.cn/learning/task*
// @downloadURL https://update.greasyfork.org/scripts/438305/%E5%B8%88%E5%8A%A0%E7%BD%91%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/438305/%E5%B8%88%E5%8A%A0%E7%BD%91%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //主题列表

    //主题中的视频列表
    var ahref = $("a[href^='/learning/task']");
    var index = 0;
    setInterval(function() {
        //视频
        //var player = document.getElementById("example_video_1").player;
        //左下角按键(播放/暂停/重播)
        var playbutton = $('.vjs-control-bar :button')[0];
        //播放完成后的弹窗确认键
        var confirmbutton = $('.modal-footer :button')[0];
        //当前地址
        var currenthref=location.href;
        if(confirmbutton){
            confirmbutton.click();
        }
        if(playbutton.title=="Play"){
            playbutton.click();
            return;
        }else if(playbutton.title=="Replay"){
            for(var i=0;i<ahref.length;i++){
                if(ahref[i]==currenthref){
                    index=i+1;
                    break;
                }
            }
            if(index<ahref.length) {
                location.href=ahref[index].href;
            }
        }
    }, 5000);
})();