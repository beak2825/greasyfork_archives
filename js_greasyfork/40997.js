// ==UserScript==
// @name         SKLive Editor
// @namespace    undefined
// @version      0.6
// @description  Modify SKLive Layout
// @author       Shing
// @match        *://sk-knower.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/40997/SKLive%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/40997/SKLive%20Editor.meta.js
// ==/UserScript==

window.onload = function() {
    // Dark Mode of Twitch Chat
    var chat = document.getElementById("chat_ttv");
    if (chat === null) {
        console.log("No embedded chat");
    } else {
        var src_origin = chat.src;
        var isTwitchChat = src_origin.toLowerCase().includes("twitch");
        if (isTwitchChat === true) {
            // have parmeter
            if (src_origin.includes("?")) {
                chat.src = src_origin + "&darkpopout";
            }
            // no parmeter
            else {
                chat.src = src_origin + "?darkpopout";
            }
            console.log("Twitch chat is in dark mode");
        } else {
            console.log("Other chat is detected and do nothing");
        }
    }

    // Extend chat window height
    $('#chat_under').hide();
  
    // collapse left following bar
    $("#opennav").click();
  
    // auto extend player height
    downplayer();
  
    // Remove AdBlock Suggestion
    setCookie("closeadsuggest2", "true", 999);
    var popUp = document.getElementById("asuggest");
    if (popUp === null) {
        console.log("No adBlock suggestion");
    } else {
        closeadbsuggest();
        console.log("AdBlock suggestion popup is removed");
    }
}