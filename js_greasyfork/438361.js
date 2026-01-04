// ==UserScript==
// @name        航天云课堂刷课
// @namespace   Violentmonkey Scripts
// @match       https://train.casicloud.com/*
// @grant       none
// @version     0.1.3
// @author      aries.zhou
// @description 1/11/2022, 6:27:03 PM
// @downloadURL https://update.greasyfork.org/scripts/438361/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/438361/%E8%88%AA%E5%A4%A9%E4%BA%91%E8%AF%BE%E5%A0%82%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==


setInterval(() => {
  let btns = document.getElementsByClassName('btn-ok');
  if(btns.length > 0){
    document.getElementsByClassName('btn-ok')[0].click();
  }
  
  
  console.log(11111)
  let btns2 = document.getElementsByClassName('btn');
  console.log(btns2)
  if(btns2.length > 0){
    document.getElementsByClassName('btn')[0].click();
  }
  
  
  let referse_btns = document.getElementsByClassName('videojs-referse-btn');
  if(referse_btns.length > 0){
    document.getElementsByClassName('videojs-referse-btn')[0].click();
  }
}, 60000)
