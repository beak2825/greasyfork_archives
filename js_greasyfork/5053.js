// ==UserScript==
// @name       HIT Return & Accept
// @namespace  http://ericfraze.com
// @version    0.2
// @description  This userscript returns your current mTurk then accepts a new one. It also checks the "accept next hit" box.
// @include    https://www.mturk.com/mturk/accept*
// @include    https://www.mturk.com/mturk/submit*
// @include    https://www.mturk.com/mturk/previewandaccept*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @copyright  2014+, Eric Fraze
// @downloadURL https://update.greasyfork.org/scripts/5053/HIT%20Return%20%20Accept.user.js
// @updateURL https://update.greasyfork.org/scripts/5053/HIT%20Return%20%20Accept.meta.js
// ==/UserScript==

//Wait for page to load fully
$(document).ready(function() {
	// Make sure the hit has been accepted
	if ( ( $("a[id*='pipeline.submit.iframes.tooltip']").length>0 ) || ( $("input[name='/submit']").length>0 ) ) {
		// Make sure the return button exits
		if ( $("a[href*='mturk/return']").length>0 ) {
			// Select each return button
			$("a[href*='mturk/return']").each(function() {
				// Add custom text next to return button text
				$(this).parents(':eq(2)').children(":first-child").append('<td><img src="/media/spacer.gif" width="20" height="8" border="0"></td>');
				$(this).parents(':eq(2)').children(":first-child").append('<td align="center" nowrap="">Return & Accept?</td>');
				// Add custom button next to return button
				$(this).parents(':eq(1)').append('<td><img src="/media/spacer.gif" width="20" height="1" border="0"></td>');
				$(this).parents(':eq(1)').append('<td><a id="returnAccept" href="#"><img src="/media/skip_hit.gif" alt="" border="0" width="68" height="22"></a></td>');
			});
		}

		// Check the auto accept box
		$("input[name='autoAcceptEnabled']").prop('checked', true);

		// If custom button is clicked 
		$("#returnAccept").click(function() {
			// Get URL parameters
			var url = window.location.href.split("?");

			// Return the HIT with Ajax then accept new hit
			$.ajax({
				// Return the hit
				url: $("a[href*='mturk/return']").attr("href"),
				context: document.body
			}).done(function() {
				// Accept new hit
				window.location.replace("/mturk/previewandaccept?" + url[1]) + "&";
			});
		});
	}
});