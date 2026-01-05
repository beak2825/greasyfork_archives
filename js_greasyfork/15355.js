// ==UserScript==
// @name        Groups Recruitment Status
// @author      Hash G.
// @description Show current groups recruitment status. If something need an update please keep me informed here : http://hackforums.net/showthread.php?tid=5103326
// @namespace   Hash G. - HF
// @include     *hackforums.net/showgroups.php*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     0.1
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/15355/Groups%20Recruitment%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/15355/Groups%20Recruitment%20Status.meta.js
// ==/UserScript==


$(".thead").append("<span style='float: right;'>Please keep me informed <a href='http://hackforums.net/showthread.php?tid=5103326'>here</a> about any updates I may have missed.</span>");
$("table.tborder table").each(function(i) {
	if (i == 0 || i == 1 || i == 3 || i == 11 || i == 14) {
		currentStatus = "<b style='color:red'>Closed</b>";
	} else if (i == 2) {
		currentStatus = "<b><a style='color: green' href='http://hackforums.net/showthread.php?tid=5008786'>Open</a> - <a style='color: green' href='http://hackforums.net/showthread.php?tid=4999111'>Second thread</a></b>";
	} else if (i == 4) {
		currentStatus = "<b><a style='color: green' href='http://hackforums.net/showthread.php?tid=5054694'>Open</b></a>";
	} else if (i == 5 || i == 12) {
		currentStatus = "<b style='color:orange'>Invite only</b>";
	} else if (i == 6) {
		currentStatus = "<b><a style='color: green' href='http://hackforums.net/showthread.php?tid=5101704'>Open</b></a>";
	} else if (i == 7) {
		currentStatus = "<b><a href='http://hackforums.net/showthread.php?tid=4936160'>For sale</a></b>";		
	} else if (i == 8) {
		currentStatus = "<b><a style='color: green' href='http://hackforums.net/showthread.php?tid=5097188'>Open</b></a>";
	} else if (i == 9) {
		currentStatus = "<b><a style='color: green' href='http://hackforums.net/showthread.php?tid=5097430'>Open</b></a>";
	} else if (i == 10) {
		currentStatus = "<b><a style='color: green' href='http://hackforums.net/showthread.php?tid=4932933'>Open</b></a>";	
	} else if (i == 13) {
		currentStatus = "<b><a style='color: green' href='http://hackforums.net/showthread.php?tid=5070037'>Open</b></a>";	
	}
	$(this).find("tr:nth-child(2)").after("<tr><td colspan='2' valign='bottom'>Recruitment status : " + currentStatus + "</td></tr>");
});