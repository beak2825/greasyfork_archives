// ==UserScript==
// @name        How much posts today
// @namespace   HMPT
// @description Count how much posts made a user today (upto 40 posts)
// @author      Hash G.
// @include     *hackforums.net/search.php*
// @require     http://code.jquery.com/jquery-2.2.2.min.js
// @version     0.1.0
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/18468/How%20much%20posts%20today.user.js
// @updateURL https://update.greasyfork.org/scripts/18468/How%20much%20posts%20today.meta.js
// ==/UserScript==

if ($("td.tcat:nth-child(2) > span:nth-child(1) > strong:nth-child(1) > a:nth-child(1)").html() === "Author") {
	var nb_posts = $(".tborder tbody:nth-child(1) tr td:nth-child(7) span.smalltext:contains('Today')").not("em").length;
	$("strong:contains('Search Results')").after("<span class='smalltext' style='float: right;'>This user posted <span id='posts_today'>"+nb_posts+"</span> times today.</span>");	
	
	if (nb_posts > 19) {
		$("#posts_today").html("...");
		$.get(document.URL + "&sortby=dateline&order=desc&uid=&page=2", function(data) {
			nb_posts = nb_posts + $(data).find(".tborder tbody:nth-child(1) tr td:nth-child(7) span.smalltext:contains('Today')").length;
			$("#posts_today").html(nb_posts);
		});
	}
}