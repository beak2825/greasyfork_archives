// ==UserScript==
// @name        FURSTREAM chat expander
// @namespace   furstre.am
// @description Make the chat more compact on stream pages
// @include     https://furstre.am/stream/*
// @version     10
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2735/FURSTREAM%20chat%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/2735/FURSTREAM%20chat%20expander.meta.js
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

var insertListener = function(e){
	if (e.animationName == "nodeInserted") {
		var avatar = $(e.target).children(".av").detach();
		var details = $(e.target).children(".content").children(".details").detach();
		$(e.target).children(".content").prepend(details);
		$(e.target).children(".content").prepend(avatar);
	}
}

function toggleChatPosition() {
	var chat = $("#chat");
	if(chat.hasClass("pull-right")) {
		chat.removeClass("pull-right");
		$("#chat .comunica .comunica-top .fa-arrow-left").removeClass("fa-arrow-left").addClass("fa-arrow-right");
		GM_setValue("ChatPosition", "left");
	}
	else {
		chat.addClass("pull-right");
		$("#chat .comunica .comunica-top .fa-arrow-right").removeClass("fa-arrow-right").addClass("fa-arrow-left");
		GM_setValue("ChatPosition", "right");
	}
}

function toggleBoldNames() {
	var style = $("#boldnames");
	if(style.length) {
		style.remove();
		GM_setValue("BoldNames", "normal");
	}
	else {
		addGlobalStyle("#comunica-chat-pane .msg .content .details { font-weight: 700; opacity:1 !important; }", "boldnames");
		GM_setValue("BoldNames", "bold");
	}
}

$(window).load(function(){
	addGlobalStyle("body { overflow-y: hidden; }")
	addGlobalStyle(".body { overflow-y: scroll !important; height: 100% !important; margin: 0 !important; }")
	addGlobalStyle("#flex__1 { position: static !important; float: left; }")
	addGlobalStyle("#chat { position: static !important; float: left; }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg { margin: 0 !important; }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg .content { margin: 0 !important; float: none !important; width: 100% !important; }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg .content .msgs p { margin-left: 0 !important; margin-right: 0 !important; }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg .content .msgs :first-child { margin-top: 0 !important; }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg .content .details { margin: 0 !important; }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg .content:after { display: none; !important }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg .content.pull-right:after { display: none !important; }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg .av { position: static !important; float: left !important; margin-right: 8px; }")
	addGlobalStyle("@-webkit-keyframes nodeInserted {  from { opacity: 0.99; } to { opacity: 1; }  }")
	addGlobalStyle("@-moz-keyframes nodeInserted {  from { opacity: 0.99; } to { opacity: 1; }  }")
	addGlobalStyle("@-ms-keyframes nodeInserted {  from { opacity: 0.99; } to { opacity: 1; }  }")
	addGlobalStyle("@-o-keyframes nodeInserted {  from { opacity: 0.99; } to { opacity: 1; }  }")
	addGlobalStyle("@keyframes nodeInserted {  from { opacity: 0.99; } to { opacity: 1; }  }")
	addGlobalStyle(".comunica #comunica-chat-pane .msg { " +
				"-webkit-animation: nodeInserted 0.001s;" +
				"-moz-animation: nodeInserted 0.001s;" +
				"-ms-animation: nodeInserted 0.001s;" +
				"-o-animation: nodeInserted 0.001s;" +
				"animation: nodeInserted 0.001s;" +
			"}")
	document.addEventListener("webkitAnimationStart", insertListener, false)
	document.addEventListener("MSAnimationStart", insertListener, false)
	document.addEventListener("oanimationstart", insertListener, false)
	document.addEventListener("animationstart", insertListener, false)
	var chat = $("#chat").addClass("pull-right").detach()
	$("#flex__1").after(chat)
	$('.body div[style="position:absolute;width:100%;height:20px;bottom:0;background-color:#222"]').css({ "position" : "static" })
	$("body").contents().first().remove()
	$("#chat .comunica .comunica-top").append($(document.createElement("i")).addClass("fa fa-arrow-left fa-2x fa-fw button").click(toggleChatPosition))
	$("#chat .comunica .comunica-top").append($(document.createElement("i")).addClass("fa fa-bold fa-2x fa-fw button").click(toggleBoldNames))
	if (GM_getValue("ChatPosition", "right") === "left") {
		toggleChatPosition ();
	}
	if (GM_getValue("BoldNames", "normal") === "bold") {
		toggleBoldNames ();
	}
})
