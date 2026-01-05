//
// Written by Glenn Wiking
// Script Version: 1.0.1b
// Date of issue: 05/09/16
// Date of resolution: 05/09/16
//
// ==UserScript==
// @name        ShadeRoot PirateBay
// @namespace   SRPB
// @description Eye-friendly magic in your browser for Google
// @include        http://*pirateproxy.*
// @include        https://*pirateproxy.*
// @include        http://*thepiratebay.*
// @include        https://*thepiratebay.*
// @include        http://*ukpirate.*
// @include        https://*ukpirate.*
// @include        http://*piratebaymirror.*
// @include        https://*piratebaymirror.*
// @include        http://*piratebay.*
// @include        https://*piratebay.*
// @include        http://*fastpiratebay.*
// @include        https://*fastpiratebay.*
// @include        http://*gameofbay.*
// @include        https://*gameofbay.*
// @include        http://*tpbunblocked.*
// @include        https://*tpbunblocked.*
// @include        http://*thebay.*
// @include        https://*thebay.*
// @include        http://*urbanproxy.*
// @include        https://*urbanproxy.*
// @include        http://*pirate.trade*
// @include        https://*pirate.trade*
// @include        http://*ukpirateproxy.*
// @include        https://*ukpirateproxy.*
// @include        http://*piratebays.*
// @include        https://*piratebays.*
// @include        http://*thepiratebay-proxy.*
// @include        https://*thepiratebay-proxy.*
// @include        http://*tpbmirror.*
// @include        https://*tpbmirror.*

// @version        1.0.1b
// @icon           https://i.imgur.com/HkWtLzZ.png
// @downloadURL https://update.greasyfork.org/scripts/29112/ShadeRoot%20PirateBay.user.js
// @updateURL https://update.greasyfork.org/scripts/29112/ShadeRoot%20PirateBay.meta.js
// ==/UserScript==

function ShadeRootGOOGLE(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootGOOGLE(
	'body {background: rgb(59, 57, 57) none repeat scroll 0% 0% !important; color: #EDD !important;}'
	+
	'#fp h1 a, .sp, #TPBlogo {opacity: .8 !important;}'
	+
	'#fp, p, #foot, dl, td, tr, .detDesc, #details dt {color: #EDD !important;}'
	+
	'a:hover {border-bottom: 1px solid #CF3300 !important;}'
	+
	'a, a:link, a:visited, a:focus, label {color: #CF3300 !important;}'
	+
	'#fp #inp input, .inputbox, select {background: #653A3A !important; border-radius: 4px !important; border: 1px solid #BDBDBD !important; color: #EDD !important;}'
	+
	'h2, #searchResult th {border-bottom: 1px solid #481004 !important; background: #8A1F09 !important; color: #EDD !important;}'
	+
	'#searchResult tr {background: #3B3939 !important;}'
	+
	'#searchResult td {border: 1px solid #6C2929 !important;}'
	+
	'#searchResult tr.alt {background: #3E1111 !important;}'
	+
	'#searchResult th, #searchResult td {border: 1px solid #3E1414 !important;}'
	+
	'#detailsframe #title {background: #651C10 !important;}'
	+
	'#detailsframe #title {border-bottom: 1px solid #2C0A0A;}'
	+
	'#detailsframe {border-top: 1px solid #4E1515 !important; background: #4E190E !important;}'
	+
	'#details {background: #30140B !important;}'
	+
	'#details dd, #details dt {border-bottom: 1px dashed #A23517 !important;}'
	+
	'.download a {color: #CF3300 !important; border-bottom: 1px dotted #BA3916 !important;}'
	+
	'.nfo {border: 1px solid #651B0B !important; background: #3B3939 !important;}'
	+
	'.comment {background: #5F2121 !important;}'
	+
	'div a[target="_blank"] img {display: none !important;}'
);