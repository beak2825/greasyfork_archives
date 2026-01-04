// ==UserScript==
// @name         BiliBili播放器调速增强
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  操作方法：+=加速　—-减速　r还原原速
// @author       Mr.NameNull
// @match        *://*.bilibili.com/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/383220/BiliBili%E6%92%AD%E6%94%BE%E5%99%A8%E8%B0%83%E9%80%9F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/383220/BiliBili%E6%92%AD%E6%94%BE%E5%99%A8%E8%B0%83%E9%80%9F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

var 控制速度up = 187;//+=
var 控制速度down = 189;//—-
var 控制速度r = 82;//r

//直接用浮点运算会出现类似 1.70000 0000 0000 006 这种瓜皮玩意 so给他加了10倍
var video_speed_min = 1;
var video_speed_max = 80;
var video_speed_step = 1;
var video_speed_init = 10
var video_speed = video_speed_init;

function set_video_speed(a){
    video_speed += a;

    if (video_speed > video_speed_max){ video_speed = video_speed_max; }
    else if (video_speed < video_speed_min){ video_speed = video_speed_min; }
    var video = $(".bilibili-player-video video")[0];
    video.playbackRate = video_speed / 10;
}
function set_video_speed_r(){
    video_speed = video_speed_init;
    var video = $(".bilibili-player-video video")[0];
    video.playbackRate = video_speed / 10;
}

function set_video_speed_show(){
    //#bilibiliPlayer .bilibili-player-video-bottom-area .bilibili-player-video-sendbar .bilibili-player-video-info .bilibili-player-video-info-danmaku player-tooltips-trigger .bilibili-player-video-info-danmaku-text
    var tmp = document.querySelector("#bilibiliPlayer");
    tmp = tmp.querySelector(".bilibili-player-video-bottom-area");
    tmp = tmp.querySelector(".bilibili-player-video-sendbar");
    tmp = tmp.querySelector(".bilibili-player-video-info");
    tmp = tmp.querySelector(".bilibili-player-video-info-danmaku");
    tmp = tmp.querySelector(".bilibili-player-video-info-danmaku-text");
    tmp.innerHTML = '条实时弹幕　 x' + video_speed / 10;
}

$(document).ready(function() {
    $(document).keydown(function(event){
        switch(event.keyCode){
            case 控制速度up:
                set_video_speed(video_speed_step);
                break;
            case 控制速度down:
                set_video_speed(-video_speed_step);
                break;
            case 控制速度r:
                set_video_speed_r();
                break;
        }
        set_video_speed_show();
    });
});