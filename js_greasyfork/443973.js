// ==UserScript==
// @name         云班课解锁拖动进度条
// @namespace    http://tampermonkey.net/
// @license      MintLatte
// @version      0.3
// @description  云班课视频资料解锁不可拖动进度条（火狐浏览器暂时不可用）
// @author       You
// @match        https://www.mosoteach.cn/web/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443973/%E4%BA%91%E7%8F%AD%E8%AF%BE%E8%A7%A3%E9%94%81%E6%8B%96%E5%8A%A8%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/443973/%E4%BA%91%E7%8F%AD%E8%AF%BE%E8%A7%A3%E9%94%81%E6%8B%96%E5%8A%A8%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==
var rowvideo = document.getElementsByClassName('res-row-open-enable res-row preview  drag-res-row')
for (let i = 0; i < rowvideo.length; i++) {
    rowvideo[i].onclick = function () {
        video()
    }
}
function video() {
    var videoplay = document.getElementsByTagName('video')
    setTimeout(function () {
        videoplay[0].pause()
    }, 2000)
    console.log('video');
    setTimeout(function () {
        var a = document.querySelector('.video-watch-to')
        a.style.width = '100%'
    }, 2100)
}