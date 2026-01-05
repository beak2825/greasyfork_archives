// ==UserScript==
// @name           ripley
// @namespace      fix_the_alien
// @include        http://blog.b92.net/text/*
// @description B92 users cleaning
//@version 0.1
// @version 0.0.1.20151013083440
// @downloadURL https://update.greasyfork.org/scripts/13047/ripley.user.js
// @updateURL https://update.greasyfork.org/scripts/13047/ripley.meta.js
// ==/UserScript==

var aliens = [ "/user/11632/dusanj92/" ]
			   
function detox() {

	if( window.location != null && window.location.toString().toLowerCase().indexOf("http://blog.b92.net/text/") == -1 ) {
		return;
	}

	var alien_blots = "//*/span/a[";
	
	// totally unholy string concatenation in a loop
	for( var i = 0; i < aliens.length - 1; ++i ) {			
		alien_blots = alien_blots + "@href='" + aliens[i] + "' or ";
	}
	alien_blots = alien_blots + "@href='" + aliens.pop() + "']";
	
	var sva_alienova_jaja = document.evaluate( alien_blots, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null );
	
	for ( var i = 0; i < sva_alienova_jaja.snapshotLength; ++i ) {
		var alien = sva_alienova_jaja.snapshotItem( i );
		var aliena_u_vugla = alien.parentNode.parentNode.parentNode.parentNode;
		document.getElementById( aliena_u_vugla.id ).style.display = "none";
	}
}

detox();