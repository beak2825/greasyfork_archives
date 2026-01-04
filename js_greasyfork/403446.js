// ==UserScript==
// @name         sziit video autorun
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  深信形势与政策刷课
// @author       Xspak
// @match        https://sziit.yuketang.cn/pro/lms*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403446/sziit%20video%20autorun.user.js
// @updateURL https://update.greasyfork.org/scripts/403446/sziit%20video%20autorun.meta.js
// ==/UserScript==

 var settings = {
        requestInterval: 500, // 延迟
        clickLoopInterval: 300, //点击间隔
        questions_match : 0, // 匹配功能 默认关闭
};

start();
var runIt;
//开始视频播放
function start(){
    sta = document.getElementsByClassName("play-btn-tip")[0];
    console.log(sta);

    console.log("播放----");
    window.clearInterval(runIt);

    runIt= setInterval(next,5000);
    if(sta.innerText == "播放"){
        console.log("开始播放视频");
        document.getElementsByClassName("play-btn-tip")[0].click();
    }
}

//停止视频播放
function stop(){
	start();
    clearInterval(runIt);
    console.log("暂停----");
    if(sta.innerText == "暂停"){
        console.log("暂停视频");
        document.getElementsByClassName("play-btn-tip")[0].click();
    }
}

//跳转下一节视频
function next(){
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
        var c= video.currentTime;
        var d = video.duration;
        //不想关闭声音可以把此行代码删掉
        soundClose();
        speed();
        //视频播放进度超过95%跳转下一节视频
        if((c/d)>0.95){
            document.getElementsByClassName("el-tooltip btn-next item")[0].click();
            console.log("跳转到下一节");
            console.log("本节观看百分比"+c/d);
        }
    }else {
        console.log("未知错误！");
    }
}
//关闭视频声音
function soundClose(){
    var sound = document.getElementsByClassName("xt_video_player_common_icon_muted");
    if(sound.length == 0){
        document.getElementsByClassName("xt_video_player_common_icon")[0].click();
        console.log("视频声音关闭");
    }
}
//播放速度2.0
function speed(){
    var speed = document.getElementsByClassName("xt_video_player_common_list")[0];
    var speedChild = speed.firstChild;
    speedChild.click();
    console.log("倍速点击了2.0");
}