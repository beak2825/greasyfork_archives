// ==UserScript==
// @name         bilibili杀马特弹幕
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  建议在看和杀马特有关的视频的时候开启，要不然别怪我没提醒
// @require       http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @author       奎
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429721/bilibili%E6%9D%80%E9%A9%AC%E7%89%B9%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429721/bilibili%E6%9D%80%E9%A9%AC%E7%89%B9%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

let DanL = document.querySelector('.bilibili-player-video-danmaku');
setInterval(() => {
    let Dan = DanL.querySelectorAll('.b-danmaku'),
    R_ = Math.floor(Math.random()*256),
    G_ = Math.floor(Math.random()*256),
    B_ = Math.floor(Math.random()*256);
    for (let i = 0; i < Dan.length; i++) {
        Dan[i].style.transition = 0.2 + 's'
        Dan[i].style.color = 'rgb('+R_+','+G_+','+B_+')';
    }
},300)