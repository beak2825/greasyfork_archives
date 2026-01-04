// ==UserScript==
// @name        平安知鸟 知鸟刷课脚本
// @namespace   Violentmonkey Scripts
// @match       https://www.zhi-niao.com/*
// @grant       none
// @version     0.1.0
// @author      aries.zhou
// @description 2/9/2022, 9:59:01 AM
// @downloadURL https://update.greasyfork.org/scripts/439740/%E5%B9%B3%E5%AE%89%E7%9F%A5%E9%B8%9F%20%E7%9F%A5%E9%B8%9F%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/439740/%E5%B9%B3%E5%AE%89%E7%9F%A5%E9%B8%9F%20%E7%9F%A5%E9%B8%9F%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==





setInterval(() => {
  let paused_btns = document.getElementsByClassName('vjs-paused');
  if(paused_btns.length > 0){
    paused_btns[0].click();
  }
  let play_btns = document.getElementsByClassName('vjs-big-play-button');
  if(play_btns.length > 0){
    play_btns[0].click();
  }
}, 5000)
