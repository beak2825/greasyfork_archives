// ==UserScript==
// @name         Disable Youtube Chat(移除youtube直播聊天)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  移除youtube直播聊天
// @author       千羽千鹤
// @match        https://www.youtube.com/*
// @grant        none
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373505/Disable%20Youtube%20Chat%28%E7%A7%BB%E9%99%A4youtube%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373505/Disable%20Youtube%20Chat%28%E7%A7%BB%E9%99%A4youtube%E7%9B%B4%E6%92%AD%E8%81%8A%E5%A4%A9%29.meta.js
// ==/UserScript==
function change() {
$("ytd-live-chat-frame").css("display","none");
}
change();
var ref = "";
ref = setInterval(function(){
    change();
},1000);