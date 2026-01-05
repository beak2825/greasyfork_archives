// ==UserScript==
// @name         Games Done Quick schedule tracker
// @namespace    https://75thtrombone.com/
// @version      0.1.1
// @description  Show current Games Done Quick event
// @author       You
// @match        https://gamesdonequick.com/schedule
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26501/Games%20Done%20Quick%20schedule%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/26501/Games%20Done%20Quick%20schedule%20tracker.meta.js
// ==/UserScript==

(function($) {
	'use strict';

	var agendaSelector = 'tr:not(.second-row):not(.day-split)';

	$.fn.processAgenda = function() {
		var now = new Date();

		function grayOut($row) {
			$row.children().css('background-color', '#f2f2f2').css('color', '#999999');
		}

		return this.each(function() {
			var start = $(this).data('start');
			var end = $(this).data('end');

			if(!end) {
				return;
			}

			$(this).removeClass('current');

			if(now < start) {
				return;
			}

			if(now > end) {
				grayOut($(this));
				grayOut($(this).next());
				return;
			}

			$(this).addClass('current');

			var fractionComplete = (now - start) / (end - start);

			var top = $(this).offset().top;
			var bottom = top + $(this).height() + $(this).next().height();

			$('.progress-line').css('top', Math.floor(((bottom - top) * fractionComplete) + top));
		});
	};


	$(document).ready(function() {
		var year = $('h1').text().match(/[0-9]{4}/)[0];

		(function() {
			$('body').prepend('<div class="progress-line"></div>');
			$('.progress-line').css({
				width: '100%',
				height: '1px',
				'background-color': 'rgba(242, 24, 71, 0.5)',
				'box-shadow': '0px 0px 3px 1px rgba(242, 24, 71, 0.4)',
				position: 'absolute'
			});

			function getDate($row) {
				if(!$row.length) {
					return;
				}

				var replacements = {
					Sunday: 'Sun',
					Monday: 'Mon',
					Tuesday: 'Tue',
					Wednesday: 'Wed',
					Thursday: 'Thu',
					Friday: 'Fri',
					Saturday: 'Sat',
					January: 'Jan',
					February: 'Feb',
					March: 'Mar',
					April: 'Apr',
					June: 'Jun',
					July: 'Jul',
					August: 'Aug',
					September: 'Sep',
					October: 'Oct',
					November: 'Nov',
					December: 'Dec'
				}

				var dateString = $row.prevAll('.day-split').filter(':first').children('td').text();

				for(var oldString in replacements) {
					dateString = dateString.replace(oldString, replacements[oldString]);
				}

				dateString = dateString
					.replace('st', '')
					.replace('nd', '')
					.replace('rd', '')
					.replace('th', '')
					.replace(',', '')
				;

				return dateString;
			}

			function getTime($row) {
				if(!$row.length) {
					return;
				}

				var timeString = $row.children('td.start-time').text();
				var meridiem = timeString.match(/[AP]M/)[0];
				var timeParts = timeString.match(/1?[0-9]:[0-5][0-9]/)[0].split(':');


				if('PM' === meridiem && timeParts[0] !== '12') {
					timeParts[0] = String(Number(timeParts[0]) + 12);
				}

				if('AM' === meridiem && timeParts[0] === '12') {
					timeParts[0] = '0';
				}

				if(1 === timeParts[0].length) {
					timeParts[0] = '0' + timeParts[0];
				}

				return timeParts[0] + ':' + timeParts[1];
			}

			function getTimestamp(date, time) {
				return new Date(date + ' ' + year + ' ' + time);
			}

			$(agendaSelector).each(function() {
				var $row = $(this);
				var $nextRow = $(this).nextAll(agendaSelector).filter(':first');
				$row.data('start', getTimestamp(getDate($row), getTime($row)));
				if($nextRow.length) {
					$row.data('end', getTimestamp(getDate($nextRow), getTime($nextRow)));
				}
			});
		})();

		$(agendaSelector).processAgenda();

		window.setTimeout(function() {
			$('body').scrollTop($('tr.current').offset().top);
		}, 500);

		window.setInterval(function() {
			$('tr.current').processAgenda()
				.nextAll(agendaSelector).filter(':first').processAgenda()
			;
		}, 60000);
	});

})(jQuery);
