//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 15/05/16
// Date of resolution: 15/05/16
//
// ==UserScript==
// @name        ShadeRoot CardCast
// @namespace   SRCC
// @description Eye-friendly magic in your browser for CardcastGame.
// @include     *.cardcastgame.*
// @version     1
// @grant       none
// @icon        http://i.imgur.com/5sizTYn.png
// @downloadURL https://update.greasyfork.org/scripts/37775/ShadeRoot%20CardCast.user.js
// @updateURL https://update.greasyfork.org/scripts/37775/ShadeRoot%20CardCast.meta.js
// ==/UserScript==

function ShadeRootCC(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootCC (
	'body {background: #000 !important; color: #565252;}'
	+
	'.nav-tabs {border-bottom: 1px solid #3F3B3B !important; padding-top: 4em !important;}'
	+
	'.nav-tabs > li > a {color: #7E7979;}'
	+
	'.form-control {background-color: #353232 !important; border: 1px solid #4B3F3F !important;}'
	+
	'.input-highlight.has-success input {background: #353F35 !important; color: #ABB6A7 !important;}'
	+
	'.input-highlight.has-error input {background: #443939 !important; color: #B6A8A7 !important;}'
	+
	'.table > tbody > tr > td {border-top: 1px solid #382B2B !important;}'
	+
	'.btn-default {color: #A49D9D !important; background-color: #231A1A !important; border-color: #4A3131 !important;}'
	+
	'.action-icon-lightest, .lightest {color: #873737 !important;}'
);