// ==UserScript==
// @name Dual-sub styles
// @namespace Video
// @description Dual-sub styles for Netflix, YouTube
// @run-at document-end
// @match *://www.netflix.com/*
// @match *://www.youtube.com/*
// @grant none
// @version 1.0.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489731/Dual-sub%20styles.user.js
// @updateURL https://update.greasyfork.org/scripts/489731/Dual-sub%20styles.meta.js
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

addGlobalStyle('.lln-word, .lln-not-word { color: yellow !important }');