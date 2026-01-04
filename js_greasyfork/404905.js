// ==UserScript==
// @name         Youtube 自动加载剧场模式
// @namespace    Youtube Automatically load Theater mode
// @version      1.3
// @description  Youtube - 自动加载剧场模式
// @author       Jahn
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404905/Youtube%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/404905/Youtube%20%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E5%89%A7%E5%9C%BA%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function(){
    let btn = document.querySelector('.ytp-size-button');
    // 防止冲突
    setTimeout(()=>{
        btn.click();
    },1000)
})()