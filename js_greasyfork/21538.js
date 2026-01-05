// ==UserScript==
// @name        FA Auto-Select Search Ratings
// @namespace    FurAffinity
// @version      1.0
// @description  Selects all the checkboxes automatically for FurAffinity's search engine.
// @author       JaysonHusky
// @match        https://www.furaffinity.net/search/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @require      https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/21538/FA%20Auto-Select%20Search%20Ratings.user.js
// @updateURL https://update.greasyfork.org/scripts/21538/FA%20Auto-Select%20Search%20Ratings.meta.js
// ==/UserScript==

(function() {
    'use strict';
	// Delay the script until the page has fully loaded!
	$(document).ready(function(){ 
	
	// Find ALL the checkboxes and select them (It can be narrowed down to just the ratings if required)
	MarkAllBoxes([].slice.call(document.querySelectorAll('input[type="checkbox"][name*="rating"]')));

	// Set Mutuation Handler for them
	setMutationHandler(document, 'input[type="checkbox"]', MarkAllBoxes);

	// Function for Mutuation
	function MarkAllBoxes(nodes) {
		nodes.forEach(function(n){n.checked = true;});
	}
   
	});
})();