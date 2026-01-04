// ==UserScript==
// @name         B站热键脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  B站热键脚本!
// @author       tareo
// @match        *://www.bilibili.com/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/434634/B%E7%AB%99%E7%83%AD%E9%94%AE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/434634/B%E7%AB%99%E7%83%AD%E9%94%AE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //tmpr:记忆速率
    var tmpr=1;
    console.log("RAN");
    window.onload=function(){
        console.log("LOADED")
        try{
            dashPlayer;
        }catch(ev){
            // console.error(ev);
            console.error("---"+ev.name+"---"+ev.message);
            // console.error(ev.stack);
            // throw ev.name+" "+ev.message
        }
        try{
            //如何在文档载入之后，jQuery存在，设置按钮存在下，立即调用鼠标模拟
            // console.info("$ IS "+$);
            console.info(document.querySelectorAll("[class$='u-setting']"))
            $("[class$='u-setting']").mouseover().mouseleave();
            console.info("---")
        }catch(ev){
            console.info("---"+ev.name+"---"+ev.message);
        }
    }
    document.onkeydown=function(e){

        //t：按键发生位置的标签名
        //tc:按键发生位置的类名
        //r：按下时的倍速
        //d：合法倍速
        var t=e.target.tagName.toLowerCase();
        var tc=e.target.className.toLowerCase();
        var r
        var d=(a)=>(a>16?16:(a<1/16?0:a));
        // console.log(e.target.tagName+" "+e.target.className+"\t");
        // console.log(t!="input" & t!="textarea" & tc!="ql-editor")

        //若不存在弹幕设置区，则模拟鼠标经过使之创建弹幕设置区
        !$("[ftype=top]")[0] && $("[class$='u-setting']").mouseover().mouseleave();
        !$("[data-type=typeTop]")[0] && $("[class='bpx-player-dm-setting-left']").mouseover().mouseleave();

        //若弹幕设置区存在，则不模拟鼠标经过使之创建弹幕设置区，反之模拟
        // $("[ftype=top]")[0]||$("[class$='u-setting']").mouseover().mouseleave();

        //在输入区域外工作
        if(t!="input" & t!="textarea" & tc!="ql-editor"){
            //当前速率
            r=$("video")[0].playbackRate

            switch(e.key){
                //弹幕
                case "t":
                    $("[data-type=typeTopBottom]").click()
                break
                case "g":
                    $("[ftype=scroll]").click()
                    $("[data-type=typeScroll]").click()
                break
                case "c":
                    $("[data-type=typeColor]").click()
                break
                case "G":
                    $("[ftype=Special]").click()
                    $("[data-type=typeSpecial]").click()
                break
                    
                //字幕
                case "z":
                    $("div[aria-label=字幕] div span")[0].click()
                break

                //速率
                //大写键会影响
                case "j":
                    //-0.1
                    setRate((r*10-1)/10)
                break
                case "J":
                    //-1
                    //4.1-3=1.0999999999999996???
                    setRate((r*10-10)/10)
                break
                case "l":
                    //+0.1
                    setRate((r*10+1)/10)
                break
                case "L":
                    //+1
                    setRate(r+1)
                break
                case "k":case "K":
                    //1倍速与记忆速率互转
                    if(r!=1){
                        tmpr = r
                        setRate(1)
                    }else{
                        setRate(tmpr)
                    }
                break

            }
            switch(e.key){
                //调出弹幕管理
                case "r":
                    if($("[class='bilibili-player-video-danmaku-setting-wrap']")[0]){
                        console.log("r1")
                        if($("[class='bilibili-player-video-danmaku-setting-wrap']")[0].style.display=="none"){
                            $("[class$='u-setting']").mouseover()
                            // $("[class='bilibili-player-video-danmaku-setting-wrap']")[0].style.display="block"
                        }else if($("[class='bilibili-player-video-danmaku-setting-wrap']")[0].style.display=="block"){
                            $("[class$='u-setting']").mouseleave()
                            // $("[class='bilibili-player-video-danmaku-setting-wrap']")[0].style.display="none"
                        }
                    }else if($("[class='bpx-player-dm-setting-wrap']")[0]){
                        console.log("r2")
                        if($("[class='bpx-player-dm-setting-wrap']")[0].style.display=="none"){
                            //模拟鼠标不奏效
                            // $("[class='bpx-player-dm-setting']").mouseover()
                            $("[class='bpx-player-dm-setting-wrap']")[0].style.display="block"
                        }else if($("[class='bpx-player-dm-setting-wrap']")[0].style.display=="block"){
                            // $("[class='bpx-player-dm-setting']").mouseleave()
                            $("[class='bpx-player-dm-setting-wrap']")[0].style.display="none"
                        }
                    }

                break
                //调出弹幕字体管理
                case "a":
                    $("[class='bp-svgicon']").mouseover()
                break
            }
        }

        function setRate(x){
            $("video")[0].playbackRate=( d(x) );
            //设置后的速率
            $("[aria-label=倍速]").html( d(x) + "X" );
            console.log(d(x));
        }
    }
})();