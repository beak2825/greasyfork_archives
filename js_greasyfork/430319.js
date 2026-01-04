// ==UserScript==
// @name         zgjiaoyan
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  中国教研网播放助手，可以帮助点击继续播放，点击播放下一节，不对老师进行评价等
// @author       Kevin
// @match        https://gzxkc.zgjiaoyan.com/*
// @icon         https://www.google.com/s2/favicons?domain=zgjiaoyan.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430319/zgjiaoyan.user.js
// @updateURL https://update.greasyfork.org/scripts/430319/zgjiaoyan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.setInterval(function () {
        //document.documentElement.scrollTop=200;
        //弹出的点我继续按钮
        var buttons = document.getElementsByClassName("alarmClock-wrapper");
        if(buttons.length>0){
            var button = buttons[0];
            //各种名称包含"点我"且显示在界面的按钮，就点击，否则不点击
            if((button.textContent.indexOf("点我")>0&&button.style.display!="none")){
                console.log("继续播放..."+new Date().toLocaleString());
                button.click();
                if(document.getElementsByClassName("vcp-playing").length==0){
                    var play = document.getElementsByClassName("vcp-bigplay");
                    if(play.length>0){
                        play[0].click();
                    }
                }
            }
        }

        //一节播放完后显示的 "下一节" 按钮
        var next = document.getElementsByClassName("next");
        //下一节遮罩是否弹出了
        var nextMask = document.getElementsByClassName("ended-mask")[0].style.display!="none"
        //如果显示的是名字包含"下一节"的按钮，且遮罩弹出了，且当前未播放，就点击下一节按钮
        if(next.length>0&&next[0].textContent.indexOf("下一节")>0&&nextMask){
            console.log("播放下一节..."+new Date().toLocaleString());
            next[0].click();
        }

        //对偶尔弹出的给老师的评价框，如果发现有评价框，直接点击拒绝
        //弹出了评价框
        var ques = document.getElementsByClassName("questionnaire-wrapper");
        if(ques.length>0){
            var queMask = ques[0].style.display=="none";
            //拒绝评价按钮
            var que = document.getElementsByClassName("cancel");
            if(!queMask&&que.length>0){
                console.log("不评价老师..."+new Date().toLocaleString());
                que[0].click();
                console.log(document.getElementsByClassName("questionnaire-wrapper")[0].style.display);
            }
        }

        //校验，如果当前某些原因暂停了，辅助点击继续播放
        //当前是否正在播放
        var playing = document.getElementsByClassName("vcp-playing");
        if(playing.length==0){
            var plays = document.getElementsByClassName("vcp-bigplay");
            if(plays.length>0){
                plays[0].click();
            }
        }
    }, 10000);
})();