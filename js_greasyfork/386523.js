// ==UserScript==
// @name     MLB.TV Full Browser
// @description Removes the header/footer for MLB.TV games in-browser so the video takes up the full browser.
// @version  1
// @grant    none
// @include		 https://www.mlb.com/tv/*
// @namespace https://greasyfork.org/users/310750
// @downloadURL https://update.greasyfork.org/scripts/386523/MLBTV%20Full%20Browser.user.js
// @updateURL https://update.greasyfork.org/scripts/386523/MLBTV%20Full%20Browser.meta.js
// ==/UserScript==

setTimeout(function() {
	document.querySelector('.mlbtv-container--header').remove();	
	document.querySelector('.mlbtv-container--footer').remove();
}, 1000);
