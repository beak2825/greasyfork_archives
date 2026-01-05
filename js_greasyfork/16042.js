// ==UserScript==
// @name                Notepad2PM
// @author              Hash G.
// @namespace           HF
// @description         http://hackforums.net/showthread.php?tid=5124241
// @include             *hackforums.net/private.php?action=*
// @require             http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version             1.0
// @grant               GM_getValue
// @grant               GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/16042/Notepad2PM.user.js
// @updateURL https://update.greasyfork.org/scripts/16042/Notepad2PM.meta.js
// ==/UserScript==



setTimeout(function() {
	for (i = 1; i < 7; i++) {
		$(".quick_keys > form:nth-child(1) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child("+i+")").append("<td class='trow2' id='notepad-"+i+"'></td>");
	}
	$("#notepad-1").attr("class", "thead");
	$("#notepad-5").append("<div id='notepad'><textarea id='textNotepad' style='width: 300px; height: 411px;'>" + GM_getValue("notepad") + "</textarea></div>");
	$("#notepad-6").append("<button id='updateNotepad' type='button' class='button' style='display: block; margin: auto;'>Update your notepad</button>");
	
	
	
	$("#updateNotepad").on("click", function() {
		notepad = $("#textNotepad").val();
		GM_setValue("notepad", notepad);
		$("#updateNotepad").html("Updated!");
		setTimeout(function () {
			$("#updateNotepad").html("Update your notepad again");
		}, 2000);
	});
	
}, 200);

