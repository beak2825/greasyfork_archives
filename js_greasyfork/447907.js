// ==UserScript==
// @name         蜡笔小新第一季跳过片头
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屁事真多
// @author       
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447907/%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0%E7%AC%AC%E4%B8%80%E5%AD%A3%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/447907/%E8%9C%A1%E7%AC%94%E5%B0%8F%E6%96%B0%E7%AC%AC%E4%B8%80%E5%AD%A3%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(()=>{
        if(window.ep.share_copy.indexOf("蜡笔小新 第一季（中文）")> -1){
            let video= document.querySelector("video")
            console.log(video.duration)
            if(video.duration > 480){
                video.currentTime = 65
            }
        }
    },1000)

    // Your code here...
})();