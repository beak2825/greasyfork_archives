// ==UserScript==
// @name        Add Hidden Stats to Dashboard (TheFrostlixen)
// @version     1.05
// @description Adds submission, return, and abandonment rates to the dashboard. Fixed source.
// @author      TheFrostlixen
// @namespace   https://greasyfork.org/en/users/34060
// @include     https://www.mturk.com/mturk/dashboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log

// @downloadURL https://update.greasyfork.org/scripts/19171/Add%20Hidden%20Stats%20to%20Dashboard%20%28TheFrostlixen%29.user.js
// @updateURL https://update.greasyfork.org/scripts/19171/Add%20Hidden%20Stats%20to%20Dashboard%20%28TheFrostlixen%29.meta.js
// ==/UserScript==
var SUBMIT_ID  = '00000000000000000000';
var RETURN_ID  = '000000000000000000E0';
var ABANDON_ID = '00000000000000000070';

$(document).ready(function()
{
	function RequestAjax( ID )
	{
		$.ajax(
		{
			url: 'https://www.mturk.com/mturk/requestqualification?qualificationId=' + ID,
			type: 'GET',
			context: this,
			success: function(data) {
				var $src = $(data);
				var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
				if (maxpagerate.length === 0)
				{
					var submit_rate = $($src.find('#qualification_score')).next().text();
					$('#'+ID).text( submit_rate + "%" );
				}
			},
			error: function(xhr, status, error)
			{
				alert('mmmturkeybacon Add Hidden Stats to Dashboard: timeout error');
			},
			timeout: 3000
		});
	}

	// Build table
	var $submitted_table = $('th[id="hit_totals.desc_dolumn_header.tooltop.1"]').parents('td[width="50%"]');
	$submitted_table.before('<td width="50%"><table class="metrics-table" width="100%"><tr class="metrics-table-header-row"><th id = "hit_totals.desc_dolumn_header.tooltop.2" class="metrics-table-first-header">HITs You Have Accepted</th><th id="user_metrics.rate_column_header.tooltip.2">Rate</th><tr class="odd"><td class="metrics-table-first-value">HITs Accepted</td><td>&mdash;</td></tr><tr class="even"><td class="metrics-table-first-value">... Submitted</td><td id="'+SUBMIT_ID+'">___%</td></tr><tr class="odd"><td class="metrics-table-first-value">... Returned</td><td id="'+RETURN_ID+'">___%</td></tr><tr class="even"><td class="metrics-table-first-value">... Abandoned</td><td id="'+ABANDON_ID+'">___%</td></tr></table></td>');

	// Set the stats asynchronously
	RequestAjax( SUBMIT_ID );
	RequestAjax( RETURN_ID );
	RequestAjax( ABANDON_ID );
});