// ==UserScript==
// @name Minimalize for YouTube SuperAssistant
// @namespace djshigel
// @version 0.9
// @description Transparent description and improve theater mode for: https://greasyfork.org/ja/scripts/521538-youtubeᴾˡᵘˢ-super-assistant-video-downloader-no-ads-new-layout-for-yt
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/530275/Minimalize%20for%20YouTube%20SuperAssistant.user.js
// @updateURL https://update.greasyfork.org/scripts/530275/Minimalize%20for%20YouTube%20SuperAssistant.meta.js
// ==/UserScript==

(function() {
let css = `body::-webkit-scrollbar {
    width: 0 !important;
}

/* body:has(ytd-watch-flexy[theater]:not([hidden])) {
    overflow: hidden;
} */

#masthead[page-dark-theme] {
    background: linear-gradient(#202020, transparent);
}

#content:has(ytd-watch-flexy[theater]:not([hidden])) #masthead[page-dark-theme] {
    background: linear-gradient(#202020, #000000);
    height: 86px;
}

#content:has(ytd-watch-flexy[theater]:not([hidden])) ytd-page-manager {
    margin-top: 86px;
}

@media screen and (min-height: 1270px) and (orientation: landscape),
@media screen and (min-height: 1980px) and (orientation: portrait) {
    #masthead[page-dark-theme] {
        background: linear-gradient(#000, transparent);
    }

    #content:has(ytd-watch-flexy[theater]:not([hidden])) #masthead[page-dark-theme] {
        background: #000;
    }
}

#content:has(#movie_player.ytp-autohide) #masthead[theater] #container {
    opacity: 0;
    transition: opacity .3s;
}

#content:has(#movie_player.ytp-autohide) #masthead[theater]:hover #container {
    opacity: 1;
}

ytd-watch-flexy[is-dark-theme][theater] #columns,
ytd-watch-flexy[theater]:has(#movie_player.ytp-autohide) #columns {
    background: #000;
}

ytd-watch-flexy[theater]:has(#movie_player.ytp-autohide) #columns #primary,
ytd-watch-flexy[theater]:has(#movie_player.ytp-autohide) #columns #secondary {
    opacity: 0;
    transition: opacity .3s;
}

ytd-watch-flexy[theater]:has(#movie_player.ytp-autohide) #columns:hover #primary, 
ytd-watch-flexy[theater]:has(#movie_player.ytp-autohide) #columns:hover #secondary {
    opacity: 1;
}

#movie_player.ytp-autohide .branding-img {
    display: none !important;
}

#description {
    background-color: transparent !important;
    opacity: .5;
}

#below ytd-merch-shelf-renderer {
    background-color: transparent !important;
    opacity: 0;
    transition: opacity .5s;
}

#below:hover ytd-merch-shelf-renderer {
    opacity: .5;
}

#description-inner{
    margin-left: 0 !important;
}

#inline-expander, #inline-expander:hover {
    background: transparent;
}

#secondary {
    opacity: .5;
    transition: opacity cubic-bezier(.98, -.01, .69, .11) .5s;
    height: 1000px;
}

#secondary:hover {
    opacity: 1;
}

secondary-wrapper:not(:has(#chat-container > ytd-live-chat-frame)):not(:has(> #chat-container)) > #right-tabs {
    margin-top: 83px;
}

#material-tabs > a {
    background-color: var(--yt-active-playlist-panel-background-color) !important;
}

ytd-playlist-panel-renderer {
    z-index: 9999;
}

.ytp-button[aria-label="Hide chats"], .ytp-button[aria-label="Show chats"] {
    margin-top: 5px;
    margin-right: 10px;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
