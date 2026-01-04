// ==UserScript==
// @name          Twitch Blacklist Words
// @namespace     http://userstyles.org
// @description   Blacklist Words in Twitch Chat
// @author        1953193108
// @include       *://*.twitch.tv/*
// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/40995/Twitch%20Blacklist%20Words.user.js
// @updateURL https://update.greasyfork.org/scripts/40995/Twitch%20Blacklist%20Words.meta.js
// ==/UserScript==

// <span data-a-target="chat-message-text">chessbae is love chessbae is life</span>

var chat_line_class_name = "chat-line__message";

var blacklist = [
    "chessbae" ,
];

(function(){setInterval(function(){var messages=document.getElementsByClassName(chat_line_class_name);for(var i=0;i<messages.length;i+=1){var msg=messages[i].innerText;msg=msg.toLowerCase();for(var j=0;j<blacklist.length;j+=1){if(msg.includes(blacklist[j])){messages[i].setAttribute("style","visibility: hidden !important")}}}}, 50 )})();