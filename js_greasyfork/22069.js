// ==UserScript==
// @name        FURSTREAM background toggle
// @namespace   furstre.am
// @description Adds button to switch background to dark or light colored
// @include     https://furstre.am/stream/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22069/FURSTREAM%20background%20toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/22069/FURSTREAM%20background%20toggle.meta.js
// ==/UserScript==

/* BEGIN INLINE CODE FROM: https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js */
/*
The MIT License (MIT)

Copyright (c) 2014 Anthony Lieuallen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


This script is intended to be used with @require, for Greasemonkey scripts
using "@grant none".  It emulates the GM_ APIs as closely as possible, using
modern browser features like DOM storage.

Scripts should plan to remove usage of GM_ APIs, but this shim offers a
short-term workaround to gain the benefits of running in the security
restriction free "@grant none" mode before that is completed.

Read the comments on each function to learn if its emulation is good enough
for your purposes.

NOT IMPLEMENTED:
 * GM_getResourceText
 * GM_openInTab
 * GM_registerMenuCommand
*/
const __GM_STORAGE_PREFIX = [
    '', GM_info.script.namespace, GM_info.script.name, ''].join('***');

// All of the GM_*Value methods rely on DOM Storage's localStorage facility.
// They work like always, but the values are scoped to a domain, unlike the
// original functions.  The content page's scripts can access, set, and
// remove these values.  A
function GM_getValue(aKey, aDefault) {
  'use strict';
  let val = localStorage.getItem(__GM_STORAGE_PREFIX + aKey)
  if (null === val && 'undefined' != typeof aDefault) return aDefault;
  return val;
}

function GM_setValue(aKey, aVal) {
  'use strict';
  localStorage.setItem(__GM_STORAGE_PREFIX + aKey, aVal);
}
/* END INLINE CODE FROM: https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js */

function addGlobalStyle(css, id) {
	var style = $(document.createElement("style")).attr("type", "text/css").html(css);
	if(id) style.attr("id", id);
	$("head").append(style);
}

function toggleBackground() {
	var style = $("#dark-background");
	if(style.length) {
		do {
			style.remove();
			style = $("#dark-background");
		} while (style.length);
		GM_setValue("Background", "light");
	}
	else {
		addGlobalStyle("body { color: #ddd !important; }", "dark-background");
		addGlobalStyle(".body .center { background-color: rgba(0, 0, 0, 0.8) !important; }", "dark-background");
		addGlobalStyle(".comunica{ color: #fff !important; }", "dark-background");
		addGlobalStyle(".comunica .comunica-top { background-color: #444 !important; }", "dark-background");
		addGlobalStyle(".comunica .comunica-top .button { color: rgba(255, 255, 255, 0.5) !important; }", "dark-background");
		addGlobalStyle(".comunica #comunica-chat-pane { background-color: #222 !important; color: #fff !important; }", "dark-background");
		addGlobalStyle(".comunica #comunica-chat-pane .msg .content { background-color: #444 !important; }", "dark-background");
		addGlobalStyle(".comunica .comunica-msg-input { background-color: #444 !important; color: #eee; }", "dark-background");
		addGlobalStyle(".comunica .comunica-smiles { opacity: 0.8 !important; }", "dark-background");
		addGlobalStyle(".comunica .comunica-menu { background-color: #444 !important; }", "dark-background");
		GM_setValue("Background", "dark");
	}
}

$(window).load(function(){
	$("#chat .comunica .comunica-top").append($(document.createElement("i")).addClass("fa fa-adjust fa-2x fa-fw button").click(toggleBackground));
	if (GM_getValue("Background", "light") === "dark") {
		toggleBackground ();
	}
})

