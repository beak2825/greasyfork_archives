// ==UserScript==
// @name        gfy ignore list
// @description block  threads,  posts, etc from certain users
// @include     http://gfy.com/*
// @include     http://*.gfy.com/*
// @require     http://code.jquery.com/jquery-1.11.3.min.js
// @version     1.1
// @grant       none
// @namespace https://greasyfork.org/users/19347
// @downloadURL https://update.greasyfork.org/scripts/13533/gfy%20ignore%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/13533/gfy%20ignore%20list.meta.js
// ==/UserScript==



function ignore()
   {

var hide_users = ['DVTimes','Rochard','Twitter','Juicy D. Links'];

$(document).ready(function () {
	$('tbody#threadbits_forum_26 tr').each(function (thread_index, thread_value) {
	    var thread_block = $(this);
		var thread_starter = $('span[style="cursor:pointer"]', this).text();
		$(hide_users).each(function (hide_index, hide_user) {
			if (thread_starter === hide_user)
			{
				thread_block.remove();
			}
		});
	});
	$('table[id^="post"]').each(function (post_index, post_value) {
		var post_block = $(this);
		var post_author = $('a.bigusername', this).text();
		$(hide_users).each(function (hide_index, hide_user) {
			if (post_author === hide_user)
			{
				post_block.remove();
			}
		});
	});
});


}

	
   setInterval(ignore, 0);