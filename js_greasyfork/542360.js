// ==UserScript==
// @name        bilibili视频速刷插件
// @namespace   Violentmonkey Scripts
// @match         *://www.bilibili.com/*
// @grant       none
// @version     1.0
// @author      ollie
// @description 2025/1/17 19:25:26
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542360/bilibili%E8%A7%86%E9%A2%91%E9%80%9F%E5%88%B7%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542360/bilibili%E8%A7%86%E9%A2%91%E9%80%9F%E5%88%B7%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
"use strict";

const video = document.querySelector('video');
// 视频默认暂停而不是播放
let trigger = false;
video.addEventListener('play', function() {
    if (!trigger && !video.paused) {
        video.pause();
        trigger = true;
    }
});
const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(mutation => {
        if (mutation.attributeName === 'src') {
            trigger = false;
        }
    });
});
observer.observe(video, {attributes: true});
// 防止原有快捷键冲突
document.addEventListener('keyup', function(event) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.stopImmediatePropagation();
    }
});
// 上下键调整跳转幅度, 左右键跳转
let jumpTime = 3;
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        event.stopImmediatePropagation();
        video.currentTime = Math.max(0, video.currentTime - jumpTime);
    }
    else if (event.key === 'ArrowRight') {
        event.stopImmediatePropagation();
        video.currentTime = Math.min(video.duration, video.currentTime + jumpTime);
    }
    else if (event.key === 'ArrowUp') {
        event.stopImmediatePropagation();
        jumpTime = Math.min(50, jumpTime + 1);
        showTip(jumpTime);
    }
    else if (event.key === 'ArrowDown') {
        event.stopImmediatePropagation();
        jumpTime = Math.max(1, jumpTime - 1);
        showTip(jumpTime);
    }
});
// 展示提示信息
const style = `
    #tip {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 32px;
      padding: 8px;
      color: #000;
      font-size: 20px;
      border-radius: 7px;
      background-color: hsla(0, 0%, 100%, .6);
      transform: translate(-50%, -50%);
      z-index: 77;
      visibility: hidden;
    }
  `;
const styleEl = document.createElement('style');
styleEl.textContent = style;
document.head.appendChild(styleEl);
function showTip(tip) {
    let tipDiv = document.querySelector(`#tip`);
    if (!tipDiv) {
        const div = document.createElement('div');
        div.setAttribute('id', 'tip');
        div.innerHTML = '<span></span>';
        document.querySelector('.bpx-player-video-area').appendChild(div);
        tipDiv = div;
    }
    let tipSpan = tipDiv.querySelector('span')
    tipSpan.innerHTML = `${tip}`
    tipDiv.style.visibility = 'visible'
    clearTimeout(window.tipTimer)
    window.tipTimer = setTimeout(() => {
        tipDiv.style.visibility = 'hidden'
    }, 500)
}
