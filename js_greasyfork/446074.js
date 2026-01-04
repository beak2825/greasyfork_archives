// ==UserScript==
// @name         锋云智慧教辅平台自动播放视频脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动播放视频脚本， 新手 写的不好多包涵
// @author       You
// @match        http://computer.nit.1000phone.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1000phone.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446074/%E9%94%8B%E4%BA%91%E6%99%BA%E6%85%A7%E6%95%99%E8%BE%85%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446074/%E9%94%8B%E4%BA%91%E6%99%BA%E6%85%A7%E6%95%99%E8%BE%85%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    //视屏看完的图片资源
    const pass_base64 = "data:image/png;base64,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"

    let site = {
        //播放列表
        playList: '.v-ul > li',
        //播放完成图片
        passImg: 'h2 > .video > span > .jd',
        //播放到第几个视频
        count: 0,
        //开始播放按钮
        playButton: "vjs-big-play-button",
        video:{
            className: "vjs-tech",
            //视屏当前时间
            currentTime: "vjs-current-time-display",
            //视频总时长
            duration: "vjs-duration-display"
        },
    }


    window.onload = function(){ 
        let url = window.location.href;
        if(url.includes("http://computer.nit.1000phone.net/studentMyClassroom/courseVideo/playCourse")){
            console.log("自动播放脚本准备运行");
            document.querySelectorAll(".plTab span")[1].click();
            console.log("切换到目录,通过目录判断是否播放完成");
            console.log("2秒后开始播放,请自己点击开始");
            setTimeout(()=>{auto_play()},2000);
        }
    }


  //  document.addEventListener("click", function (e) {
    //     console.log("x: ",e.clientX, " y: ", e.clientY)
   // console.log("x1: ",e.offsetX, " y1: ", e.offsetY)
//})


    function auto_play(){
        //播放列表
        const play_list = document.querySelectorAll(site.playList);
        //用来判断视频是否看完标志
        const base64 = document.querySelectorAll(site.passImg);

        const timer = setInterval(()=>{
            //播放按钮
            let playButton = document.getElementsByClassName(site.playButton)[0];
            //获取播放器
            let video = document.getElementsByClassName(site.video.className)[0];
            //视频当前播放时间
            let currentTime = video.currentTime;
            //视频持续时间
            let duration = video.duration;

            console.log("运行中",currentTime, duration);
            console.log("播放第几个视频", site.count + 1);
            if(site.count >= play_list.length - 1){
                clearInterval(timer);
                alert("当前页面所有视频播放完成");
            }
            //如果看完了直接下一个
            else if(pass_or_not(base64[site.count].src)){
                while(pass_or_not(base64[site.count].src)){
                    ++site.count;
                }
                play_list[site.count].click();
                setTimeout(()=>{videoPlay()},2000);
            }
            //视屏播放完全后后下一个
            else if(currentTime == duration){
                ++site.count;
                play_list[site.count].click();
                setTimeout(()=>{videoPlay()},2000);
            }else if(site.count == 0){
                setTimeout(()=>{videoPlay()},2000);
            }

        },1000);
    }


    //视频是否看完
    function pass_or_not(base64){
        return base64 == pass_base64;
    }

    //视频禁音并播放
    function videoPlay(){
        let video = document.getElementsByClassName(site.video.className)[0];
        video.muted = 'muted';
        video.play();
    }
})();