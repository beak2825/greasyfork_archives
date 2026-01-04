// ==UserScript==
// @name         哔哩哔哩好听机器人
// @description  直播间自动好听好听
// @version      1.0
// @author       Asroe
// @match        https://live.bilibili.com/*
// @run-at       document-start
// @license      GNU General Public License v3.0 or later
// @namespace    https://greasyfork.org/zh-CN/users/685098-asroe
// @downloadURL https://update.greasyfork.org/scripts/425881/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A5%BD%E5%90%AC%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/425881/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%A5%BD%E5%90%AC%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==
let evt = document.createEvent('HTMLEvents')
evt.initEvent('input', true, true)
setInterval(function (){
  document.getElementsByClassName('chat-input border-box')[0].value = '好听好听';
  document.getElementsByClassName('chat-input border-box')[0].dispatchEvent(evt);
  document.getElementsByClassName('bl-button live-skin-highlight-button-bg live-skin-button-text bl-button--primary bl-button--small')[0].click();
}, 25000);