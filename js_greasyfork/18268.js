// ==UserScript==
// @name        View last post on your posts
// @namespace   VLPOYP
// @description View last post on your posts page
// @include     *hackforums.net/search.php*
// @require     http://code.jquery.com/jquery-2.2.2.min.js
// @version     0.1.0
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/18268/View%20last%20post%20on%20your%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/18268/View%20last%20post%20on%20your%20posts.meta.js
// ==/UserScript==

if ($("td.tcat:nth-child(2) > span:nth-child(1) > strong:nth-child(1) > a:nth-child(1)").html() === "Author") {
	$(".tborder > tbody:nth-child(1) > tr:gt(1)").each(function() {
		var href = $(this).find("a").attr("href");
		$(this).find(".smalltext:first").prepend("<a href='"+href+"&amp;action=newpost' title='Go to first unread post' class='quick_jump'>►</a>");
	});
}