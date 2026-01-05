// ==UserScript==
// @name         Lio patch
// @namespace    none
// @version      0.1
// @description  Patch de lio
// @author       You
// @match        https://w1.crownofthegods.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20270/Lio%20patch.user.js
// @updateURL https://update.greasyfork.org/scripts/20270/Lio%20patch.meta.js
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
addGlobalStyle('#incomingsSpan { font-size: 9px; }');