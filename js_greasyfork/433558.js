// ==UserScript==
// @name         开课吧在线自动刷课助手
// @namespace    undefined
// @version      1.0.0
// @description  开课吧刷课助手：自动结束跳转下一视频，自动静音。
// @match  https://*.kaikeba.com/*
// @author       "scp.Adams"
// @license 	Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/433558/%E5%BC%80%E8%AF%BE%E5%90%A7%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433558/%E5%BC%80%E8%AF%BE%E5%90%A7%E5%9C%A8%E7%BA%BF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

start();
var runIt;
//开始视频播放
function start(){
    console.log("---- start play----");
    var startup = document.getElementsByClassName("vjs-big-play-button");
    if(startup != undefined){
        console.log("Robot-开始工作");
        window.clearInterval(runIt);
        runIt= setInterval(nextEx,10000);
    }
}

//跳转下一节视频
function nextEx(){
    //console.log("Robot-开始检测");
    var startup = document.getElementsByClassName("vjs-big-play-button");
    var video = document.getElementsByClassName("playback-next-btn");
    if(undefined != startup && startup.length != 0){
        var playing = document.getElementsByClassName("vjs-playing");
        if(undefined != playing && playing.length != 0){
            console.log("Robot-视频正在播放...");
            soundClose();
        }else{
            console.log("Robot-开始播放");
            console.log("startup.length:"+startup.length);
            var titleTxt = startup[0].getAttribute("title");
            console.log("Robot-titleTxt:"+titleTxt);
            startup[0].click();
        }
    }
    if(undefined != video && video.length != 0){
        var staNow = video[0];
        if(staNow.innerText == "学习下个任务"){
            console.log("Robot-下一个视频播放");
            staNow.click();
        }
    }
}

//停止视频播放
function stop(){
    start();
    clearInterval(runIt);
    console.log("Robot-暂停视频");
    if(sta.innerText == "暂停"){
        console.log("Robot-暂停视频");
        document.getElementsByClassName("play-btn-tip")[0].click();
    }
}


//关闭视频声音
function soundClose(){
    var sound = document.getElementsByClassName("vjs-vol-3");
    if(undefined != sound && sound.length != 0){
        document.getElementsByClassName("vjs-vol-3")[0].click();
        console.log("Robot-已关闭视频声音");
    }
}
