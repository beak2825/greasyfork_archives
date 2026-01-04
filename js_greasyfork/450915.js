// ==UserScript==
// @name         B站视频单曲循环
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站内置视频单曲循环播放，按钮在右侧视频栏，视频选集和自动播放处
// @author       Candy.
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450915/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%8D%95%E6%9B%B2%E5%BE%AA%E7%8E%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/450915/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%8D%95%E6%9B%B2%E5%BE%AA%E7%8E%AF.meta.js
// ==/UserScript==

window.isDOMLoaded = false;
window.isDOMRendered = false;

document.addEventListener('readystatechange', function () {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    window.isDOMLoaded = true;
  }
});

(function () {
  'use strict';
  // Your code here...
  // let next = document.getElementsByClassName("head-right")[0]
  let target = document.getElementsByClassName("next-button")[0]
  let copy = target.cloneNode(true)
  copy.setAttribute("style", "margin-right: 10px")
  let [text, switchButton] = copy.children
  text.innerHTML = '循环播放'
  let parent = target.parentElement

  // 控制媒体元素
  let video = document.getElementsByTagName("video")[0]
  copy.addEventListener('click', () => {
    switchButton.className = switchButton.className === 'switch-button on' ? 'switch-button' : 'switch-button on'
    video.loop = switchButton.className === 'switch-button on'
    console.log(video.loop)
  })

  setTimeout(() => {
    video.loop = false
    switchButton.className = 'switch-button'
    parent.insertBefore(copy, target)
    console.log("done")
  }, 8000)



})();