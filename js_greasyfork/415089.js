// ==UserScript==
// @name         Youtube聊天只保留自己
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  用于屏蔽 youtube 聊天窗口中的其他任何人。
// @author       Gear
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415089/Youtube%E8%81%8A%E5%A4%A9%E5%8F%AA%E4%BF%9D%E7%95%99%E8%87%AA%E5%B7%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/415089/Youtube%E8%81%8A%E5%A4%A9%E5%8F%AA%E4%BF%9D%E7%95%99%E8%87%AA%E5%B7%B1.meta.js
// ==/UserScript==



var Divs;
var str="42 Gear";  // 在这里输入你的用户名
window.setInterval(function(){
    Divs = document.getElementsByClassName("style-scope yt-live-chat-text-message-renderer");
    for(var i = 0; i < allDivs.length; i++) {
        var k = allDivs[i];
        if(k.id=="content") {
          name = k.childNodes[1].childNodes[1].innerText
          if(name != str) {
            k = k.parentElement;
            k.parentElement.removeChild(k);
          }
        }
    }
}, 10);