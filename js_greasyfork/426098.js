// ==UserScript==
// @name         哔哩哔哩播放器显示时间
// @description  播放器右上角显示系统时间
// @author       cngege
// @version      2021.5.8.1
// @namespace    bilibili_video_time
// @icon         https://www.bilibili.com/favicon.ico
// @icon64       https://s1.ax1x.com/2020/06/17/NV4aEq.png
// @match        *://*.bilibili.com/video/*
// @match        *://*.bilibili.com/watchlater/*
// @match        *://*.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/blackboard/newplayer.html*
// @require      https://cdn.bootcss.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/426098/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E5%99%A8%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/426098/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E6%92%AD%E6%94%BE%E5%99%A8%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    let videotime_div_css = {
        "opacity":"1",
        "visibility":"visible",
        "display": "flex",
        "-webkit-box-flex": 0,
        "-ms-flex": "none",
        "flex": "none",
        "min-width": "64px",
        "margin": "18px 20px 0 0",
        "height": "24px",
        "line-height": "24px",
        "border-radius": "12px",
        "background": "rgba(33,33,33,.9)",
        "pointer-events": "all",
        "text-align": "center",
        "z-index": "2",
        "cursor": "pointer"
    }
    let videotime_div = $('<div class="video_time_div"></div>').append('<span class="bilibili-player-video-top-follow-text" id="video_time_show" style="margin:auto">00:00:00</span>');
    videotime_div.css(videotime_div_css);
    let videotimenode=null;
    let code = 0;
    let url = window.location.href;
    let pause = false;
    //插入节点&修改时间
    $(document).ready(function(){
        code = setInterval(addHtmlNode,1000);
    })

    function addHtmlNode(){
        if(videotimenode!=null){
            let date = new Date();
            let H = date.getHours();
            let M = date.getMinutes();
            let S = date.getSeconds();
            H = (H<10)?"0"+H:H;
            M = (M<10)?"0"+M:M;
            S = (S<10)?"0"+S:S;
            videotimenode.text(H+":"+M+":"+S);
        }
        if(url != window.location.href){
            pause = false;
            url = window.location.href;
        }
        if(pause)
            return;
        let find2 = $("div.bilibili-player-video-top div.bilibili-player-video-top-follow");
        if(find2.length > 0){
            //find2.before(videotime);
            videotime_div.insertBefore("div.bilibili-player-video-top div.bilibili-player-video-top-follow")
            videotimenode = $("div.bilibili-player-video-top span#video_time_show");
            pause = true;
            //clearInterval(code)
        }
    }

    //切换全屏的时候 调整样式
    window.onresize = function() {
        console.log("okk");
        if ($(".bilibili-player.mode-fullscreen .bilibili-player-area .bilibili-player-video-wrap .bilibili-player-video-top-follow, .bilibili-player.mode-webfullscreen .bilibili-player-area .bilibili-player-video-wrap .bilibili-player-video-top-follow").css("height") == "32px") {
            videotime_div.css("height","32px");
            videotime_div.css("line_height","32px");
        }else{
            videotime_div.css("height","24px");
            videotime_div.css("line_height","24px");
        }
    }

})();