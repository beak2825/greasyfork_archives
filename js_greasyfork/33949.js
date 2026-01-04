//
// ==/UserScript==
//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/10/17
// Date of resolution: 09/10/17
//
// ==UserScript==
// @name        ShadePrank Upside-Down
// @namespace   SRUD
// @description Shaderoot prank that turns the page upside-down
// @version     1.0.0a
// @icon        https://i.imgur.com/KANtStg.png

// @include     *

// @downloadURL https://update.greasyfork.org/scripts/33949/ShadePrank%20Upside-Down.user.js
// @updateURL https://update.greasyfork.org/scripts/33949/ShadePrank%20Upside-Down.meta.js
// ==/UserScript==

function ShadePrankUD(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadePrankUD (
	'html {transform: rotateZ(180deg) !important;}'
);