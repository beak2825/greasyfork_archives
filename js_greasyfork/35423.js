// ==UserScript==
// @name         Reddit Remove More From
// @namespace    reddit_remove_more_from
// @description  Removes the "more from subreddit" links that appear on comments pages when you are not signed in
// @homepageURL  https://github.com/daraeman/reddit_remove_more_from
// @author       daraeman
// @version      1.2
// @date         2017-06-10
// @include      https://www.reddit.com/r/*/comments/*
// @downloadURL https://update.greasyfork.org/scripts/35423/Reddit%20Remove%20More%20From.user.js
// @updateURL https://update.greasyfork.org/scripts/35423/Reddit%20Remove%20More%20From.meta.js
// ==/UserScript==

(function() {
	var classes = [
		"seo-comments-recommendations",
		"seo-comments",
	];
	var ids = [
		"bottom-comments",
	];
	var children = [];
	classes.forEach( function( classname ){
		children.push( document.getElementsByClassName( classname ) );
	});
	ids.forEach( function( id ){
		children.push( [ document.getElementById( id ) ] );
	});
	for ( var a = 0; a < children.length; a++ ) {
		for ( var b = 0; b < children[ a ].length; b++ ) {
			children[a][b].parentNode.removeChild( children[a][b] );
		}
	}
})();
