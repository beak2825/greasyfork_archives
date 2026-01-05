// ==UserScript==
// @name        Nyaa Extreme Redux
// @namespace Original by Vietconnect with additional code by Simon1.
// @require     http://code.jquery.com/jquery-3.1.0.slim.min.js
// @include     http*://*.nyaa.*/*
// @grant       GM_xmlhttpRequest
// @version     5.1
// @description This scrip sorts searches by seeders, it also shows the description and images if those are included. Also it grays out unseeded torrents.
// @downloadURL https://update.greasyfork.org/scripts/3648/Nyaa%20Extreme%20Redux.user.js
// @updateURL https://update.greasyfork.org/scripts/3648/Nyaa%20Extreme%20Redux.meta.js
// ==/UserScript==

    // default sort by seeds
    if ((window.location.href.indexOf("page=search") > -1 || window.location.href.indexOf("page") == -1) && window.location.href.indexOf("sort") == -1) {
        var thing = window.location.href.indexOf("?")>-1?'&':'?';
        window.location.replace(window.location + thing + "sort=2");
        redirecting = true;
    }

 // Main
var makeOutLinkNewTab = function() {
	$("a[href*='http://']:not([href*='"+location.hostname+"'])").attr("target","_blank");
}
makeOutLinkNewTab();

if($(".tlist tr.tlistrow").length > 0) {
	$(".tlist tr.tlistrow").after("<tr class='preview-row'><td colspan=8>loading...</td></tr>");
	$(".tlist tr.tlistrow").each(function() {
		if($(this).find(".tlistsn").text() < 2 || ($(this).find(".tlistsn").text() < 5 && $(this).find(".tlistln").text() < 10)) {
			$(this).find(".tlistname a").css("color", "#A3A2A2");
			var row = $(this).next(".preview-row").remove();
		} else {		
			var	url = $(this).find(".tlistname a").attr("href");
			var row = $(this).next(".preview-row").find("td");
			GM_xmlhttpRequest({
				method: "GET",
				url: url,
				onload: function(response) {
					row.html($(response.responseText).find(".viewdescription"));
					makeOutLinkNewTab();
							}
			});
		}
	});
}