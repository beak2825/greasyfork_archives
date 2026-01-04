// ==UserScript==
// @name        Twitch.tv highlights first chats from users - Light mode
// @namespace   https://greasyfork.org/users/1188705
// @version     1.0
// @description Highlights a username in the chat in yellow if it's the first time they sent a message in your browser session, then adds them to a list of observed chatters and adds a mutationoberver to look for new chats.
// @author      sunmilk50
// @license     public domain
// @match       https://www.twitch.tv/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/486286/Twitchtv%20highlights%20first%20chats%20from%20users%20-%20Light%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/486286/Twitchtv%20highlights%20first%20chats%20from%20users%20-%20Light%20mode.meta.js
// ==/UserScript==
(function(){const b=new Set;(new MutationObserver(function(e){e.forEach(function(c){"childList"===c.type&&Array.from(c.addedNodes).forEach(a=>{if(a.classList&&a.classList.contains("chat-line__message")){const d=a.querySelector(".chat-author__display-name").innerText;b.has(d)||(a.style.backgroundColor="yellow",b.add(d))}})})})).observe(document.body,{childList:!0,subtree:!0})})();