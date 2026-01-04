// ==UserScript==
// @name     Dirkjan
// @namespace     Dirkjan.nl
// @version  1.1
// @include  http://dirkjan.nl/*
// @description Dit script zet de rotate melding van dirkjan.nl uit (op je telefoon)
// @downloadURL https://update.greasyfork.org/scripts/394350/Dirkjan.user.js
// @updateURL https://update.greasyfork.org/scripts/394350/Dirkjan.meta.js
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

addGlobalStyle('body:after { background: none ! important; }');