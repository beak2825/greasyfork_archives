// ==UserScript==
// @name         学堂在线刷课机（哈工大深圳特供）
// @namespace    undefined
// @version      0.22
// @description  自动静音刷视频、能跳过非视频链接
// @author       Leon
// @match        https://course.hitsz.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415144/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E6%9C%BA%EF%BC%88%E5%93%88%E5%B7%A5%E5%A4%A7%E6%B7%B1%E5%9C%B3%E7%89%B9%E4%BE%9B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/415144/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%88%B7%E8%AF%BE%E6%9C%BA%EF%BC%88%E5%93%88%E5%B7%A5%E5%A4%A7%E6%B7%B1%E5%9C%B3%E7%89%B9%E4%BE%9B%EF%BC%89.meta.js
// ==/UserScript==


//(静音有时候比较慢、二倍速无法自动开启
//{更新日期：2020.10.31}


start();
var runIt;
//开始视频播放
function start(){
    var startup = document.getElementsByClassName("play-btn-tip")[0];
    console.log(startup);
    console.log("Robot-开始工作");
    window.clearInterval(runIt);
    runIt= setInterval(next,3000);
    soundClose();
    if(startup.innerText == "播放"){
        console.log("Robot-开始播放视频");
        document.getElementsByClassName("play-btn-tip")[0].click();
    }
}

//停止视频播放
function stop(){
    start();
    var startup = document.getElementsByClassName("play-btn-tip")[0];
    clearInterval(runIt);
    console.log("Robot-暂停视频");
    if(startup.innerText == "暂停"){
        console.log("Robot-暂停视频");
        document.getElementsByClassName("play-btn-tip")[0].click();
    }
}

//跳转下一节视频
function next(){
    var video = document.getElementsByClassName("xt_video_player")[0];
    var website = window.location.href;
    if(website.indexOf("/video/") == -1){
        return;}
    var web_v = website.split("/video/");
    var web_v2 = parseInt(web_v[1]) + 1 ;//下一节
    var nexturl_v = web_v[0].concat("/video/",web_v2+"");
    if(video == undefined){
        window.location.href = nexturl_v;
        console.log("Robot-检测到目前是习题，3秒后跳转下一个视频");
    }
    else if(video.length != 0){
        var staNow = document.getElementsByClassName("play-btn-tip")[0];
        if(staNow.innerText == "播放"){
            console.log("Robot-开始播放视频");
            staNow .click();
        }
        var Current = video.currentTime;
        var Duration = video.duration;
        soundClose();//不想关闭声音可以把此行代码删掉
        speed();
        //视频播放进度超过95%跳转下一节视频
        if((Current/Duration)>0.95){
            window.location.href = nexturl_v;
            console.log("Robot-跳转到下一节视频");
            console.log("Robot-本节观看百分比"+Current/Duration);
        }
    }else {
        console.log("Robot-似乎出现了未知错误！");
    }
}


//关闭视频声音
function soundClose(){
    var sound = document.getElementsByClassName("xt_video_player_common_icon_muted");
    if(sound.length == 0){
        document.getElementsByClassName("xt_video_player_common_icon")[0].click();
        console.log("Robot-已关闭视频声音");
    }
}
//播放速度2.0
function speed(){
    var speed = document.getElementsByClassName("xt_video_player_common_list")[0];
    var speedChild = speed.firstChild;
    speedChild.click();
    console.log("Robot-开启2.0倍速");
}