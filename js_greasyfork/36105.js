// ==UserScript==
// @name        Pixiv
// @description for users
// @namespace   org.userscript.bunnelby
// @include     https://www.pixiv.net/*
// @include     http://www.pixiv.net/*
// @version     0.2
// @grant       none
// @runat       document-end

// @downloadURL https://update.greasyfork.org/scripts/36105/Pixiv.user.js
// @updateURL https://update.greasyfork.org/scripts/36105/Pixiv.meta.js
// ==/UserScript==
(function () {
	if (window.frameElement !== null) return;
	
	console.log("run Basic");
	
	var $ = window.jQuery;
	var title = $(".column-title").text().replace(/\d+users入り/, "");
	
	$(function () {
		$(".bookmark-ranges .require-premium")
			.off("click")
			.removeClass("require-premium")
			.click(function (event) {
				event.stopPropagation();
				event.stopImmediatePropagation();
			})
			.each(function () {
				var users = $(this).text().trim();
				var url = "https://www.pixiv.net/search.php?s_mode=s_tag_full&word=";
				url += encodeURIComponent(title + users + "users入り");
				$(this).attr("href", url);
			});
			
		$("#ui-tooltip-container").remove();
		$(".sprites-premium").removeClass("sprites-premium");
		$(".ad-printservice").hide();
		
		for (var key in localStorage) {
			if (key.indexOf("history") >= 0) {
				var history = JSON.parse(localStorage[key]);
				var newHistory = [];
				history.forEach(function (e) {
					if (e.indexOf("users") == -1) {
						newHistory.push(e);
					}
				});
				localStorage[key] = JSON.stringify(newHistory);
			}
		}
	});
})();