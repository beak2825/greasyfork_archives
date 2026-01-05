// ==UserScript==
// @name                Stream filter
// @namespace           Hash G.
// @description         SM live games name filter
// @include             *satoshimines.com*
// @require             http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version             1.2
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_deleteValue
// @grant               GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11630/Stream%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/11630/Stream%20filter.meta.js
// ==/UserScript==

$(".menu").append("<li><a href='#' onClick='toggle()'>Toggle watching</a></li>");

function toggle() {
	var player = prompt("Player's name");
	var numberOfRows = $(".stream > tbody > tr").length;
	$(".stream").bind("DOMSubtreeModified", function() {
		$(".stream").find(".s_player").each(function () {
			$(this).find("span").each(function() {
				if ($(this).html() !== player) {
					$(this).parent().parent().remove();
				}
			});
		});
	});
}
exportFunction(toggle, unsafeWindow, {defineAs: "toggle"});