// ==UserScript==
// @name Change Toggl display
// @namespace http://www.jaron.nl/misc/efocus/
// @description Change Toggl timer display: always expand entries; always show durations
// @include https://toggl.com/app/timer
// @version 1.01
// @downloadURL https://update.greasyfork.org/scripts/24487/Change%20Toggl%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/24487/Change%20Toggl%20display.meta.js
// ==/UserScript==   

(function($) {

	var delay = 100;

	var changeDisplay = function() {
		$('.TimeEntriesListGroupedItem__subEntriesCount').addClass('TimeEntriesListGroupedItem__isExpanded');
		$('.ListItem__item').addClass('ListItem__isSubEntry ListItem__isExpanded');
		$('.Duration__times').css('display', 'block');
	};

	var checkStart = function() {
		console.log('len:',$('.TimeEntriesList__list').length, 'delay:', delay);
		if ($('.TimeEntriesList__list').length) {
			changeDisplay();
		} else {
			setTimeout(checkStart, delay);
			delay = delay*1.1;
		}
	};

	checkStart();


})(jQuery);