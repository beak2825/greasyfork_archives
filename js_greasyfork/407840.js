// ==UserScript==
// @name        酷狗直播私信by青橙
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      -
// @description 2020/7/28 上午9:05:18
// @downloadURL https://update.greasyfork.org/scripts/407840/%E9%85%B7%E7%8B%97%E7%9B%B4%E6%92%AD%E7%A7%81%E4%BF%A1by%E9%9D%92%E6%A9%99.user.js
// @updateURL https://update.greasyfork.org/scripts/407840/%E9%85%B7%E7%8B%97%E7%9B%B4%E6%92%AD%E7%A7%81%E4%BF%A1by%E9%9D%92%E6%A9%99.meta.js
// ==/UserScript==
//by青橙
setInterval(function(){document.getElementById("room-im-chat").click();},1000);//打开私信
setInterval(function(){document.getElementsByClassName("send-btn")[0].click();},3000);//点击发送