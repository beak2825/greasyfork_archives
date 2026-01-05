// ==UserScript==
// @name        Notepad in Full Reply mode
// @namespace   Notepad in Full Reply
// @description http://hackforums.net/showthread.php?tid=5212290
// @include     *hackforums.net/newreply.php?tid=*
// @include     *hackforums.net/newthread.php?fid=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @version     0.1.1
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/18234/Notepad%20in%20Full%20Reply%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/18234/Notepad%20in%20Full%20Reply%20mode.meta.js
// ==/UserScript==

var notepadContent = GM_getValue("notepadContent", "Put content here and click save");

setTimeout(function() {
	console.log("azeae");
	$("head").append("<style>.messageEditor { float: left }</style>");
	$("table.tborder:nth-child(2) > tbody:nth-child(1) > tr:nth-child(4) > td:nth-child(2)").attr("style", "width: 50%");
	$("#message_old").after("<div style='float: center; margin-left: " + ($(".messageEditor").width() + 70) + "px;' ><textarea id='notepad' style='height:"+($(".messageEditor").height() - 70)+"px;width:200px'>"+notepadContent+"</textarea><div><button id='saveNotepad' class='button'>Save</button></div></div>");
	
	$("#saveNotepad").on("click", function() {
		GM_setValue("notepadContent", $("#notepad").val());
		return false;
	});
	
}, 600);