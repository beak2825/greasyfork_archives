// ==UserScript==
// @name          Chess Com Actual Focus Mode
// @namespace     http://userstyles.org
// @description   Hides Useless Bull Shit from Chess.com UI in 'focus' Mode
// @author        707433
// @include       *://*chess.com/live
// @include       *://*chess.com/events/*
// @run-at        document-start
// @version       0.3
// @downloadURL https://update.greasyfork.org/scripts/388252/Chess%20Com%20Actual%20Focus%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/388252/Chess%20Com%20Actual%20Focus%20Mode.meta.js
// ==/UserScript==

function hide_stuff() {
	var sheet = window.document.styleSheets[ 0 ];
	sheet.insertRule( "div.new-game-component { display: none; !important }" , sheet.cssRules.length );
	sheet.insertRule( "span.focus-mode-icon-badge { display: none; !important }" , sheet.cssRules.length );
	sheet.insertRule( "div[data-clock] { visibility: hidden; !important }" , sheet.cssRules.length );
	sheet.insertRule( "img.user-avatar-img { visibility: hidden; !important }" , sheet.cssRules.length );
	sheet.insertRule( "div.cbChatMessage { visibility: hidden; !important }" , sheet.cssRules.length );
	sheet.insertRule( "a.placeholder-ad-link { visibility: hidden; !important }" , sheet.cssRules.length );
	sheet.insertRule( "span.icon-font-chess.minimize.focus-mode-icon-icon { visibility: hidden; !important }" , sheet.cssRules.length );
	sheet.insertRule( "div.toaster-component.toaster-alert { visibility: hidden; !important }" , sheet.cssRules.length );
	/*
	for ( var i = 0; i < 100; ++i ) {
		sheet.insertRule( "div#cbChatPanelBody" + i.toString() + " { display: none; !important }" , sheet.cssRules.length );
	}
	*/
}
window.addEventListener ( "load" , hide_stuff );