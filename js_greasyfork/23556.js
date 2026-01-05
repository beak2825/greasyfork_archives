// ==UserScript==
// @name          rip
// @namespace     http:/penple.org/
// @description	  rest in paperonies
// @include       https://www.vocabulary.com/*
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/23556/rip.user.js
// @updateURL https://update.greasyfork.org/scripts/23556/rip.meta.js
// ==/UserScript==

jQuery( document ).ajaxComplete(function( event, xhr, settings ) {
	if ( settings.url === "/challenge/nextquestion.json" ) {
		setTimeout(function(){
			var word = jQuery(".instructions:last").find("strong").html();
			console.log(word);
			jQuery.ajax( "https://www.vocabulary.com/dictionary/definition.ajax?lang=en&search=" + word)
		}, 100);
	}
	if ( settings.url.includes("definition.ajax") ) {
		var wow = xhr.responseText;
		console.log(wow);
		jQuery( ".choices:last" ).children().each(function( index ) {
			console.log(jQuery( this ).text());
			if (wow.includes(jQuery( this ).text())) {
				jQuery( this ).css("color","aqua")
			}
			console.log(wow.includes(jQuery( this ).text()));
		});
	}
});