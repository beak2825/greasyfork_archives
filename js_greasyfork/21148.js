// ==UserScript==
// @name         TA forum user blocker
// @namespace    mobiusevalon.tibbius.com
// @version      1.0
// @author       Mobius Evalon <mobiusevalon@tibbius.com>
// @description  Because I was bored on a Sunday evening
// @license      Creative Commons Attribution-ShareAlike 4.0; http://creativecommons.org/licenses/by-sa/4.0/
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @match        https://www.trueachievements.com/forum/viewthread.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21148/TA%20forum%20user%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/21148/TA%20forum%20user%20blocker.meta.js
// ==/UserScript==

var blocklist = [];

function hide(tag)
{
	$("td.author div.userdetails a:first-of-type").each(function() {
		// because ta puts all pertinent post elements in three separate table rows like a silly
		var $group = $(this).closest("tr.posted");
		$group = $group.add($group.eq(0).next());
		if($group.eq(1).next().hasClass("signature")) $group = $group.add($group.eq(1).next());

		if(blocklist.indexOf($(this).text()) > -1) $group.hide();
		else $group.show();
	});
}

$(document).ready(function() {
	var ls = localStorage.blocked_users;
	if($.type(ls) === "string") blocklist = ls.split(",");

	$("td.author div.userdetails a:first-of-type").after(
		$("<br/>"),
		$("<span/>")
		.text("[Hide all posts]")
		.css("cursor","pointer")
		.click(function() {
			blocklist.push($(this).prev().prev().text());
			localStorage.blocked_users = blocklist.join(",");
			hide();
		})
	);
	hide();
});