// ==UserScript==
// @name         comic.pixiv enable drag img
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  try to take over the world!
// @author       You
// @include     https://comic.pixiv.net/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/385631/comicpixiv%20enable%20drag%20img.user.js
// @updateURL https://update.greasyfork.org/scripts/385631/comicpixiv%20enable%20drag%20img.meta.js
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

addGlobalStyle('.clickable-layer {position: static!important;');