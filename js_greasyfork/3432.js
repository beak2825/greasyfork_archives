// ==UserScript==
// @name       Skip Steam Link Filter
// @namespace  http://us.tmg-clan.com/
// @author     Roelof Roos
// @version    1.1
// @description  Redirects users beyond the "Are you sure you want to leave Steam" page
// @match      https://steamcommunity.com/linkfilter/*
// @copyright  2014+, Roelof Roos
// @downloadURL https://update.greasyfork.org/scripts/3432/Skip%20Steam%20Link%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/3432/Skip%20Steam%20Link%20Filter.meta.js
// ==/UserScript==

(function(){
	// Get the window location
    var WindowLocation = window.location.href;
	
	// For now Steam adds ?url= to the window location, after which the URL of the page we want to go to is put in plain text
    var term = "url=";
	
	// Get the full URL of the link we want to go to from the current window location.
    var endURL = WindowLocation.substring(WindowLocation.indexOf(term) + term.length);
	
	// Replace, we don't have to go back
    window.location.replace( endURL );
})();