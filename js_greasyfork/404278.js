// ==UserScript==
// @name         深信息雨课堂辅助
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  深信息雨课堂自动刷视频
// @author       monstertsl
// @match        https://sziit.yuketang.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404278/%E6%B7%B1%E4%BF%A1%E6%81%AF%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/404278/%E6%B7%B1%E4%BF%A1%E6%81%AF%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

//全局设置，0为关闭1为开启
var settings = {
    requestInterval: 500,       // 延迟
    clickLoopInterval: 300,    //点击间隔
    questions_match : 0,       // 匹配功能 默认关闭
    X2speed : 1 ,              //二倍速 默认开启
    setmuted: 1,               //切换静音 默认开启
    qualityChange : 1 ,        //切换标清，默认开启
    Backgroungplay: 1,         //后台播放 默认开启
};


//视频功能
var firstset = 1;
setInterval(function video() {
    var video = document.getElementsByClassName("xt_video_player")[0];
    if(video == undefined){
        document.getElementsByClassName("el-tooltip btn-next item")[0].click();
        console.log("作业，5秒后跳转下一个视频");

    }


    else if(video.length != 0){
        var staNow = document.getElementsByClassName("play-btn-tip")[0];
        if(staNow.innerText == "播放"){
            console.log("播放视频");
            staNow .click();

        }
        var player = $(".xt_video_player_common_list");
        var current_video = document.getElementsByTagName('video')[0]
        var urld = window.location.href;
        if(urld.match("video")&&firstset) {
        let speedChild = player.children()[0]; //二倍速
            if(settings.X2speed) speedChild.click();
        let quality = player.children()[5]; //标清
            if(settings.qualityChange) quality.click();
            if(settings.setmuted) current_video.muted=true; //静音
        firstset=0;
        }
        if(urld.match("video")) {
            if(settings.Backgroungplay){
                current_video.play();
                console.log("后台播放中");
                }
            }
            var c= video.currentTime;
            var d = video.duration;
            var pr =(c/d*100);
            pr = pr.toFixed(2);
            document.title =( pr+"%");
            //视频播放进度超过95%跳转下一节视频
            if(pr>95){
                document.getElementsByClassName("el-tooltip btn-next item")[0].click();
                console.log("跳转到下一节");
                location.reload();
            }
    }else {
            console.log("未知错误！");
        }
},2000)


