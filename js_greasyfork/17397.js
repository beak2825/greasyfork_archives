//
// Written by Glenn Wiking
// Script Version: 1.0.0b
// Date of issue: 18/02/16
// Date of resolution: 24/02/16
//
// ==UserScript==
// @name        ShadeRootFix Greasyfork
// @namespace   SRFGS
// @description Top quality magical fix for Greasyfork
// @include     *greasyfork.org*
// @version     1.0.0b
// @icon        https://i.imgur.com/srYVhZC.png

// @downloadURL https://update.greasyfork.org/scripts/17397/ShadeRootFix%20Greasyfork.user.js
// @updateURL https://update.greasyfork.org/scripts/17397/ShadeRootFix%20Greasyfork.meta.js
// ==/UserScript==

function ShadeRootFix_GF(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootFix_GF (
	'html, body {background-color: #332E2E !important; color: #D8BDBD !important;}'
	+
	'a {color: #AD2424 !important;}'
	+
	'a:visited {color: #9B4545 !important;}'
	+
	'#main-header, #main-header a, #main-header a:visited, #main-header a:active {color: #FFE9E9 !important;}'
	+
	'.list-option-group {background-color: #4E2727 !important;}'
	+
	'pre, code, #code-container {background: #602414 !important; border: 1px solid #872A11 !important;}'
);