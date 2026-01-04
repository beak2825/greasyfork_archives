// ==UserScript==
// @name         富學寶典視頻一直播
// @namespace    iedu.foxconn.com
// @version      2.0.3
// @description  富學寶典一直播（富学宝典一直播）——無倍速調整（防止被封號）。使用方法：等待10秒，自動開始播放，切換網頁暫停後不用管，10秒後自動播放。
// @author       otc
// @include      https://iedu.foxconn.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453566/%E5%AF%8C%E5%AD%B8%E5%AF%B6%E5%85%B8%E8%A6%96%E9%A0%BB%E4%B8%80%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/453566/%E5%AF%8C%E5%AD%B8%E5%AF%B6%E5%85%B8%E8%A6%96%E9%A0%BB%E4%B8%80%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

(function(){
function playNext() {
    let ddList = document.getElementsByTagName("dd");
    let ddListFiltered = [];
    for (let dd of ddList) {
        let overStatusItemHtml = dd.getElementsByClassName("right")[0];
        let overStatus = overStatusItemHtml.innerHTML;
        if (overStatus != "已完成") {
            ddListFiltered.push(dd)
        }
    };
    if (ddListFiltered.length > 0) {
        ddListFiltered[0].onclick()
    } else {
        location.reload()
    }
}
function playCurrent() {
    return document.getElementsByTagName("video")[0].play()
}
function isPaused() {
    return document.getElementsByTagName("video")[0].paused
}
function isEnded() {
    return document.querySelector('dd.active .right').innerHTML == "已完成"
}
function main() {
    setInterval(function() {
        if (isPaused() == true) {
            playCurrent()
        }
        if (isEnded() == true) {
            playNext()
        }
    },
    5000)
}
main();
})();