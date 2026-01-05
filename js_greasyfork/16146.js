// ==UserScript==
// @name         [Ned] Buckets Interval Highlighter [Beta]
// @namespace    localhost
// @version      2.1
// @description  Buckets Interval Highlighter
// @author       Ned (Ned@Autoloop.com)
// @include      *autoloop.us/DMS/App/DealershipSettings/ServicePlans/Dealership/OpCodeBuckets.aspx*
// @grant        none
// @icon         
// @downloadURL https://update.greasyfork.org/scripts/16146/%5BNed%5D%20Buckets%20Interval%20Highlighter%20%5BBeta%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/16146/%5BNed%5D%20Buckets%20Interval%20Highlighter%20%5BBeta%5D.meta.js
// ==/UserScript==

//Add Button
$('#divMileageOpCodesButtons').prepend('<a id="colorInt" class="float_left btn-default"> Highlight Intervals</a>');

$('#colorInt').live("click", function () {
	$("[id^=opcode_count_]").each(function () { //Select all Starting with 'opcode_count_'
		if ($(this).text() > 0)
			$(this).css('background-color', 'yellow');
		if (($(this).text() < 1))
			$(this).css('background-color', 'transparent');
	});
});