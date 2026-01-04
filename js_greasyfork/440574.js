// ==UserScript==
// @name         bilibili充电鸣谢跳过
// @description  自动跳过视频最后的充电鸣谢页面
// @author       HRL
// @match        https://www.bilibili.com/video/*
// @license      MIT License
// @run-at       document-idle
// @version 0.0.1.20220225061804
// @namespace https://greasyfork.org/users/880327
// @downloadURL https://update.greasyfork.org/scripts/440574/bilibili%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/440574/bilibili%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==

(function() {
    setTimeout(()=>{
        player.addEventListener("video_heartbeat", mainfunc);
        console.log("addevent");},2000);
})();

function mainfunc(){
    setTimeout(()=>{
        if (document.getElementsByClassName('bilibili-player-electric-panel-jump')[0]) {
            document.getElementsByClassName('bilibili-player-electric-panel-jump-content')[0].click();
        }
    },200);
}