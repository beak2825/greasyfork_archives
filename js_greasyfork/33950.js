//
// ==/UserScript==
//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/10/17
// Date of resolution: 09/10/17
//
// ==UserScript==
// @name        ShadePrank Get Back to Work
// @namespace   SRGW
// @description Shaderoot prank that replaces all websites with a "Get back to work" message
// @version     1.0.0a
// @icon        https://i.imgur.com/EcM6Aoc.png

// @include     *

// @downloadURL https://update.greasyfork.org/scripts/33950/ShadePrank%20Get%20Back%20to%20Work.user.js
// @updateURL https://update.greasyfork.org/scripts/33950/ShadePrank%20Get%20Back%20to%20Work.meta.js
// ==/UserScript==

function ShadePrankGW(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadePrankGW (
	'body > *, div {visibility: hidden; background: #333 !important; height: 10px !important; max-height: 10px !important; overflow: hidden !important;}'
	+
	'body:after {content: "Get back to work!"; height: 1em; display: block !important; float: left; color: #EDD !important; visibility: visible !important; position: absolute; margin: 0 auto !important; left: 31%; top: 40%; font-size: 5vw !important; pointer-events: none !important;}'
);