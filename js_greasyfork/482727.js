// ==UserScript==
// @name         禁用抖音首页自动播放
// @namespace    http://tampermonkey.net/
// @version      2023-12-20
// @description  禁用抖音首页第一个视频自动播放，避免注意力分散
// @author       You
// @match        https://www.douyin.com/
// @icon         https://www.douyin.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482727/%E7%A6%81%E7%94%A8%E6%8A%96%E9%9F%B3%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/482727/%E7%A6%81%E7%94%A8%E6%8A%96%E9%9F%B3%E9%A6%96%E9%A1%B5%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    let video
   const clearTimer = () => clearInterval(timer)
   let timer = setInterval(() => document.querySelectorAll('video').forEach(el => {
       if(video){
           video.pause()
       }else
       if(el.autoplay){
           video = el
           el.autoplay = false
           el.pause()
           document.querySelector('.xgplayer-start').addEventListener('click', clearTimer)
           el.addEventListener('click', clearTimer)
       }
   }), 50)
})();