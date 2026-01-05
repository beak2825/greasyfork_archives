// ==UserScript==
// @name           Youtube Hide Watched
// @namespace      https://github.com/ToostInc/userscripts
// @description    Hides viewed videos from your subscriptions.
// @include        https://www.youtube.com/feed/subscriptions
// @author         Joost Bremmer < toost dot b at gmail dot com >
// @copyright      2014, Joost Bremmer
// @license        MIT
// @version        1.1.3
// @date           13-06-2015
// @require        http://code.jquery.com/jquery-latest.min.js
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/3902/Youtube%20Hide%20Watched.user.js
// @updateURL https://update.greasyfork.org/scripts/3902/Youtube%20Hide%20Watched.meta.js
// ==/UserScript==


// The MIT License
//
// Copyright (c) 2014 Joost Bremmer
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files
// (the "Software"), to deal in the Software without restriction,
// including without limitation the rights to use, copy, modify, merge,
// publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
// IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
// CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
// TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

$(document).ready (function () {
  //Add mutation observer, checks for changes in DOM
  if (MutationObserver) {
	  var myObserver  = new MutationObserver(hideWatched);
	}
	else {
		var myObserver = new WebKitMutationObserver(hideWatched);
	}
  myObserver.observe(document, { childList : true, subtree : true });
	hideWatched();

	// Add checkbox
	var checker = '<li>\n'+
	              '\t<label id="checker-container">\n'+
				  '\t\t<input type="checkbox" id="hide-videos" checked="" />'+
				  '\t\tHide watched videos'+
				  '\t</label>\n'+
				  '</li>';
	$("#appbar-nav .appbar-nav-menu").prepend(checker);
	$("#checker-container").css({
	                              'color': "#666",
								  "vertical-align" : "middle",
								  "text-align" : "center"
								});
	//checkbox event
	$("#hide-videos").change(function() {
		if ( $(this).is(":not(:checked)") ) {
			showWatched();
		}

		else {
			hideWatched();
		};

	});

	//BONUS: always enable load more button.
	$("button.load-more-button").removeProp("disabled");

	hideWatched();


});


function hideWatched () {

	if ( $("#hide-videos").is(":checked") ) {
			$("div.watched-badge").each(function() {
	      $(this).closest("ol.item-section").hide("200");

	    });

	}
};

function showWatched() {
		  $("div.watched-badge").each(function() {
			$(this).closest("ol.item-section").show("300");

	});
}
