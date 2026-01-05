// ==UserScript==
// @name         domain.com.au junk listing filter
// @namespace    http://github.com/jamesinc/
// @version      0.4
// @description  This extension filters 'application received' and 'deposit taken' style listings from summary view on the Domain website.
// @author       James Ducker
// @match        https://tampermonkey.net/index.php?version=3.11&ext=dhdg&updated=true
// @grant        none
// @include      http://www.domain.com.au/search/rent/*
// @include      https://www.domain.com.au/search/rent/*
// @downloadURL https://update.greasyfork.org/scripts/12098/domaincomau%20junk%20listing%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/12098/domaincomau%20junk%20listing%20filter.meta.js
// ==/UserScript==

(function($){
var isDickheadTitle = function ( title ) {
	var titles = [ "application received", "deposit taken", "leased", "application approved", "application recieved" ];
	
	for ( var i = 0; i < titles.length; i++ )
		if (title.toLowerCase().indexOf(titles[i]) !== -1 ) return true;

};

$(".description__title, .description__main, .pricepoint").each(function( ) {
	var el = $(this),
	    parent;
	    
	if ( isDickheadTitle(el.text()) ) {
		parent = el.parents("li.strap");
		
		parent.empty().css({
			"line-height": "50px",
			background: "#999",
			color: "white",
			"text-align": "center"
		});
		
		parent.text("Dick listing removed");
	}
});
}(jQuery));