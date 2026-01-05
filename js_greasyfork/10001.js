// ==UserScript==
// @name         (mTurk) ProductRnR Query Image
// @version      0.1
// @description  Selects "Related" for all images. Click the image to flag. Left click selects "Unrelated". Right click selects "Related". Middle click selects "Image didn't load".
// @author       Original: Eric Fraze, Query Image Clone: Young Tuga
// @match    https://s3.amazonaws.com/mturk_bulk/hits/*
// @match    https://www.mturkcontent.com/dynamic/hit*
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @namespace https://greasyfork.org/users/11594
// @downloadURL https://update.greasyfork.org/scripts/10001/%28mTurk%29%20ProductRnR%20Query%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/10001/%28mTurk%29%20ProductRnR%20Query%20Image.meta.js
// ==/UserScript==

$(document).ready(function() {
	// Make sure we are on the right HIT
	if ( $("title:contains('Query Image Labeling')").length ) {

		// Select 'Related' as default
		$("input[value='QueryImage_Related']").click();

		// Detect mouse clicks
		$('.imagebox').mouseup(function (evt) {
			var par = $(this).parent();
			if (evt.which === 1) { // left-click
				if (evt.originalEvent.detail === 1) {
					$("input[value='QueryImage_Unrelated']", par).click();
					$("#SubmitButton").focusWithoutScrolling();
				}
			}

			if (evt.which === 2) { // middle-click
				if (evt.originalEvent.detail === 1) {
					$("input[value='NoLoad']", par).click();
					$("#SubmitButton").focusWithoutScrolling();
				}
			}

			if (evt.which === 3) { // right-click
				if (evt.originalEvent.detail === 1) {
					$("input[value='QueryImage_Related']", par).click();
					$("#SubmitButton").focusWithoutScrolling();
				}
			}
		});

		// Disable image link and make a new link under the image.
		$(".imagebox").filter(function(index) {
			var url = $("a", this).attr("href");
			$(this).after("<a href='" + url + "' target='_blank'>Open full image</a>");
			$("a", this).removeAttr("href");
			$("a", this).removeAttr("target");
		});

		// suppress the right-click menu
		$('.imagebox').on('contextmenu', function (evt) {
			evt.preventDefault();
		});

		// Stop scrolling on focus of radio button
		$.fn.focusWithoutScrolling = function(){
		  var x = window.scrollX, y = window.scrollY;
		  this.focus();
		  window.scrollTo(x, y);
		};

		// Stop scrolling on middle mouse press
		$(".imagebox").on("mousedown", function (e) { e.preventDefault(); } );
	}
});