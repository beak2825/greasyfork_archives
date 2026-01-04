//
// ==/UserScript==
//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/10/17
// Date of resolution: 09/10/17
//
// ==UserScript==
// @name        ShadePrank No Buttons
// @namespace   SRNB
// @description Shaderoot prank that prevents links and buttons from working
// @version     1.0.0a
// @icon        https://i.imgur.com/nmGjCFS.png

// @include     *

// @downloadURL https://update.greasyfork.org/scripts/33946/ShadePrank%20No%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/33946/ShadePrank%20No%20Buttons.meta.js
// ==/UserScript==

function ShadePrankNB(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadePrankNB (
	'input[type=button]:hover, button:hover, a:hover {pointer-events: none !important;}'
);