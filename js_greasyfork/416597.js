// ==UserScript==
// @name          @iknowcyrene chess para o lucas
// @author       Cyrene
// @version      0.1.1
// @description  try to take over the world!
// @include       *://*chess.com/live
// @include       *://*chess.com/events/*
//@include        *https://www.chess.com/*
// @run-at        document-start
// @namespace https://greasyfork.org/users/708002
// @downloadURL https://update.greasyfork.org/scripts/416597/%40iknowcyrene%20chess%20para%20o%20lucas.user.js
// @updateURL https://update.greasyfork.org/scripts/416597/%40iknowcyrene%20chess%20para%20o%20lucas.meta.js
// ==/UserScript==

function hide_stuff() {
	var sheet = window.document.styleSheets[ 0 ];
	sheet.insertRule( "div.new-game-component { display: none; !important }" , sheet.cssRules.length );
    sheet.insertRule( "div.time-black { display: none; !important }" , sheet.cssRules.length );
    sheet.insertRule( "div.time-white { display: none; !important }" , sheet.cssRules.length );
	sheet.insertRule( "div.toaster-component.toaster-alert { visibility: hidden; !important }" , sheet.cssRules.length );
	/*
	for ( var i = 0; i < 100; ++i ) {
		sheet.insertRule( "div#cbChatPanelBody" + i.toString() + " { display: none; !important }" , sheet.cssRules.length );
	}
	*/
}
window.addEventListener ( "load" , hide_stuff );