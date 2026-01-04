// ==UserScript==
// @name         哔哩哔哩bilibili默认网页全屏
// @namespace    https://greasyfork.org/
// @version      2022.08.08
// @icon         https://www.bilibili.com/favicon.ico
// @icon64       https://s1.ax1x.com/2020/06/17/NV4aEq.png
// @description  Bilibili默认网页全屏，引用更改自大佬https://greasyfork.org/zh-CN/scripts/404862-%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E5%AE%BD%E5%B1%8F
// @author       cngege 优化
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://*.bilibili.com/medialist/play/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449097/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/449097/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9bilibili%E9%BB%98%E8%AE%A4%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var counter=0;
    let iscensor = true;
    //let url = geturl();//获取刚加载脚本时的Url
    setTimeout(censor,1000);
    go();
    function go(){
        counter++;
        if($(".bpx-player-ctrl-btn.bpx-player-ctrl-web").length){
               //if(document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-fullscreen:not(.closed)")!=null)
               //setTimeout(function(){document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-fullscreen:not(.closed)").click();iscensor = false;},500);
               setTimeout(function(){$(".bpx-player-ctrl-btn.bpx-player-ctrl-web:not(.bpx-state-entered)").click();iscensor = false;},500);
        }
        else if($(".bilibili-player-video-btn.bilibili-player-video-btn-webscreen").length){
            setTimeout(function(){document.querySelector(".bilibili-player-video-btn.bilibili-player-video-btn-webscreen:not(.closed)").click();iscensor = false;},500);
        }
        else if(geturl().indexOf("bilibili.com/bangumi/play/") != -1){//如果是番剧页面
            let bangumivideo = $(".bpx-docker.bpx-docker-major div.bpx-player-container");
            let bangumi = $(".squirtle-video-pagefullscreen.squirtle-video-item");//bpx-player-ctrl-btn
            if(bangumivideo.length > 0 && bangumi.length > 0){
                //如果是默认的模式
                if(bangumivideo.attr("data-screen") == "normal"){
                    bangumi.click();
                    iscensor=false;
                }
            }else{
                if(counter>30){
                    //同一个URL页面最多只执行30次
                    iscensor = false;
                    return;
                }
                setTimeout(go,300);
            }
        }
        else{
            if(counter>30){
                //同一个URL页面最多只执行30次
                iscensor = false;
                return;
            }
            setTimeout(go,300);
        }
    }

    //每2秒循环执行判断一次 否则本页面切换视频脚本不重复执行
    function censor(){
        if(!iscensor&&url!=geturl()){
           counter=0;
           go();
           url = geturl();
        }
        setTimeout(censor,2000);
    }

    function geturl(){
        return window.location.href;
    }

})();