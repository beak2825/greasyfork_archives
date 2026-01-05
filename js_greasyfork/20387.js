//
// Written by Glenn Wiking
// Script Version: 0.0.1b
//
// ==UserScript==
// @name        ShadeRoot Prank
// @namespace   SRPRANK
// @version     0.0.1b
// @grant       none
// @icon        //
// @description	Install this script on a friend's computer, hide their Greasemonkey icon and look at their faces.

// @include     *

// @downloadURL https://update.greasyfork.org/scripts/20387/ShadeRoot%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/20387/ShadeRoot%20Prank.meta.js
// ==/UserScript==

function ShadeRootPrank(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootPrank(
	'html, body {filter: grayscale(100%) blur(.5px) !important; opacity: .95;}'
	+
	'* a, * button, * li {filter: blur(0) !important; transition: filter 200ms ease-in-out 0ms !important;}'
	+
	'* a:hover, * button:hover, * li:hover {filter: blur(.5px) !important; transition: filter 200ms ease-in-out 0ms !important;}'
);