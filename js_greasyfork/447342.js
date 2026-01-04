// ==UserScript==
// @name 帅地玩编程优化
// @namespace 无痕
// @version 0.5.2
// @description 开启自动播放下一集，倍速播放
// @author 无痕
// @match https://*.iamshuaidi.com/*
// @require https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @connect iamshuaidi.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447342/%E5%B8%85%E5%9C%B0%E7%8E%A9%E7%BC%96%E7%A8%8B%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/447342/%E5%B8%85%E5%9C%B0%E7%8E%A9%E7%BC%96%E7%A8%8B%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
 'use strict';
    //实时监控间隔时长
    let moitorInterval = 1000
    //是否开启倍速播放
    let isChangeSpeed = true;
    // 视频播放倍率，rate 参数范围[1,6]，1为'0.5'倍，2为'0.75'倍,3为'正常倍速'，4为'1.25'倍速,5为'1.5倍速'，6为‘2.0倍速’
    let rate = 5


        window.onload = function(){
            startAndChangeSpeed()

        let intervalId = setInterval(function() {
            //当前进度条时间
            let currentTime = $("#rizhuti-video > div.dplayer-controller > div.dplayer-icons.dplayer-icons-left > span > span.dplayer-ptime").text()
            //结束时间
            let endTime = $("#rizhuti-video > div.dplayer-controller > div.dplayer-icons.dplayer-icons-left > span > span.dplayer-dtime").text()
            //获取列表长度
            let liLen = $(".list-box li").length
            //获取a标签数量
            let aLen = $(".list-box li a").length

            if(currentTime !='00:00' && currentTime === endTime) {
                console.log("currentTime: "+currentTime+"endTime: "+endTime+"检测到进度条已满,即将播放下一集，aLen="+ aLen);
                if(aLen != 0) {
                    for(let i = 0; i < aLen; i++){
                        //获取a标签的className
                        let aClassName = $(".list-box li a")[i].className
                        //当前列表不是一个视频
                        if(aLen > 1){
                            //不是最后一个视频
                            if(i != aLen - 1){
                                //console.log("i: "+ i +"aLen: "+ aLen)
                                if(aClassName === 'switch-video active' ) {
                                    let currentNo = i + 2;
                                    let clickContext = "#rizhuti-video-page > ul > li:nth-child("+ currentNo + ") > a";
                                    console.log("clickContext: "+clickContext)
                                    $(function(){
                                        $(clickContext)[0].click();
                                        setTimeout(function () {
                                            console.log(aClassName)
                                            //点击开启播放按钮和加速
                                            startAndChangeSpeed()

                                        }, 1000);
                                    })
                                    break
                                }
                            } else {
                                console.log(`当前章节下，最后一个视频,跳下一个章节`)
                                jumpNextChapter()
                            }
                        }
                    }
                }else {
                    //判断是否纯文章，如果不是纯文章自动跳转
                    let isPureArticle = $("#rizhuti-video").val()=='';
                    if(isPureArticle){
                        console.log(`没有列表视频，播放完毕，即将跳下一个章节`)
                        jumpNextChapter()
                    }else {
                        console.log(`当前是纯文章，不自动跳转，好好阅读吧！！`)

                    }

                }

            }

        }, moitorInterval)
    }

    function jumpNextChapter() {
        //所有章节长度，第一个不是视频需要排除
        let dLen = $("#main > div > div > div.sidebar-column.col-lg-3 > div > div > div a").length
        for(let j = 0; j < dLen; j++ ) {
            let currentChapter = $("#main > div > div > div.sidebar-column.col-lg-3 > div > div > div a")[j].getAttribute("equal")=='';
            //获取到当前播放的章节
            if(currentChapter === true && j < dLen) {
                //跳转的下一章节
                console.log(`当前第`)
                $("#main > div > div > div.sidebar-column.col-lg-3 > div > div > div a")[j+1].click();
             }
         }
    }

    function startAndChangeSpeed() {
        //点击开启播放按钮
        $('#rizhuti-video > div.dplayer-controller > div.dplayer-icons.dplayer-icons-left > button').trigger("click");
        if(isChangeSpeed) {
            let speedSelectot = '#rizhuti-video > div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-setting > div > div.dplayer-setting-speed-panel > div:nth-child(' + rate + ')'
            $(speedSelectot).trigger("click");
        }
    }
})();