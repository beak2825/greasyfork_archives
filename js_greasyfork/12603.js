// ==UserScript==
// @name         Old YouTube Rating Colours
// @namespace    http://kippykip.x10.mx/
// @version      1.3.3
// @description  Makes the rating bar and thumbs have the original red & green look.
// @author       Kippykip
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12603/Old%20YouTube%20Rating%20Colours.user.js
// @updateURL https://update.greasyfork.org/scripts/12603/Old%20YouTube%20Rating%20Colours.meta.js
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

//Rating bar
addGlobalStyle('.video-extras-sparkbar-likes{float:left;height:2px;background: #00DD00 !important;}');
addGlobalStyle('.video-extras-sparkbar-dislikes{float:left;height:2px;background: #EE0000 !important;}');
addGlobalStyle('.like-button-renderer-like-button.yt-uix-button-toggled .yt-uix-button-content{color: #00BB00}');
addGlobalStyle('.like-button-renderer-like-button.yt-uix-button.yt-uix-button-toggled:before{background:no-repeat url(//i.imgur.com/2zFI0q0.png) -299px -44px;background-size:auto;width:20px;height:20px}');
addGlobalStyle('.like-button-renderer-like-button:active .yt-uix-button-content,.like-button-renderer-like-button.yt-uix-button-toggled .yt-uix-button-content{color:#00CC00}');
addGlobalStyle('.like-button-renderer-like-button.yt-uix-button:active:before,.like-button-renderer-like-button.yt-uix-button.yt-uix-button-toggled:before{background:no-repeat url(//i.imgur.com/2zFI0q0.png) -299px -44px;background-size:auto;width:20px;height:20px}');
//Red dislikes!
addGlobalStyle('.like-button-renderer-dislike-button.yt-uix-button:active:before,.like-button-renderer-dislike-button.yt-uix-button.yt-uix-button-toggled:before{background:no-repeat url(//i.imgur.com/2zFI0q0.png) -113px -83px;background-size:auto;width:20px;height:20px}');
addGlobalStyle('.like-button-renderer-dislike-button.yt-uix-button-toggled .yt-uix-button-content{color: #BB0000}');

//Comments!
addGlobalStyle('.comment-renderer-like-count{margin-right:8px;color:#00BB00 !important;font-size:9pt;vertical-align:top}');
addGlobalStyle('.sprite-like[aria-checked="true"]:before{background:no-repeat url(//i.imgur.com/lzqNC8X.png) 0 -19px !important;background-size:auto;width:14px;height:14px}');
addGlobalStyle('.sprite-dislike[aria-checked="true"]:before{background:no-repeat url(//i.imgur.com/lzqNC8X.png) 0 -112px !important;background-size:auto;width:14px;height:14px}');