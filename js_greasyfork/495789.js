// ==UserScript==
// @name        禁止失去焦点逻辑
// @namespace
// @match       *://*/*
// @grant       none
// @version     1.3
// @author      lqs1848
// @license MIT
// @supportURL  https://blog.lqs1848.top/
// @description
// @run-at      document-start
// @namespace Violentmonkey Scripts
// @description 防止网页切换到后台时自动停止播放视频 或者弹出广告 之类的小动作
// @downloadURL https://update.greasyfork.org/scripts/495789/%E7%A6%81%E6%AD%A2%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%E9%80%BB%E8%BE%91.user.js
// @updateURL https://update.greasyfork.org/scripts/495789/%E7%A6%81%E6%AD%A2%E5%A4%B1%E5%8E%BB%E7%84%A6%E7%82%B9%E9%80%BB%E8%BE%91.meta.js
// ==/UserScript==

'use strict';

var oldAddEvent = document.addEventListener
document.addEventListener = function(eventName,eventCall){
if(eventName && 'blur' != eventName && 'visibilitychange' != eventName) {
  oldAddEvent(eventName,eventCall)
}
}
var oldWinAdd = window.addEventListener
window.addEventListener = window.addEventListener = function(eventName,eventCall){
if(eventName && 'blur' != eventName && 'visibilitychange' != eventName) {
  oldWinAdd(eventName,eventCall)
}
}
