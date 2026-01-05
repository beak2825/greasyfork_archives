// ==UserScript==
// @name         Mark scheduled games as favorites in Games Done Quick
// @description  With this script you can click to highlight your favorite games in the GDQ schedule list.
// @namespace    http://gamesdonequick.com/
// @version      0.4
// @author       ciscoheat
// @match        https://gamesdonequick.com/schedule*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21047/Mark%20scheduled%20games%20as%20favorites%20in%20Games%20Done%20Quick.user.js
// @updateURL https://update.greasyfork.org/scripts/21047/Mark%20scheduled%20games%20as%20favorites%20in%20Games%20Done%20Quick.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    var selected = localStorage.favorites ? JSON.parse(localStorage.favorites) : [];
	var currentYear = new Date().getFullYear();

	var previousDate = new Date(currentYear + '-01-01');
	var prevRows = null;
	var prevGame = null;
	var passedNow = false;

    $("#runTable .start-time").closest('tr').each(function(_, tr) {
        var secondRow = $(tr).next();
        var game = $(tr).find('.start-time + td').text();
        var rows = $(tr).add(secondRow);
        var last = [];

		var day = $(tr).prevAll('.day-split').first().text();
		var time = $(tr).find('.start-time').text();
		var dateStr = day + " " + time;

		var dateParse = /^\w+,\s*(\w+)\s+(\d+)[^\d]+(.*)$/;

		var replacer = function(_, month, day, time) {
			if(month == "January") month = 1;
			if(month == "February") month = 2;
			if(month == "March") month = 3;
			if(month == "April") month = 4;
			if(month == "May") month = 5;
			if(month == "June") month = 6;
			if(month == "July") month = 7;
			if(month == "August") month = 8;
			if(month == "September") month = 9;
			if(month == "October") month = 10;
			if(month == "November") month = 11;
			if(month == "December") month = 12;

			var str = '/' + month + '/' + day + ' ' + time;
			var check = new Date(currentYear + str);

			// Check for year wrap of date
			if(check < previousDate) {
				currentYear++;
				previousDate = new Date(currentYear + str);
			} else {
				previousDate = check;
			}

			return currentYear + str;
		}

		var gameTime = new Date(dateStr.replace(dateParse, replacer));

		// Set current game if we passed actual time.
		if(prevRows && gameTime >= Date.now() && passedNow == false) {
			passedNow = true;
			var resetCol = selected.indexOf(prevGame) >= 0 ? '#c0f9c2' : 'white';
			prevRows.css('background-color', resetCol).css('font-weight', 'bold');

			var scrollTo = prevRows[0];
			setTimeout(function() {
				if(scrollTo.scrollIntoView) {
					scrollTo.scrollIntoView({
						behavior: 'auto',
						block: 'center',
						inline: 'center'
					});
				}
			}, 500);
		}

		if(selected.indexOf(game) >= 0) {
			rows.css('background-color', '#c0f9c2');
		}
		else if(gameTime < Date.now()) {
			rows.css('background-color', '#e4e4e4');
		}

		prevRows = rows;
		prevGame = game;

		/////////////////////////////////////////////////////////////

        rows.on('mousedown', function(e) {
			if(e.button != 0) return;
            last = [e.pageX, e.pageY];
        });

        rows.on('mouseup', function(e) {
			if(e.button != 0) return;
            if(Math.abs(e.pageX - last[0]) > 2 || Math.abs(e.pageY - last[1]) > 2) return;

            var pos = selected.indexOf(game);

            if(pos < 0) {
                selected.push(game);
                rows.css('background-color', '#c0f9c2');
            } else {
                selected.splice(pos, 1);
                rows.css('background-color', '');
            }

            localStorage.favorites = JSON.stringify(selected);
        });
    });
})(jQuery);