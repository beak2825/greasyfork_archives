// ==UserScript==
// @name         ok.ru video oopsifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keep ok.ru from closing the video if you accidentally click off of it!
// @author       Tokeli
// @match        https://ok.ru/video/*
// @icon         https://www.google.com/s2/favicons?domain=ok.ru
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434014/okru%20video%20oopsifier.user.js
// @updateURL https://update.greasyfork.org/scripts/434014/okru%20video%20oopsifier.meta.js
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


addGlobalStyle(".media-layer_close_ovr { visibility: hidden !important; }");