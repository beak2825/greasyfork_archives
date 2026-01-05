// ==UserScript==
// @name        Korpelan sivuihin marginaalit
// @description Jotta ei ahdistaisi.
// @namespace   Rennex
// @include     /https?:\/\/jkorpela.fi\//
// @version     1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4964/Korpelan%20sivuihin%20marginaalit.user.js
// @updateURL https://update.greasyfork.org/scripts/4964/Korpelan%20sivuihin%20marginaalit.meta.js
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

addGlobalStyle("body { margin: 0 auto; }\np { margin-bottom: 0.4em; }")
