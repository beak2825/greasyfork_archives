// ==UserScript==
// @name OGame: Shorten messages links
// @namespace https://greasyfork.org/users/4668-black-cat
// @description OGame: usefull for some internet connections
// @version 5.4
// @creator Black Cat
// @include http://*.ogame.gameforge.com/game/index.php?page=messages*
// @downloadURL https://update.greasyfork.org/scripts/4443/OGame%3A%20Shorten%20messages%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/4443/OGame%3A%20Shorten%20messages%20links.meta.js
// ==/UserScript==

var strFunc = (function(){

	$(document).ajaxSuccess(function(e,xhr,settings){
		if (settings.url.indexOf("page=messages") == -1) return;
		if (settings.data.indexOf("displayPage") == -1) return;

		$("#messageContent td.subject a.overlay").each(function () {
			var link = $(this);
			var href = link.attr("href");
			link.attr("href", href.replace(/&mids=[^&]*/,""));
		});
	});

}).toString();

var script = document.createElement("script");
script.setAttribute("type","text/javascript");
script.text = "(" + strFunc + ")();";
document.body.appendChild(script);

