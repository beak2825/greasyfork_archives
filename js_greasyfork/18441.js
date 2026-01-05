// ==UserScript==
// @name        Remove broken Curse JS
// @namespace   Majr
// @include     http://*.gamepedia.com/*
// @version     7
// @run-at      document-start
// @grant       none
// @description Removes any scripts that cause errors, break the site, or cause stuttering
// @downloadURL https://update.greasyfork.org/scripts/18441/Remove%20broken%20Curse%20JS.user.js
// @updateURL https://update.greasyfork.org/scripts/18441/Remove%20broken%20Curse%20JS.meta.js
// ==/UserScript==

var isDebug = location.href.match( /debug=true/ ) && true;
window.addEventListener( 'beforescriptexecute', function( e ) {
	var scriptText = e.target.innerHTML;
	var disallow = scriptText.match( /Analytics|googletag|adgroup|_gaq|_qevents|_comscore|imrworldwide|cc3613|PubMaticGrouped|cdmfactorem|crwdcntrl|zergnet/ );
	if ( !disallow && scriptText.match( /skins\.hydra\.anchor\.apu\.js%7C/ ) ) {
		disallow = true;
		var newScript = document.createElement( 'script' );
		newScript.textContent = scriptText.replace( /skins\.hydra\.anchor\.apu\.js%7C/, '' );
		document.head.insertBefore( newScript, e.target.nextSibling );
		if ( isDebug ) {
			console.info( 'Replaced skins.hydra.anchor.apu', newScript );
		}
	}
	if ( disallow ) {
		e.target.parentNode.removeChild( e.target );
		e.preventDefault();
		if ( isDebug ) {
			console.info( 'Stopped: ', match, e.target );
	  }
	} else {
		if ( isDebug ) {
  		console.log( 'Allowed: ', e.target.innerHTML, e.target );
		}
	}
}, true );