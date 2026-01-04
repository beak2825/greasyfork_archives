// ==UserScript==
// @name         Acfun自动点赞
// @description  直播间自动点赞
// @version      0.0.0.1
// @author       A
// @match        https://live.acfun.cn/live/*
// @run-at       document-start
// @license      GNU General Public License v3.0 or later
// @namespace    https://greasyfork.org/zh-CN/users/685098-sroe-a
// @downloadURL https://update.greasyfork.org/scripts/410816/Acfun%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/410816/Acfun%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
setInterval(function (){
  document.getElementsByClassName('like-btn')[0].click()
},1000);