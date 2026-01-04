// ==UserScript==
// @name          B站 Vision OS 播放界面 自动全屏 自动二倍速 添加网页全屏大按钮 眼动追踪优化
// @namespace     https://space.bilibili.com/50001745
// @version       0.0.9
// @description  在 Vision OS 用B站时，眼动追踪很难有，本项目尝试做一下优化:自动网页全屏、自动二倍速和超大播放按键
// @author       fwz233
// @match        *://*.bilibili.com/*
// @grant        GM_addElement
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494563/B%E7%AB%99%20Vision%20OS%20%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%20%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%20%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E9%80%9F%20%E6%B7%BB%E5%8A%A0%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%A4%A7%E6%8C%89%E9%92%AE%20%E7%9C%BC%E5%8A%A8%E8%BF%BD%E8%B8%AA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494563/B%E7%AB%99%20Vision%20OS%20%E6%92%AD%E6%94%BE%E7%95%8C%E9%9D%A2%20%E8%87%AA%E5%8A%A8%E5%85%A8%E5%B1%8F%20%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E9%80%9F%20%E6%B7%BB%E5%8A%A0%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E5%A4%A7%E6%8C%89%E9%92%AE%20%E7%9C%BC%E5%8A%A8%E8%BF%BD%E8%B8%AA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
var sb=0
let count = 0;
const maxAttempts = 100;
const intervalId = setInterval(() => {
const element = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-playbackrate > ul > li:nth-child(1)");
const element2 = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-web");
if (element && element2) {
clearInterval(intervalId);
element.click();
element2.click();

  if(sb===0){
    const installArea = document.querySelector("div.video-toolbar-left-main")
    const btn = GM_addElement(installArea, 'button', {
        textContent: '网页全屏'
    });
    btn.style.width = '123px';
    btn.style.height = '72px';
    btn.style.backgroundColor = "#11659a";
    btn.style.borderRadius = '49px';
    btn.style.fontSize = '24px';
    btn.style.color = "white";
    btn.onclick = function copyCode() {
       const big = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-right > div.bpx-player-ctrl-btn.bpx-player-ctrl-web");
       big.click();

    }
    }
    sb++;


}
count++;
if (count >= maxAttempts) {
clearInterval(intervalId);
console.log("没有找到元素");
}




}, 100);


var play_buuton = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-state-wrap ")
// 使用style属性设置div的宽度和高度
play_buuton.style.width = '300px';
play_buuton.style.height = '300px';
play_buuton.style.backgroundColor = "#11659a";
play_buuton.textContent = '播放';
play_buuton.style.fontSize = '99px';
play_buuton.style.color = "white";
play_buuton.style.borderRadius = '49px';
play_buuton.style.textAlign='center';
play_buuton.style.lineHeight='300px';
//可点击
play_buuton.style.zIndex = '1000';
play_buuton.style.pointerEvents = 'auto';
// 添加点击事件监听器

play_buuton.addEventListener('click', function() {
    const play = document.querySelector("#bilibili-player > div > div > div.bpx-player-primary-area > div.bpx-player-video-area > div.bpx-player-control-wrap > div.bpx-player-control-entity > div.bpx-player-control-bottom > div.bpx-player-control-bottom-left > div.bpx-player-ctrl-btn.bpx-player-ctrl-play");
    play.click();
    //alert('被覆盖的Div被点击了！');

});


    // Your code here...
})();