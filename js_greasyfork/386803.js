// ==UserScript==
// @name         YouTube Minus Mind Control
// @namespace    http://kartikynwa.gitlab.io/
// @version      0.1
// @description  Remove suggestions from YouTube homepage and video pages.
// @author       KS
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.youtube.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/386803/YouTube%20Minus%20Mind%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/386803/YouTube%20Minus%20Mind%20Control.meta.js
// ==/UserScript==

// Function courtesy of PaarCrafter on StackOverflow
// https://stackoverflow.com/a/46285637
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle("#contents { display: none !important; }");