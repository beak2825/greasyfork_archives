// ==UserScript==
// @name           Youtube Hide Watched / Viewed Videos
// @description    Hides viewed videos from your subscriptions.
// @include        https://www.youtube.com/feed/subscriptions
// @license        MIT
// @version        0.5
// @date           26-09-2016
// @require        http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/59385
// @downloadURL https://update.greasyfork.org/scripts/23524/Youtube%20Hide%20Watched%20%20Viewed%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/23524/Youtube%20Hide%20Watched%20%20Viewed%20Videos.meta.js
// ==/UserScript==


$(function () {
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
			$("span.resume-playback-progress-bar").each(function() {
	      $(this).closest(".yt-shelf-grid-item").hide("1000");
	    });
	}
};

function showWatched() {
  $("span.resume-playback-progress-bar").each(function() {
    $(this).closest(".yt-shelf-grid-item").show("200");
	});
}
