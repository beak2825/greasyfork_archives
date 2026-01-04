// ==UserScript==
// @name         Destiny Split
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  dgg split chat
// @author       garych
// @match        https://www.destiny.gg/bigscreen
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36448/Destiny%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/36448/Destiny%20Split.meta.js
// ==/UserScript==

function replaceChat() {
    var embeddedChat = '<iframe id="chat-frame" class="stream-element" seamless="seamless" src="/embed/chat?follow=%2Fbigscreen" style="height: 50% !important"></iframe> <iframe id="twitch-chat" src="https://www.twitch.tv/destiny/chat" style="border:none; display:block; outline:none; height:50%; width:100%"></iframe>';
    $("#chat-wrap").html(embeddedChat);
}

var replaceInterval = setInterval( function(){
    if(!$("#chat-wrap #twitch-chat").length){
        replaceChat();
        console.log("replacing chat");
    } else {
        clearInterval(replaceInterval);
        console.log("no longer replacing chat");
    }
}, 50);