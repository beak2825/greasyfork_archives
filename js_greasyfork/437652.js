// ==UserScript==
// @name         研修大摸鱼
// @namespace    Eucliwood
// @version      1.0.5
// @description  内部使用，请勿外泄
// @author       Eucliwood
// @match        https://ipx.yanxiu.com/grain/course/*
// @icon         https://srt-read-online.3ren.cn/basebusiness/headimg/20200711/1594463211851X00rZyPRV8-23.png
// @grant        unsafeWindow
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/437652/%E7%A0%94%E4%BF%AE%E5%A4%A7%E6%91%B8%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/437652/%E7%A0%94%E4%BF%AE%E5%A4%A7%E6%91%B8%E9%B1%BC.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Your code here...
    setInterval(function(){
        try{//ended-mask
            var main_video=document.querySelector("video")
            if(null!=main_video){
                if(main_video.muted==false){
                main_video.volume=0;
            }
            }
            var Endedmask=document.getElementsByClassName("ended-mask")[0].style.display;
            if(Endedmask=="none"){//未弹出下一个窗口
                console.log("未完成");
                if(document.getElementsByClassName("scoring-wrapper")[0].style.display==""){//弹出打分框
                    document.getElementsByClassName("rate-item")[9].click();
                    document.getElementsByClassName("commit")[0].children[0].click();
                    
                }
                if(document.getElementsByClassName("alarmClock-wrapper")[0].style.display==""){//弹出计时框
                    document.getElementsByClassName("alarmClock-wrapper")[0].click();
                }
                if(null!=document.getElementsByTagName("video")[0]){
                    if(document.getElementsByTagName("video")[0].paused){
                    document.getElementsByTagName("video")[0].play();
                }
                }
                
            }else{//弹出下一个窗口
                
                var nextTag=document.getElementsByClassName("next")[0];
                nextTag.click();
            }
        }catch(err){
            console.log(err);
        } 
    },1000);
})();