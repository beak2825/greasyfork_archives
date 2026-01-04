// ==UserScript==
// @name         Easy change speed Youtube
// @namespace    http://tampermonkey.net/
// @icon         https://raw.github.com/reek/anti-adblock-killer/master/anti-adblock-killer-icon.png
// @version      0.1
// @description  try to take over the world!
// @author       HuuKhanh
// @match        https://www.youtube.com/
// @grant        none
// @include http://*/*
// @include https://*/*
// @downloadURL https://update.greasyfork.org/scripts/375482/Easy%20change%20speed%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/375482/Easy%20change%20speed%20Youtube.meta.js
// ==/UserScript==

/*
- Enter rate to search bar then press '`' to change raterate
*/
(function() {
    'use strict';

    document.getElementsByName('search_query')[0].addEventListener("keypress", function(event) {
	var x = event.which || event.keyCode;
	if(x == 96) {
		var rate = document.getElementsByName('search_query')[0].value;
        document.getElementsByTagName('video')[0].playbackRate = rate;
		console.log('changed');
	}
}) ;
})();