// ==UserScript==
// @name         【通用自动版】哔哩哔哩(bilibili.com)番剧跳过片头片尾
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  【所有视频可用,打开不影响正常使用】进度条滑到片头结束和片尾开始时刻分别按Enter标记,掐头去尾;按Alt切自动模式,无需标记直接跳过前90,后40秒,再按一次回到手动标记模式并清空上一次标记片头片尾时间
// @author       redbubble
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/469812/%E3%80%90%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E7%89%88%E3%80%91%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28bilibilicom%29%E7%95%AA%E5%89%A7%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/469812/%E3%80%90%E9%80%9A%E7%94%A8%E8%87%AA%E5%8A%A8%E7%89%88%E3%80%91%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%28bilibilicom%29%E7%95%AA%E5%89%A7%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%E7%89%87%E5%B0%BE.meta.js
// ==/UserScript==
// 键码
//********************************************************修改时间划到最下面********************************************************
//********************************************************修改时间划到最下面********************************************************
//********************************************************修改时间划到最下面********************************************************
var keyCodeEnter = 13;
var keyCodeAlt = 18;
var allowed = true;//防抖标志位
var OPTime = 0; //默认片头长度
var EDTime = 0; //默认片尾长度
var video = document.querySelector("#bilibili-player video");
var automation = 0; //自动手动模式标志位,默认0为手动

//主函数setInterval方法
(function() {
    setInterval(monitor,2000);//每2秒监听一次
})();

//监听
function monitor() {
    //更新当前视频属性
    video = document.querySelector("#bilibili-player video");
    opjump();
    edjump();

}

//片头跳跃
function opjump() {
    if(OPTime - video.currentTime >= 0){
        video.currentTime = OPTime;
        video.play();
    }
}

//片尾跳跃
function edjump() {
    if(video.duration - video.currentTime - EDTime <= 0){
        video.currentTime += EDTime;
        video.play();
    }
}

//按键响应
window.document.onkeydown=function(event) {
    if (event.repeat != undefined) {
        allowed = !event.repeat;
    }
    if (!allowed){
        return;
    }
    allowed = false;//防抖
    if(event.keyCode == keyCodeEnter){
        var half_duration = video.duration / 2;
        if(video.currentTime<=half_duration){
             OPTime = video.currentTime;
            alert("片头设置为前" + OPTime + "秒");
        }else{
            EDTime = video.duration - video.currentTime;
            alert("片尾设置为后" + EDTime + "秒");
        }
    }
    if(event.keyCode == keyCodeAlt){
        if(automation == 0){
            OPTime = 90;//********************************************************在这里设置自动模式的片头时间********************************************************
            EDTime = 40;//********************************************************在这里设置自动模式的片尾时间********************************************************
            alert("自动模式,跳过前90后40秒,再按一次退出");
            automation = 1;
            return;
        }
        if(automation == 1){
            OPTime = 0;
            EDTime = 0;
            alert("重置片头片尾时间,按Enter重新标记片头片尾,再按一次返回自动模式");
            automation = 0;
            return;
        }
    }
}
