// ==UserScript==
// @name           GameTracker.com direct links
// @version        2.2
// @namespace      www.gametracker.com
// @author         sapphyrus
// @description    Converts Join Buttons in the search results to clickable links to Steam games.
// @include        http*.gametracker.com/server_info/*
// @include        http*.gametracker.com/search/*
// @downloadURL https://update.greasyfork.org/scripts/29708/GameTrackercom%20direct%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/29708/GameTrackercom%20direct%20links.meta.js
// ==/UserScript==

if(document.URL.match(/gametracker\.com\/search\//i)) { //Search page
	var links = document.querySelectorAll("a[href^='javascript:showPopupExternalLink']");
	for(var i = 0, l = links.length; i < l; i++) {
		var el = links[i];
		var link = "steam://connect/" + el.href.split("&ip=")[1].replace("&port=", ":").split("'")[0];
		el.href = link;
	}
} else { //Server info page
	var link = "steam://connect/" + document.URL.match(/\d+\.\d+\.\d+\.\d+:\d+/)[0];
	var buttons = document.querySelectorAll("span[onclick^='showPopupExternalLink(']");
	for(var i = 0, l = buttons.length; i < l; i++) {
		var el = buttons[i];
		el.onclick = null;
		el.addEventListener ("click", function(){
			window.open(link,"_self");
		} , false);
	}

}


