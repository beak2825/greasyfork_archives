// ==UserScript==
// @name         Comrade Mao Helper
// @namespace    GF-Fear3d
// @version      0.04
// @description  Allows you to use the left and right arrow keys to navigate chapters at comrademao.com, and enables WASD scrolling and navigation
// @author       Fear3d
// @match        https://comrademao.com/mtl/*/*/
// @match        https://comrademao.com/mtl/*/*/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/416935/Comrade%20Mao%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/416935/Comrade%20Mao%20Helper.meta.js
// ==/UserScript==

(function() {
 	'use strict';

 	var nextUrl = "";
 	var prevUrl = "";
 	var doNext = false;
 	var doPrev = false;

 	// Find URLs for Next and Prev
 	$(document).ready(function() {
		var nextPage = $("nav.navigation.post-navigation > div.nav-links > div.nav-next > a");
    	var prevPage = $("nav.navigation.post-navigation > div.nav-links > div.nav-previous > a");

    	if (nextPage.length) {
    		nextUrl = nextPage.attr("href");
    		doNext = true;
    	}

        if (prevPage.length) {
            prevUrl = prevPage.attr("href");
            doPrev = true;
        }
	});

 	// Handle arrow key events
	$(document).ready(function() {
 		document.onkeydown = function(evt) {
 			switch (evt.keyCode) {
 				case 37: // Left Arrow
 					if (doPrev)
 						window.location = prevUrl;
 					break;
 				case 39: // Right Arrow
 					if (doNext)
 						window.location = nextUrl;
 					break;
 				case 65: // a
 					if (doPrev)
 						window.location = prevUrl;
 					break;
 				case 68: // d
 					if (doNext && !evt.ctrlKey)
 						window.location = nextUrl;
 					break;
 				case 87: // w
 					window.scrollBy({top: -50, behavior: 'auto'});
 					break;
 				case 83: // s
 					window.scrollBy({top: 50, behavior: 'auto'});
 					break;
 			}
 		};
 	});
})();