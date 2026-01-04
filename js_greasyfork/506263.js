// ==UserScript==
// @name         2024年中小学智慧教育平台(广东频道)脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  8.24可用
// @author       Happy
// @match        https://basic.smartedu.cn/smartedu/resource/*
// @icon         https://pic.ntimg.cn/file/20200129/2860708_190811479085_2.jpg
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506263/2024%E5%B9%B4%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%28%E5%B9%BF%E4%B8%9C%E9%A2%91%E9%81%93%29%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/506263/2024%E5%B9%B4%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%28%E5%B9%BF%E4%B8%9C%E9%A2%91%E9%81%93%29%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==



function skip() {
    let video = document.getElementsByTagName('video')
    video[0].currentTime = video[0].duration
    document.querySelectorAll(".content.flex-row")[i].click()

    if(i!=41){
        video[0].currentTime = video[0].duration
        if(document.querySelectorAll(".icon-finish.inline-block")[i].style[0]!='display'){i++;}
        else if(document.querySelectorAll(".icon-finish.inline-block")[i].style[0]=='display'){video[0].currentTime = video[0].duration}
    }
    if(i==41){clearInterval(playset)}
}
var i=0
var playset=setInterval(skip,700);