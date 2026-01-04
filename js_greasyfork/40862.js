// ==UserScript==
// @name		RES Twitter Fix
// @namespace	com.res-twitter-fix
// @description	Fixes RES Twitter expandos in Firefox
// @match		https://*.reddit.com/*
// @run-at		document-end
// @grant		none
// @version		3.2
// @downloadURL https://update.greasyfork.org/scripts/40862/RES%20Twitter%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/40862/RES%20Twitter%20Fix.meta.js
// ==/UserScript==

"use strict"

function injectTwitterScript()
{
	// inject twitter script to convert blockquotes into pretty twitter displays
	const script = document.createElement( 'script' )
	script.src = 'https://platform.twitter.com/widgets.js'
	document.body.appendChild( script )
}

function fixExpandos()
{
	// look for un-rendered twitter expandos and proceed if any are found
	console.log( 'looking for expandos' )
	const expandos = document.querySelectorAll( '.twitter-tweet:not(.twitter-tweet-rendered' )
	if ( expandos.length > 0 )
	{
		console.log( 'fixing expandos!' )
		injectTwitterScript()
	}
}

function onClick( e )
{
	// check if we've clicked an expando button
	if ( e.target.className.includes( 'expando-button' ) )
	{
		// fix expandos on click
		fixExpandos()

		// also attempt to fix auto-expanded expandos...
		// perhaps this is not the most reliable way to do it, as there's
		// no way to know exactly how long it'll take RES to auto-expand.
		// regardless, injecting the script twice does no harm
		setTimeout( () => { fixExpandos() }, 1000 )
	}
}
document.addEventListener( 'click', onClick, false )
