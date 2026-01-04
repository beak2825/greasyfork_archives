// ==UserScript==
// @version        1.1.1
// @name           Youtube Hide Watched
// @description    Hide watched videos on YouTube
// @namespace      https://gist.github.com/xPaw/6324624
// @match          https://www.youtube.com/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/35842/Youtube%20Hide%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/35842/Youtube%20Hide%20Watched.meta.js
// ==/UserScript==

const app = document.querySelector('ytd-app');

function HideVideos(a) {
	/*app.querySelectorAll( 'ytd-thumbnail-overlay-resume-playback-renderer:not([data-hidden="true"])' ).forEach( element =>
	{
		element.dataset.hidden = true;

		while( ( element = element.parentNode ).tagName.toLowerCase() !== 'ytd-item-section-renderer' )
		{
			// Find the container element for this video
		}

		element.hidden = true;
	} );*/
}

function ProcessPage() {
	if (!window.location.pathname.startsWith('/feed/subscriptions')) {
		return;
	}

	console.log(app.querySelector('ytd-section-list-renderer'));

	/*const list = app.querySelector( 'ytd-section-list-renderer' );

	if( list.dataset.hooked )
	{
		return;
	}

	list.dataset.hooked = true;
	list.addEventListener( 'yt-next-continuation-data-updated', HideVideos );

	// TODO: Find an event to fix this
	new MutationObserver( HideVideos ).observe( list, { childList: true, subtree: true } );*/
}

//app.addEventListener( 'yt-navigate-finish', ProcessPage );

ProcessPage();

console.log(window.location.pathname);
console.log(app);