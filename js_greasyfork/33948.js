//
// ==/UserScript==
//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/10/17
// Date of resolution: 09/10/17
//
// ==UserScript==
// @name        ShadePrank Gradual Sepia
// @namespace   SRGS
// @description Shaderoot prank that, after 20 seconds, fades the page to sepia over 1 minute
// @version     1.0.0a
// @icon        https://i.imgur.com/iFR552u.png

// @include     *

// @downloadURL https://update.greasyfork.org/scripts/33948/ShadePrank%20Gradual%20Sepia.user.js
// @updateURL https://update.greasyfork.org/scripts/33948/ShadePrank%20Gradual%20Sepia.meta.js
// ==/UserScript==

function ShadePrankGS(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadePrankGS (
	'* {filter: sepia(0%); transition: filter 60s ease-in-out 2000ms;}'
	+
	'html:hover > * {filter: sepia(60%) !important; transition: filter 60s ease-in-out 2000ms;}'
);