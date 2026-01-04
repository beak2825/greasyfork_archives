// ==UserScript==
// @name         浙里学习小助手
// @namespace    www.zjce.gov.cn
// @version      0.9.1
// @description  浙里学习辅助|更快地学习党政知识
// @author       老板
// @run-at       document-start
// @match        https://www.zjce.gov.cn/specialSubject/detail?id=18db4e02f1124e98b13c78fec2a9fe8e*
// @match        https://www.zjce.gov.cn/videos/detail/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @icon         https://www.zjce.gov.cn/favico.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457882/%E6%B5%99%E9%87%8C%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457882/%E6%B5%99%E9%87%8C%E5%AD%A6%E4%B9%A0%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function()
 {
    'use strict';
    setTimeout(() => {showall()}, 1000*5)
})();

function showall(){
    console.log("on showall()")
    var btnShowall = document.querySelector("#__layout > div > div.container.base-color > div.main-view > div:nth-child(5) > div.block-wapper > div.block-footer > div")
    if(btnShowall == null){
        console.log("showall() returns null!")
    }
    else{
        btnShowall.click()
    }
    setTimeout(() => {listvideo()}, 1000*5)
}

function listvideo(){
    console.log("on listvideo()")
    var videos = document.querySelector("#__layout > div > div.container.base-color > div.main-view > div:nth-child(5) > div.block-wapper > div.video-infos")
    if(videos == null){
        console.log("videos() returns null!")
        return
    }
    else{
        var nodes = videos.childNodes.length
        for(var i = 0; i < nodes; i++){
            if(videos.childNodes[i].innerHTML.indexOf("已学习100%") > 0){
                continue
            }
            else{
                videos.childNodes[i].firstChild.firstChild.click()
                setTimeout(() => {viewvideo()}, 1000*5)
                break
            }
        }
    }
}

function viewvideo(){
    setInterval(() => {playvideo()}, 1000*5)
}

function playvideo(){
    var video = document.querySelector("#video-player > div.dplayer-video-wrap > video")
    if(video == null) return
    console.log("视频是否暂停：" + video.paused)
    var progressbar = document.querySelector('#__layout > div > div > div.video-content > div.video-wrapper > div > div.progress-content > div > div > div > span')
    console.log("视频播放进度：" + progressbar.innerText)
    if(video.paused == true){
        if(progressbar.innerText == ''){
            window.open("https://www.zjce.gov.cn/specialSubject/detail?id=18db4e02f1124e98b13c78fec2a9fe8e","_self")
            setTimeout(() => {showall()}, 1000*30)
        }
        else{
            video.click()
        }
    }
}
