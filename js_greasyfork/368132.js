// ==UserScript==
// @name         Compact Youtube Live Chat
// @version      0.2
// @description  Tiny compressed chat for Youtube
// @author       Gautyer
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/live_chat?continuation=*
// @grant        none
// @namespace https://greasyfork.org/users/186177
// @downloadURL https://update.greasyfork.org/scripts/368132/Compact%20Youtube%20Live%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/368132/Compact%20Youtube%20Live%20Chat.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('#items.yt-live-chat-ticker-renderer { padding: 0px 0px 0px 0px; }');
addGlobalStyle('#promo { display : none !important; }');
addGlobalStyle('yt-live-chat-header-renderer { display:none; height: 32px; padding : 0px 0px 0px 0px !important; }');
addGlobalStyle('yt-live-chat-text-message-renderer { margin:-3px; padding : 0px 0px 0px 0px !important; }');
addGlobalStyle('ytd-watch[theater] #player.ytd-watch { margin-bottom: 0px; }');
addGlobalStyle('#message.yt-live-chat-text-message-renderer { text-align:left ;display:inline;line-height: 0px}');
addGlobalStyle('#author-badges.yt-live-chat-text-message-renderer { position: absolute; opacity: 0.4;}');
addGlobalStyle('#author-photo.yt-live-chat-text-message-renderer { margin-right: 1px; margin-right: 1px;}');
addGlobalStyle('#author-name.yt-live-chat-text-message-renderer { text-overflow: ellipsis; margin-right: 5px; max-width : 70px !important; min-width : 70px !important; white-space: nowrap; overflow: hidden; display: inline-block;}');