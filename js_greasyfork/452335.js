// ==UserScript==
// @name         Enter the commenter's channel by youtube chat
// @namespace    Enter the commenter's channel
// @version      1.0.1
// @description  Double click on username to jump to his channel
// @author       null
// @match        *://*.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/452335/Enter%20the%20commenter%27s%20channel%20by%20youtube%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/452335/Enter%20the%20commenter%27s%20channel%20by%20youtube%20chat.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (window.location.pathname !== "/live_chat"&&window.location.pathname !== "/live_chat_replay") return;
    let URL
    let Itemslist = document.querySelector("#contents.yt-live-chat-renderer");
    if (!Itemslist) return;
    Itemslist.ondblclick = (e) =>{
        switch (e.target.id)
        {
            case "author-name":
                URL = e.target?.parentNode?.parentNode?.parentNode?.data?.authorExternalChannelId||e.target?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.data?.authorExternalChannelId
                URL&&window.open("https://www.youtube.com/channel/" + URL +"/about")
        }
    }
    Itemslist.onmouseover = (e) =>{
        switch (e.target.id)
        {
            case "author-name":
                e.target.style.cursor = "pointer"
        }
    }
})();