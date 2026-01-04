// ==UserScript==
// @name         2024年度河北省技工院校教师线上研修班
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  2024年度河北省技工院校教师线上研修班视频课件自动播放
// @author       Suny
// @match        https://szyxy-kfkc.webtrn.cn/learnspace/learn/learn/templatetwo/courseware_index.action*
// @match        https://szyxy-kfkc.webtrn.cn/learnspace/learn/learn/templatetwo/index.action*
// @icon         <$ICON$>
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503905/2024%E5%B9%B4%E5%BA%A6%E6%B2%B3%E5%8C%97%E7%9C%81%E6%8A%80%E5%B7%A5%E9%99%A2%E6%A0%A1%E6%95%99%E5%B8%88%E7%BA%BF%E4%B8%8A%E7%A0%94%E4%BF%AE%E7%8F%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/503905/2024%E5%B9%B4%E5%BA%A6%E6%B2%B3%E5%8C%97%E7%9C%81%E6%8A%80%E5%B7%A5%E9%99%A2%E6%A0%A1%E6%95%99%E5%B8%88%E7%BA%BF%E4%B8%8A%E7%A0%94%E4%BF%AE%E7%8F%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.pathname
    if (url == "/learnspace/learn/learn/templatetwo/index.action"){
        console.log("SDG:mian page")
        // 关闭30分钟提示框
        let iiii=setInterval(function() {
            // console.log("ttttt")
            let btn=document.querySelector('div.layui-layer-btn.layui-layer-btn- > a')
            if (btn) {
                btn.click()
            }
        },6000)
    }else if(url == "/learnspace/learn/learn/templatetwo/courseware_index.action"){
        console.log("SDG:mainCont")
        let courseFrame = document.querySelector("#mainFrame")
        let ii = setInterval(function(){
            let video = courseFrame.contentDocument.querySelector('video')
            if (video && video.duration){
                console.log("duration:",video.duration)
                console.log("currentTime:",video.currentTime)
                if(video.currentTime==video.duration){
                    let notlist = document.querySelectorAll('div[itemtype="video"][completestate="0"]')
                    if (notlist.length>1){
                        notlist[1].click()
                    }else{
                        clearInterval(ii)
                    }
                }else{
                    video.play()
                }
            }
        },10000)
    }
})();