// ==UserScript==
// @name       MTurk YChart HIT Helper
// @namespace  http://ericfraze.com
// @version    0.7.1
// @description  Opens the link on a Ychart hit
// @include    https://www.mturk.com/mturk/accept*
// @include    https://www.mturk.com/mturk/submit*
// @include    https://www.mturk.com/mturk/continue*
// @include    https://www.mturk.com/mturk/previewandaccept*
// @copyright  2014+, Eric Fraze
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/11307/MTurk%20YChart%20HIT%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/11307/MTurk%20YChart%20HIT%20Helper.meta.js
// ==/UserScript==

$(document).ready(function() {
	if ($(":contains('YCharts')").length) {
	    // Make sure the hit has been accepted
	    if ($("input[name='/submit']").length>0) {
	        //Open the link that you always have to click in a new tab
	        $('a:contains("Click here to go to the ")').filter(function(index)
	        {
	            window.open($(this).prop('href'), 'YChart', 'toolbar=1,location=1,menubar=1,scrollbars=1');
	            return false;
	        });
        
	        //Check Yes radio button
	        $("#Answer_3").prop("checked", true)

	        //Select text box
	        $("#Answer_1_FreeText").select();

			$("span.answer:contains('The page does not exist')").wrap("<label for='Answer_2'></label>");
	    }
	}
});