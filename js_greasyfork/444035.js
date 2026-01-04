// ==UserScript==
// @name         手动跳过片头
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  按对应视频的首字母可以跳过对应时长。
// @author       weiv
// @match        *://dp.1010dy.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1010dy.vip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444035/%E6%89%8B%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/444035/%E6%89%8B%E5%8A%A8%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.meta.js
// ==/UserScript==

// 记录一下如何操作的，本来我想着就是播放视频的页面执行脚本，但是调试的时候发现控制台的 js 上下文切换中只有在//dp.1010dy.cc/ 下的时候，才能获取到video 对象。
// 开始想着可能就是iframe 的原因，所以各种通过 上下文 top 下找video 对象，却始终找不到，还报跨域问题。
// 无意间在 控制台切换上下文的时候发现了油猴脚本，那是不是 直接将 @match 改成 对应的地址 也就是 *://dp.1010dy.cc/* 就能获取到了。
// 结果测试，果然成功了。不过只能在视频框里面才能触发。这正是我想要的。

// 键码
const keyCodeJ = 74;
const keyCodeL = 76; // 灵剑尊
const keyCodeS = 83; // 万界神主
const keyCodeX = 88; // 万界仙踪
const keyCodeY = 89; // 妖神记
const keyCodeW = 87; // 完美世界
const keyCodeD = 68; // 斗罗大陆
const keyCodeP = 80; // 斗破苍穹
const keyCodeF = 70; // 凡人修仙传



const OPTime = 90; //片头长度
const RecTime = 1; //反应时间

//allowed用于防止按键一直按着进度条一直跳的情况
let allowed = true;
window.document.onkeydown=function(event) {
    if (event.repeat != undefined) {
        allowed = !event.repeat;
    }
    if (!allowed){
        return;
    }
    allowed = false;
    通过按键逃过对应的片头(event);
};

function 通过按键逃过对应的片头(event) {
    // 这里获取到 video 播放器的对象。
    const video = document.querySelector("#player > div.yzmplayer-video-wrap > video");
    // console.log(video);

    // 这里获取按钮的对象
    const keyCode = event.keyCode;
    console.log("按下的是：",keyCode);
    if(keyCode == keyCodeJ){
        if(video.currentTime>=1){
            video.currentTime += (OPTime-RecTime);
        }else{
            video.currentTime += OPTime;
            video.play();
        }
    } else if(keyCode == keyCodeL){
        if(video.currentTime>=1){
            video.currentTime += 160;
        }else{
            video.currentTime += 160;
            video.play();
        }
    } else if(keyCode == keyCodeS){
        if(video.currentTime>=1){
            video.currentTime += 125;
        }else{
            video.currentTime += 135;
            video.play();
        }
    } else if(keyCode == keyCodeX || keyCode == keyCodeF){
        if(video.currentTime>=1){
            video.currentTime += 120;
        }else{
            video.currentTime += 120;
            video.play();
        }
    } else if(keyCode == keyCodeY){
        if(video.currentTime>=1){
            video.currentTime += 115;
        }else{
            video.currentTime += 115;
            video.play();
        }
    } else if(keyCode == keyCodeW){
        if(video.currentTime>=1){
            video.currentTime += 125;
        }else{
            video.currentTime += 126;
            video.play();
        }
    } else if(keyCode == keyCodeD){
        if(video.currentTime>=1){
            video.currentTime += 150;
        }else{
            video.currentTime += 150;
            video.play();
        }
    }

}