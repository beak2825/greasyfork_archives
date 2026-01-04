// ==UserScript==
// @name         No Gold Please!
// @namespace    http://kartikynwa.gitlab.io/
// @version      0.6
// @description  Removes elements pertaining to Reddit Gold
// @author       KS
// @match        *://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?domain=www.reddit.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/376765/No%20Gold%20Please%21.user.js
// @updateURL https://update.greasyfork.org/scripts/376765/No%20Gold%20Please%21.meta.js
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

addGlobalStyle(".give-gold-button { display: none !important; padding: 0 !important; }");
addGlobalStyle(".awardings-bar { display: none !important; }");