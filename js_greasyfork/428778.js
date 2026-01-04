// ==UserScript==
// @name        B站匿名聊天室 
// @namespace   来自：http://topurl.cn/
// @match       *://*.bilibili.*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2021/7/2上午8:56:35
// @downloadURL https://update.greasyfork.org/scripts/428778/B%E7%AB%99%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9%E5%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/428778/B%E7%AB%99%E5%8C%BF%E5%90%8D%E8%81%8A%E5%A4%A9%E5%AE%A4.meta.js
// ==/UserScript==
var s=document.createElement('script');
s.src='//topurl.cn/chat.js';
document.body.append(s);


window.onload = function(){
  var btn=document.querySelector("div.ctrm-title-close");
  btn.click();
  
  document.head.insertAdjacentHTML('beforeend','<style>div.ctrm-domain{display:none !important;}</style>');
  document.head.insertAdjacentHTML('beforeend','<style>span.ctrm-title-url{display:none !important;}</style>');
}
