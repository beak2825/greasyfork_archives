// ==UserScript==
// @name         emNote
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.2
// @description  Creates a virtual notepad that persists across all of EM and autosaves.
// @author       Croned
// @match        https://epicmafia.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/12061/emNote.user.js
// @updateURL https://update.greasyfork.org/scripts/12061/emNote.meta.js
// ==/UserScript==

var show = false;
var style = "<style>\
	#noteTab {\
		width: 80px;\
		height: 30px;\
		background-color: #B80000;\
		position: fixed;\
		top: 0px;\
		left: 0px;\
		border-radius: 0px 0px 10px 10px;\
		text-align: center;\
		color: white;\
		cursor: pointer;\
		line-height: 30px;\
		z-index: 50;\
	}\
	\
	#noteBox {\
		display: none;\
		width: 400px;\
		height: 480px;\
		position: fixed;\
		top: 0px;\
		left: 0px;\
		background-color: white;\
		z-index: 49;\
	}\
	\
	#noteInput {\
	width: 350px;\
	height: 400px;\
	margin: auto;\
	display: block;\
    position: relative;\
    top: 50px;\
	resize: none;\
	}\
</style>";

$("head").append(style);
$("body").append("<div id='noteTab'>emNote</div>");
$("body").append("<div id='noteBox'><textarea id='noteInput'></textarea></div>");
var notes = GM_getValue("emNote");
$("#noteInput").val(notes);

$("#noteTab").click(function() {
	toggleNotes();
});

$("#noteInput").keydown(function() {
    GM_setValue("emNote", $(this).val());
});

$("#container").click(function() {
    GM_setValue("emNote", $("#noteInput").val());
    $("#noteBox").slideUp(250);
	show = false;
});

function toggleNotes() {
	if (show) {
        GM_setValue("emNote", $("#noteInput").val());
		show = false;
		$("#noteBox").slideUp(250);
	}
	else {
		show = true;
		$("#noteBox").slideDown(250);
	}
}