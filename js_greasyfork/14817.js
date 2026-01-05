// ==UserScript==
// @name        Heart smiley
// @namespace   HF - Hash G.
// @description Custom Userscript fo replace <3 by an heart
// @include     *hackforums.net/showthread.php*
// @include     *hackforums.net/newreply.php*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     0.1
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/14817/Heart%20smiley.user.js
// @updateURL https://update.greasyfork.org/scripts/14817/Heart%20smiley.meta.js
// ==/UserScript==



if (location.href.match(/newreply.php/i)) {
	$(".quick_keys > form[action*='newreply.php']").submit(function(e) {
		//e.preventDefault();
		msg = $("textarea[id*='message']").val()
		msg = msg.replace("<3", "❤");
		$("textarea[id*='message']").val(msg);
		$(".quick_keys > form[action*='newreply.php']").submit();
	});
} else if (location.href.match(/showthread.php/i)) {
	$("#quick_reply_submit").on("click", function() {
		msg = $("#message").val()
		msg = msg.replace("<3", "❤");
		$("#message").val(msg);
		console.log("k");
	});
}