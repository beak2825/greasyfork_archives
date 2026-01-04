// ==UserScript==
// @name         b站滚轮调节音量、倍速优化
// @namespace    http://greakfork.org/
// @version      1.3.4
// @description  可在未全屏时，于视频底部使用滚轮调节音量以及倍速，每次调节音量幅度为5，可在代码中修改volumeChange变量来自定义调节幅度
// @author       xiao_luo
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/watchlater*
// @match        https://www.bilibili.com/bangumi/*
// @icon         https://i0.hdslb.com/bfs/static/jinkela/long/images/favicon.ico
// @grant        none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/530618/b%E7%AB%99%E6%BB%9A%E8%BD%AE%E8%B0%83%E8%8A%82%E9%9F%B3%E9%87%8F%E3%80%81%E5%80%8D%E9%80%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/530618/b%E7%AB%99%E6%BB%9A%E8%BD%AE%E8%B0%83%E8%8A%82%E9%9F%B3%E9%87%8F%E3%80%81%E5%80%8D%E9%80%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let volumeChange = 0.05
    function initThis(){
        let volume_btn = document.querySelector("div[aria-label='音量']")
        let video = document.querySelector('video')
        console.log("初始化完成")
        volume_btn.addEventListener("wheel",function(event){
            event.preventDefault()
            volume_btn.setAttribute("class", "bpx-player-ctrl-btn bpx-player-ctrl-volume bpx-state-show")
            if(event.wheelDelta > 0){
                video.volume = (video.volume+volumeChange)>1?1:(video.volume+volumeChange)
            }else if(event.wheelDelta < 0){
                video.volume = (video.volume-volumeChange)<0?0:(video.volume-volumeChange)
            }
        })


        let tempSpeed=0
        let originSpeed = 0
        let originSpeedText = document.querySelector('.bpx-player-ctrl-playbackrate-result').innerHTML
        let speed_btn = document.querySelector("div[aria-label='倍速']")
        console.log(originSpeedText)

        //对一倍速做特殊处理
        if('倍速' === originSpeedText){
            originSpeed = 1
        }else{
            originSpeed = parseFloat(originSpeedText)
        }

        let speed_choice = Array.from(document.querySelector('.bpx-player-ctrl-playbackrate-menu').children)
        speed_choice = speed_choice.sort(function (a, b) {
            const orderA = parseFloat(a.getAttribute('data-value'))
            const orderB = parseFloat(b.getAttribute('data-value'))
            return orderA - orderB;
        })

        for(let i=0; i<speed_choice.length; i++){
            if(parseFloat(speed_choice[i].getAttribute("data-value")) === originSpeed){
                tempSpeed = i
            }
        }

        speed_btn.addEventListener("wheel",event=>{
            event.preventDefault()

            speed_btn.setAttribute("class", "bpx-player-ctrl-btn bpx-player-ctrl-playbackrate bpx-state-show")
            let zeroIndex = document.querySelector('.be-settings') ? 1 : 0
            if(event.wheelDelta > 0){
                tempSpeed = speed_choice.length-1>tempSpeed+1 ? tempSpeed+1 : speed_choice.length-1
            }else if(event.wheelDelta < 0){
                tempSpeed = zeroIndex<tempSpeed-1 ? tempSpeed-1 : zeroIndex
            }
            speed_choice[tempSpeed].click()
        })


    }

    function waitElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            setTimeout(() => {
                callback()
            }, 1000);
        } else {
            setTimeout(() => {
                waitElement(selector, callback);
            }, 100);
        }
    }

    waitElement("li[data-value='1']",initThis)


})();