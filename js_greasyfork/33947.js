//
// ==/UserScript==
//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/10/17
// Date of resolution: 09/10/17
//
// ==UserScript==
// @name        ShadePrank B&W
// @namespace   SRBW
// @description Shaderoot Prank that turns every page black and white.
// @version     1.0.0a
// @icon        https://i.imgur.com/OBQkgvw.png

// @include     *

// @downloadURL https://update.greasyfork.org/scripts/33947/ShadePrank%20BW.user.js
// @updateURL https://update.greasyfork.org/scripts/33947/ShadePrank%20BW.meta.js
// ==/UserScript==

function ShadePrankBW(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadePrankBW (
	'*, html, body {filter: grayscale(1) contrast(.99) !important; -webkit-filter: grayscale(1) contrast(.99) !important;}'
);