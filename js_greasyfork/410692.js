// ==UserScript==
// @name         bili-night by YG
// @namespace    https://greasyfork.org/zh-CN/scripts/410692
// @version      0.1.2
// @description  B站 自动夜色模式
// @author       YG
// @match        *://*.bilibili.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/410692/bili-night%20by%20YG.user.js
// @updateURL https://update.greasyfork.org/scripts/410692/bili-night%20by%20YG.meta.js
// ==/UserScript==
window.onload=night;

function night() {
    var d = new Date();
    var bacg0 = document.querySelector("#app > div");
    var header = document.querySelector("#internationalHeader");
    var room_bg = document.querySelector("#room-background-vm > div > div");
    var side_area = document.querySelector("#aside-area-vm > div.chat-history-panel");
    //var bb_comment = document.getElementsByclassName("bb-comment");
    if(d.getHours()>=18&&d.getHours()<=6){
        if(bacg0 !=undefined){
        bacg0.style.background = "#6a6e74";}
        if(header !=undefined){
            header.style.background = "#6a6e74";}
        if(room_bg !=undefined){
            room_bg.style.background = "#6a6e74";
            room_bg.style.backgroundImage = "none";
            side_area.style.backgroundImage = "none";}
    }

}

