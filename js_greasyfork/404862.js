// ==UserScript==
// @name         哔哩哔哩bilibili默认宽屏
// @namespace    https://greasyfork.org/scripts/404862-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%AE%BD%E5%B1%8F/code/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%AE%BD%E5%B1%8F.user.js
// @version      2024.10.17.01
// @iconURL      https://s21.ax1x.com/2024/10/16/pANtpiF.png
// @icon64URL    https://i.postimg.cc/G24h51db/Sprite-64.png
// @description  Bilibili默认宽屏/全屏（自动点击按钮）
// @author       cngege
// @match        *://*.bilibili.com/list/*
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://*.bilibili.com/medialist/play/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.aspnetcdn.com/ajax/jquery/jquery-3.4.0.min.js
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404862/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/404862/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

//https://s1.ax1x.com/2020/06/17/NV4aEq.png
(function() {
    'use strict';
    /* globals jQuery, $*/

    //GM_getValue("wordtype",0);
    //0: 默认宽屏
    //1: 默认网页全屏
    let wordtype = ()=>GM_getValue("wordtype",0); // 0 ~ 1;
    //let menu_command = null;

    GM_registerMenuCommand("设置默认宽屏", function(){
        GM_setValue("wordtype",0);
    });
    GM_registerMenuCommand("设置默认网页全屏", function(){
        GM_setValue("wordtype",1);
    });
    var counter=0;
    let iscensor = true; // 当前页面是否需要检查
    let url = geturl();// 获取刚加载脚本时的Url
    setTimeout(censor,1000);
    go();
    function go(){
        counter++;
        // 表示宽屏而不是网页全屏
        if(wordtype() == 0){
            if(geturl().indexOf("bilibili.com/bangumi/play/") != -1){//如果是番剧页面
                let bangumivideo = $(".bpx-docker.bpx-docker-major div.bpx-player-container");
                let bangumi = $(".squirtle-video-widescreen.squirtle-video-item");//bpx-player-ctrl-btn
                if(bangumi.length == 0) bangumi = $(".bpx-player-ctrl-btn.bpx-player-ctrl-wide");
                if(bangumivideo.length > 0 && bangumi.length > 0){
                    //如果是默认的模式
                    if(bangumivideo.attr("data-screen") == "normal"){
                        bangumi.click();
                        video_locate();
                        iscensor=false;
                    }else if(bangumivideo.attr("data-screen") == "wide"){
                        return;
                    }
                }
            }else{  // 如果只是普通的视频页面 https://www.bilibili.com/video/
                if($(".bpx-player-ctrl-btn.bpx-player-ctrl-wide").length){
                    setTimeout(function(){$(".bpx-player-ctrl-btn.bpx-player-ctrl-wide:not(.bpx-state-entered)").click();},500);
                    video_locate();
                    iscensor = false;
                }
                else if($(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen").length){
                    setTimeout(function(){document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-widescreen:not(.closed)").click();},500);
                    video_locate();
                    iscensor = false;
                }
            }
        }else{ // 表示是网页全屏 wordtype == 1
            if(geturl().indexOf("bilibili.com/bangumi/play/") != -1){//如果是番剧页面
                let bangumivideo = $(".bpx-docker.bpx-docker-major div.bpx-player-container");
                let bangumi = $(".squirtle-video-pagefullscreen.squirtle-video-item");
                if(bangumi.length == 0) bangumi = $(".bpx-player-ctrl-btn.bpx-player-ctrl-web");
                if(bangumivideo.length > 0 && bangumi.length > 0){
                    //如果是默认的模式
                    if(bangumivideo.attr("data-screen") == "normal"){
                        bangumi.click();
                        iscensor=false;
                    }else if(bangumivideo.attr("data-screen") == "web"){
                        return;
                    }
                }
            }else{  // 如果只是普通的视频页面 https://www.bilibili.com/video/
                if($(".bpx-player-ctrl-btn.bpx-player-ctrl-web").length){
                    setTimeout(function(){$(".bpx-player-ctrl-btn.bpx-player-ctrl-web:not(.bpx-state-entered)").click();},500);
                    iscensor = false;
                }else if($(".bilibili-player-video-btn.bilibili-player-video-web-fullscreen").length){
                    setTimeout(function(){$(".bilibili-player-video-btn.bilibili-player-video-web-fullscreen:not(.closed)").click();},500);
                    iscensor = false;
                }
            }
        }


        //同一个URL页面最多只执行30次
        if(counter>30){
            iscensor = false;
        }
        if(iscensor) setTimeout(go,300);
    }

    //每2秒循环执行判断一次 否则本页面切换视频脚本不重复执行
    // 每次在同页中切换URL，就会执行一次GO();
    function censor(){
        if(url!=geturl()){
           counter=0;
           iscensor=true;
           go();
           url = geturl();
        }
        setTimeout(censor,2000);
    }

    function geturl(){
        return window.location.href;
    }

    function video_locate(){
      if(geturl().indexOf("#reply") == -1){ // 表示传入链接没有指示要定位到某个评论
        window.scrollTo(0, 40);
      }
    }

})();