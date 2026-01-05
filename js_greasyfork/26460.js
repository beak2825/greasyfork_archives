// ==UserScript==
// @name        Guzik FW na PB
// @namespace   test
// @include     http://thepiratebay.org/torrent/*
// @include		https://thepiratebay.org/torrent/*
// @version     1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant       GM_addStyle
// @author		turban
// @description:en Adds Filmweb search button on thepiratebay.org movie pages
// @description Adds Filmweb search button on thepiratebay.org movie pages
// @downloadURL https://update.greasyfork.org/scripts/26460/Guzik%20FW%20na%20PB.user.js
// @updateURL https://update.greasyfork.org/scripts/26460/Guzik%20FW%20na%20PB.meta.js
// ==/UserScript==


if(!($("#details .col1").text().indexOf("Movies") > -1 || $("#details .col1").text().indexOf("Filmy") > -1)) return;

var title = $("#title").text().trim();

var toRemoveWildcards = [
		"720p","720","1080p","1080",
		"fullhd","x264","h264","264","ac3", "ac-3",
		"yify","sparks"
	];
	
var filmwebUrl = "http://www.filmweb.pl/search";

$.each(toRemoveWildcards, function (index, element) {
	var wildcardIndex = title.toLowerCase().indexOf(element);
	if (wildcardIndex  > -1) {
		title = title.substring(0, wildcardIndex);
	}
});

//year removal
var regex = /\s*[\(\.]\d{4}[\)\.]\s*/g;

//remove just the year
//title = title.replace(regex, "");
//remove year and everything after year
if(title.search(regex) > -1) {
	title = title.substring(0, title.search(regex));
}


var element = $("<form></form>", {
				"class": "download fwWidget",
				target: "_blank",
				action: filmwebUrl,
				style: "margin-bottom: 10px;"
			});
var input = $("<input/>", {
				value: title,
				name: "q",
				style: "width: 467px;"
			});
var button = $("<button/>", {
				type: "submit"
			}).html("Szukaj na FilmWebie");
				
				
element.append(input, button);

$(".download").before(element);