// ==UserScript==
// @name			xerotic's Search Countdown
// @namespace		xerotic/xscd
// @description		Counts down the time left until you can search again. - Updated by Dr Steve Brule
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @include			*hackforums.net/search.php*
// @version			1.0
// @downloadURL https://update.greasyfork.org/scripts/25220/xerotic%27s%20Search%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/25220/xerotic%27s%20Search%20Countdown.meta.js
// ==/UserScript==

function timeSearch() {
	var num = parseInt($('#xerocount').html());
	switch(num) {
		case 0:
			$('#xerocount').parent().html("Press F5 or reload the page to search.");
			break;
		default:
			$('#xerocount').html(num - 1);
			setTimeout(function() { timeSearch(); },1000);
	}
}

$('.trow1').each(function(i) {
	if($(this).html().indexOf('Sorry, but you can only perform one search every 25 seconds. Please wait another') != -1) {
		$(this).html($(this).html().replace(/another (\d{1,2}) seconds/, "another <span id='xerocount'>$1</span> seconds"));
		setTimeout(function() { timeSearch(); },1000);
	}
});
