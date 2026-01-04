// ==UserScript==
// @name         Sleeper.com - FFL - Output Weekly Median.
// @description  Add week Median to league screen on Sleeper.com.
// @version      1.0.1
// @namespace    http://jbout.in/
// @author       Jeremy 'HLVE'
// @match        *://sleeper.com/leagues/*/*
// @require      https://code.jquery.com/jquery-1.9.1.min.js
// @grant        GM_setValue
// @grant		  GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512999/Sleepercom%20-%20FFL%20-%20Output%20Weekly%20Median.user.js
// @updateURL https://update.greasyfork.org/scripts/512999/Sleepercom%20-%20FFL%20-%20Output%20Weekly%20Median.meta.js
// ==/UserScript==

$(window).on("load popstate", function (event) {
	tabIDs();
	if (window.location.pathname.split('/')[3].indexOf("league") != -1) {
		var medianValue = calculateMedian();
	}

	$(document).on('click touchend', '#tabLeague', function () {
		setTimeout(function () {
			var medianValue = calculateMedian();
		}, 150);
	});
});

function tabIDs() {
  const tabEl = $("div.center-tab-selector > div.item-tab"),
		  matchupTab = $("div.center-tab-selector > div.item-tab:contains('MATCHUP')"),
  		  teamTab = $("div.center-tab-selector > div.item-tab:contains('TEAM')"),
  		  leagueTab = $("div.center-tab-selector > div.item-tab:contains('LEAGUE')"),
  		  playersTab = $("div.center-tab-selector > div.item-tab:contains('PLAYERS')"),
  		  trendTab = $("div.center-tab-selector > div.item-tab:contains('TREND')"),
  		  tradeTab = $("div.center-tab-selector > div.item-tab:contains('TRADES')"),
  		  scoreTab = $("div.center-tab-selector > div.item-tab:contains('SCORES')");

  setTimeout(function () {
	   $(matchupTab).attr('id', 'tabMatchup');
		$(teamTab).attr('id', 'tabTeam');
		$(leagueTab).attr('id', 'tabLeague');
		$(playersTab).attr('id', 'tabPlayers');
		$(trendTab).attr('id', 'tabTrending');
		$(tradeTab).attr('id', 'tabTrades');
		$(scoreTab).attr('id', 'tabScores');
	}, 35);
}

function calculateMedian() {
	var matchupTitleContainer = $(".league-tab-container .title").first(),
		 scoreContainer = $("div.league-matchups div.roster-score-and-projection-matchup div.score"),
		 numbers = [];

	$(scoreContainer).each(function () {
		var value = parseFloat($(this).text());
		if (!isNaN(value)) {
			numbers.push(value);
		}
	});

	// Sort the scores in ascending order
	numbers.sort(function (a, b) {
		return a - b;
	});

	// Calculate the median
	var median;
	var len = numbers.length;
	if (len === 0) {
		median = 0; // If no numbers found, median is 0
	} else if (len % 2 === 1) {
		median = numbers[Math.floor(len / 2)];
	} else {
		var mid1 = numbers[len / 2 - 1];
		var mid2 = numbers[len / 2];
		median = (mid1 + mid2) / 2;
	}

	var calcMedian = Math.ceil(median * 100) / 100;

	// Round up to the next full decimal place.
	if (!$(".league-panel-header .post-draft-league-header .name").text().includes('Guillotine')) {
		if (!$("#weeklyMedian").length) {
			$(matchupTitleContainer).append(' <span id="weeklyMedian">(<b>Weekly Median</b>: ' + calcMedian + ')</span>');
		};
	}

}