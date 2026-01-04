// ==UserScript==
// @name         京训钉助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动点击播放、下一单元、继续学习
// @author       lovebiubiu
// @match        *://*.bjjnts.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431270/%E4%BA%AC%E8%AE%AD%E9%92%89%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431270/%E4%BA%AC%E8%AE%AD%E9%92%89%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("====监测启动====");
    //三秒钟轮询一次
    setInterval(function () {
        console.log("定时检测")
        var playBtns = document.getElementsByClassName("prism-big-play-btn loading-center")
        if(playBtns!=null&&playBtns.length>0){
            var classList = playBtns[0].classList;
            //console.log("classList",classList)
            if(classList.length<=2||(classList.length>=3&&classList[2]!='playing')){
                console.log("检测到点击播放按钮",playBtns[0])
                playBtns[0].click()
                console.log("点击播放")
            }
        }
        var nextUnits = document.getElementsByClassName("next_button___YGZWZ")
        if(nextUnits!=null&&nextUnits.length>0){
            console.log("检测到下一单元按钮",nextUnits[0])
            nextUnits[0].click()
            console.log("点击下一单元")
        }
        var confirmBtns = document.getElementsByClassName("ant-btn ant-btn-primary")
        if(confirmBtns!=null&&confirmBtns.length>0){
            console.log("检测到继续学习按钮",confirmBtns[0])
            confirmBtns[0].click()
            console.log("点击继续学习")
        }
    },3000)
})();