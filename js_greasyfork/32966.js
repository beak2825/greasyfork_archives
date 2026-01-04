// ==UserScript==
// @name         Remove from watchlist when rated
// @namespace    hydric
// @version      1.0.1
// @description  Removes rated movies from IMDB watchlist page
// @author       hydric
// @match        http://www.imdb.com/*
// @grant        none
// @run-at 	     document-idle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/32966/Remove%20from%20watchlist%20when%20rated.user.js
// @updateURL https://update.greasyfork.org/scripts/32966/Remove%20from%20watchlist%20when%20rated.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var interval = setTimeout(function() {
		if (window.location.href.indexOf("title") > -1){
			if ($('.star-rating-value').length){
				$('div[title="Click to remove from watchlist"]').click();
			}
			clearInterval(interval);
		}
		if (window.location.href.indexOf("watchlist") > -1){
				var varArray = [];
				$('.star-rating-value').each(function( index ) {
					if($(this).text()  > 0){
						var datareactid = $(this).attr('data-reactid');
						var regexp = /\$.*\$(.*?)\./ig;
						var match = regexp.exec(datareactid);
						var movieidentifier = match[1];
						varArray.push(movieidentifier);
					}
				});
				var uniqueset = new Set(varArray);
				function unwatch(value1, value2, set) {
					$('div[title="Click to remove from watchlist"][data-reactid*="'+value1+'"]').click();
				};
				uniqueset.forEach(unwatch);
		}
        clearInterval(interval);
    }, 5000);
})();