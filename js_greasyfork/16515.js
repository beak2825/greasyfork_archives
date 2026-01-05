// ==UserScript==
// @name			Facepunch quick post scroll
// @version			2.3
// @description		Makes clicking on a post link in a quote immediately scroll to the post if it's on the same page, rather than reloading the page, and updates the URL so the post can be easily linked to. Shows a different cursor to indicate when the page will be scrolled.
// @match			https://forum.facepunch.com/*
// @namespace		https://greasyfork.org/users/28313
// @downloadURL https://update.greasyfork.org/scripts/16515/Facepunch%20quick%20post%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/16515/Facepunch%20quick%20post%20scroll.meta.js
// ==/UserScript==

( function() {
	'use strict';

	var posts;
	var findPost = function( e ) {
		if ( !e.target || !e.target.matches( 'postquote > div > .head > a' ) ) {
			return;
		}

		posts = posts || document.getElementsByClassName( 'postrender' );

		var postFragment = e.target.href.match( /\/f\/p\/(\d+)\/$/ );
		if ( !postFragment ) {
			return;
		}

		var postId = postFragment[1];
		var post;
		for ( var postRender of posts ) {
			if ( postId === postRender.__vue__.$options.propsData.postid ) {
				post = postRender.closest( '.postblock' );
				break;
			}
		}

		if ( !post ) {
			return;
		}

		// Indicate that the link will scroll the page rather than load a different one
		e.target.style.cursor = 'alias';

		// Only do the scroll when clicking
		if ( e.type === 'click' ) {
			history.pushState( {}, '', '#' + post.id );
			post.scrollIntoView( { behavior: 'smooth' } );

			e.preventDefault();
		}
	};

	var threadSections = document.querySelectorAll( '.threadviewsection, .threadreplysection' );
	if ( !threadSections.length ) {
		return;
	}

	// Bind event on hover to add styling, and on click to do the scroll
	for ( var section of threadSections ) {
		section.addEventListener( 'mouseover', findPost, false );
		section.addEventListener( 'click', findPost, false );
	}

}() );
