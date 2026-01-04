// ==UserScript==
// @name        New script 
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2020/7/28 上午9:05:18
// @downloadURL https://update.greasyfork.org/scripts/407839/New%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/407839/New%20script.meta.js
// ==/UserScript==
//by青橙
setInterval(function(){document.getElementById("room-im-chat").click();},1000);//打开私信
setInterval(function(){document.getElementsByClassName("send-btn")[0].click();},3000);//点击发送