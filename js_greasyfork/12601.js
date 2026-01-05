// ==UserScript==
// @name         emDraw
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.2
// @description  Draw on EM
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12601/emDraw.user.js
// @updateURL https://update.greasyfork.org/scripts/12601/emDraw.meta.js
// ==/UserScript==

var pos = {};
var active = false;
$("body").mousedown(function(e) {
	if (e.altKey) {
		active = true;
		$("body").append("<div id='cover' style='width: 100%; height: 100%; opacity: 0; cursor: pointer; position: fixed; top: 0px; left: 0px;'></div>");
		$("body").append("<div class='draw' style='z-index: 100; width: 3px; height: 3px; background-color: red; position: fixed; top: " + e.clientY + "px; left: " + e.clientX + "px; border-radius: 100px;'></div>");
	}
});

$("body").mouseup(function() {
	active = false;
	$("#cover").remove();
});

$("body").mousemove(function(e) {
	if (active) {
		$("body").append("<div class='draw' style='z-index: 100; width: 3px; height: 3px; background-color: red; position: fixed; top: " + e.clientY + "px; left: " + e.clientX + "px; border-radius: 100px; cursor: pointer;'></div>");
	}
});

$("body").keypress(function(e) {
	if (e.which == 99) {
		$(".draw").remove();
	}
});