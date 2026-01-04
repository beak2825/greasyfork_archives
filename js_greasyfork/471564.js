// ==UserScript==
// @name         升学e网通(EWT360)持续播放
// @namespace    https://space.bilibili.com/475523025
// @version      2.2.5
// @description  新版升学e网通(EWT360)网页版自动不暂停
// @author       幻想一笑而过
// @match        https://teacher.ewt360.com/ewtbend/bend/index/*
// @match        https://web.ewt360.com/site-study/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMCAxMCIgY2xhc3M9ImRlc2lnbi1pY29uZm9udCI+CiAgPHBhdGggZD0iTTIsNCBDMi41NTIyODQ3NSw0IDMsNC40NDc3MTUyNSAzLDUgTDMsMTAgQzMsMTAuNTUyMjg0NyAyLjU1MjI4NDc1LDExIDIsMTEgQzEuNDQ3NzE1MjUsMTEgMSwxMC41NTIyODQ3IDEsMTAgTDEsNSBDMSw0LjQ0NzcxNTI1IDEuNDQ3NzE1MjUsNCAyLDQgWiBNNiw1IEM2LjU1MjI4NDc1LDUgNyw1LjQ0NzcxNTI1IDcsNiBMNywxMCBDNywxMC41NTIyODQ3IDYuNTUyMjg0NzUsMTEgNiwxMSBDNS40NDc3MTUyNSwxMSA1LDEwLjU1MjI4NDcgNSwxMCBMNSw2IEM1LDUuNDQ3NzE1MjUgNS40NDc3MTUyNSw1IDYsNSBaIE0xMCwxIEMxMC41NTIyODQ3LDEgMTEsMS40NDc3MTUyNSAxMSwyIEwxMSwxMCBDMTEsMTAuNTUyMjg0NyAxMC41NTIyODQ3LDExIDEwLDExIEM5LjQ0NzcxNTI1LDExIDksMTAuNTUyMjg0NyA5LDEwIEw5LDIgQzksMS40NDc3MTUyNSA5LjQ0NzcxNTI1LDEgMTAsMSBaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMSAtMSkiIGZpbGw9IiM1QThCRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPgo8L3N2Zz4K
// @contributionURL https://afdian.net/a/Svip9
// @contributionAmount 5
// @compatible   edge
// @compatible   chrome
// @compatible   firefox
// @license      GPL-3.0-only
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471564/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%28EWT360%29%E6%8C%81%E7%BB%AD%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/471564/%E5%8D%87%E5%AD%A6e%E7%BD%91%E9%80%9A%28EWT360%29%E6%8C%81%E7%BB%AD%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vacationURL="https://teacher.ewt360.com/ewtbend/bend/index/index.html#/homework/play-videos?courseId=" // 假期任务视频
    var normalVideoURL="https://web.ewt360.com/site-study/#/playVideo?courseId=" // E讲堂视频
    var id="";
    var testId="";
    let bURL="";
    let href="";
    let i=0;
    function waitForElementToDisplay(selector, time) {
        if(document.querySelector(selector)){
            setTimeout(function() {
                console.log(`${selector} 对象已出现`);
                bURL="";
                for(let j=0;j<vacationURL.length;j++){
                    bURL+=location.href[j];
                }
                if(vacationURL==bURL){
                    i=0;
                    document.querySelector("#ewt-teacher-main-container > div > div").appendChild(document.querySelector("#ewt-teacher-main-container > div > div > div > div.play_video_main_content_box > div > div.course_package_right_container"))
                    while(!document.querySelector("#vjs_video_"+i.toString())){
                        i++;
                    }
                    id=i.toString();
                    console.log("id = "+id);
                    i=0;
                    while(!document.querySelector("#rc-tabs-"+i.toString()+"-panel-1 > div > ul > div > li > div > div.course_chapter_btn_box > a > p")){
                        if(i>1000)break;
                        i++;
                    }
                    testId=i.toString();
                    console.log("testId = "+testId);
                    href=location.href;
                }else {
                    bURL="";
                    for(let j=0;j<normalVideoURL.length;j++){
                        bURL+=location.href[j];
                    }
                    if(normalVideoURL==bURL){
                        i=0;
                        //document.querySelector("#root > div > div.play_video_main_box > div.play_video_main_content_box.W1200 > div.course_extrame").appendChild(document.querySelector("#root > div > div.play_video_main_box > div.play_video_main_content_box.W1200 > div.course_package_container > div.course_package_right_container"))
                        while(!document.querySelector("#vjs_video_"+i.toString())){
                            i++;
                        }
                        id=i.toString();
                        console.log("id = "+id);
                        href=location.href;
                    }
                }
                return;
            }, 1200);
        }
        else {
            setTimeout(function() {
                waitForElementToDisplay(selector, time);
            }, time);
        }
    }
    for(let j=0;j<vacationURL.length;j++){
        bURL+=location.href[j];
    }
    console.log("判断链接："+bURL);
    if(vacationURL==bURL){
        waitForElementToDisplay("#video_player_box",100);
    }else{
        bURL="";
        for(let j=0;j<normalVideoURL.length;j++){
            bURL+=location.href[j];
        }
        if(normalVideoURL==bURL){
            waitForElementToDisplay("#video_player_box",100);
        }
    }
    $("body").bind("keydown",function(e){
        e=window.event||e;
        //禁止空格键翻页
        if(event.keyCode==32){
            return false;
        }
    });
    var inClose = true;
    setInterval(function(){
        if(href!=location.href){
            console.log("页面变更");
            bURL="";
            for(let j=0;j<vacationURL.length;j++){
                bURL+=location.href[j];
            }
            console.log("判断链接："+bURL);
            href=location.href;
            if(vacationURL==bURL){
                waitForElementToDisplay("#video_player_box",100);
            }else{
                bURL="";
                for(let j=0;j<normalVideoURL.length;j++){
                    bURL+=location.href[j];
                }
                if(normalVideoURL==bURL){
                    waitForElementToDisplay("#video_player_box",100);
                }
            }
        }
        if(document.querySelector("#earnest_check_unpass_play > p:nth-child(1) > img")){ // 被暂停
            document.querySelector("#earnest_check_unpass_play > p:nth-child(1) > img").click(); // 瞬间继续播放
        }
        if(document.querySelector("#vjs_video_"+id+" > div.video-interactive-layer > div > div > div.question-combition > div.skip-container > div.btn.action-skip")){ // 出现题目时
            document.querySelector("#vjs_video_"+id+" > div.video-interactive-layer > div > div > div.question-combition > div.skip-container > div.btn.action-skip").click(); // 果断跳过
        }
        if(inClose&&document.querySelector("#vjs_video_"+id+" > div.vjs-control-bar > button.vjs-play-control.vjs-control.vjs-button.vjs-paused.vjs-ended")){ // 视频播放完成
            console.log('视频播放完成');
            inClose = false;
            if(document.querySelector("#rc-tabs-"+testId+"-panel-1 > div > ul > div > li > div > div.course_chapter_btn_box > a > p")){
                console.log('打开练习')
                document.querySelector("#rc-tabs-"+testId+"-panel-1 > div > ul > div > li > div > div.course_chapter_btn_box > a > p").click(); // 如果有练习则打开练习界面
                window.location.href="https://www.ewt360.com/"; // 返回主页
            }else{
                console.log('返回主页')
                window.location.href="https://www.ewt360.com/"; // 返回主页
            }
        }
        for(let k=0;k<100;k++){
            if(document.querySelector("body > div:nth-child("+k.toString()+") > div > div.ant-modal-wrap > div > div.ant-modal-content > div")){ // 《一心多用》
                document.querySelector("body > div:nth-child("+k.toString()+") > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button").click(); // 关闭弹窗
                if(document.querySelector("#vjs_video_"+id+" > button"))document.querySelector("#vjs_video_"+id+" > button").click(); // 继续播放
            }
        }
    }, 10);
})();