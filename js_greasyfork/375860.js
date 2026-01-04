// ==UserScript==
// @name          Lichess Hide Ratings
// @namespace     http://userstyles.org
// @description   Hides Ratings During Matches
// @author        636597
// @include       *://*lichess.org/*
// @run-at        document-start
// @version       0.1
// @downloadURL https://update.greasyfork.org/scripts/375860/Lichess%20Hide%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/375860/Lichess%20Hide%20Ratings.meta.js
// ==/UserScript==

function hide_ratings() {
	var sheet = window.document.styleSheets[ 0 ];
	sheet.insertRule( "rating , .players { display: none; }" , sheet.cssRules.length );
}

window.addEventListener ( "load" , hide_ratings );