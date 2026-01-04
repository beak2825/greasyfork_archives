// ==UserScript==
// @name         TMVN League Result
// @version      4
// @description  Trophymanager: get match's infos like possession, average rate, attendance, scorer... Include last round and next round (50 min before match).
// @namespace    https://trophymanager.com
// @include      https://trophymanager.com/league*
// @downloadURL https://update.greasyfork.org/scripts/413193/TMVN%20League%20Result.user.js
// @updateURL https://update.greasyfork.org/scripts/413193/TMVN%20League%20Result.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const lastRound = 'last_round_table';
	const nextRound = 'next_round_table';

	var clubMap = new Map();
	var rankOrder = 0;
	$('#overall_table td').each(function () {
		var clubId = $(this).children('a').attr('club_link');
		if (clubId) {
			clubMap.set(clubId, ++rankOrder);
		}
	});

	getMatchInfo(nextRound);
	getMatchInfo(lastRound);

	function parseMatchIds(tableId) {
		var matchIds = [];
		$('#' + tableId + ' td').each(function () {
			var hrefVal = $(this).children('a').attr('href');
			if (hrefVal) {
				var matchID = hrefVal.substr(hrefVal.lastIndexOf('matches/') + 8, hrefVal.length - 10);
				matchIds.push(matchID);
			}
		});
		return matchIds;
	}

	function getGoalsReport(report) {
		var goalsReport = [];
		Object.keys(report).forEach(function (key, index) {
			var minuteArr = report[key];
			for (var i = 0; i < minuteArr.length; i++) {
				var paramArr = minuteArr[i].parameters;
				if (paramArr) {
					for (var j = 0; j < paramArr.length; j++) {
						var paramObj = paramArr[j];
						if (paramObj.goal) {
							goalsReport.push({
								minute: key,
								playerId: paramObj.goal.player
							});
						}
					}
				}
			}
		});
		return goalsReport;
	}

	function getMatchInfo(tableId) {
		var matchIds = parseMatchIds(tableId);
		var scoreArr = [];
		matchIds.forEach(function (matchId) {
			var xhr = new XMLHttpRequest();
			var url = 'https://trophymanager.com/ajax/match.ajax.php?id=' + matchId;

			xhr.open('GET', url, true);
			xhr.send();
			xhr.onreadystatechange = function () {
				if (this.readyState == 4 && this.status == 200) {
					var data = JSON.parse(this.responseText);

					var report = data.report;
					if (Object.keys(report).length <= 3) {
						return; //because don't have datas of match
					}

					var matchData = data.match_data;
					var attendance,
					possession;
					attendance = matchData.attendance;
					if (attendance !== "") {
						attendance = '<span style="color:Orange;">Attendance: </span>' + attendance.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
					}
					possession = '<span style="color:Orange;">Possession: </span>' + matchData.possession.home + " - " + matchData.possession.away;

					var clubData = data.club;

					/* comment for user request
					var homeForm = "",
					awayForm = "";
					clubData.home.form.reverse();
					clubData.away.form.reverse();

					var homeFormCount = 0;
					while (homeFormCount < 5 && homeFormCount < clubData.home.form.length) {
					homeForm += clubData.home.form[homeFormCount].result;
					homeFormCount++;
					}
					if (homeForm !== "") {
					homeForm = homeForm.split("").reverse().join("");
					}

					var awayFormCount = 0;
					while (awayFormCount < 5 && awayFormCount < clubData.away.form.length) {
					awayForm += clubData.away.form[awayFormCount].result;
					awayFormCount++;
					}
					if (awayForm !== "") {
					awayForm = awayForm.split("").reverse().join("");
					}
					var performance = '<span style="color:Orange;">Form: </span>' + homeForm + " - " + awayForm;
					 */

					var homeRank = clubMap.get(clubData.home.id);
					var awayRank = clubMap.get(clubData.away.id);
					var rank = '<span style="color:Orange;">Rank: </span>' + homeRank + " - " + awayRank;

					var homeLineup = data.lineup.home;
					var awayLineup = data.lineup.away;
					var homePlayerIds = Object.getOwnPropertyNames(homeLineup);
					var awayPlayerIds = Object.getOwnPropertyNames(awayLineup);
					var homePlayer = new Map(),
					awayPlayer = new Map();
					homePlayerIds.forEach((playerId) => {
						homePlayer.set(playerId, homeLineup[playerId].name);
						/* comment for user request
						if (homeLineup[playerId].rating > 0) {
						homeRate += homeLineup[playerId].rating;
						homeRateCount++;
						}
						 */
					});
					awayPlayerIds.forEach((playerId) => {
						awayPlayer.set(playerId, awayLineup[playerId].name);
						/* comment for user request
						if (awayLineup[playerId].rating > 0) {
						awayRate += awayLineup[playerId].rating;
						awayRateCount++;
						}
						 */
					});

					/* comment for user request
					var homeRate = 0,
					awayRate = 0,
					homeRateCount = 0,
					awayRateCount = 0;
					if (homeRateCount > 0) {
					homeRate = (homeRate / homeRateCount).toFixed(1);
					}
					if (awayRateCount > 0) {
					awayRate = (awayRate / awayRateCount).toFixed(1);
					}
					var rate = '<span style="color:Orange;">Rate: </span>' + homeRate + " - " + awayRate;
					 */

					var goalsReport = getGoalsReport(report);
					var score,
					scorer = "<table><tbody>";
					if (goalsReport.length == 0) {
						score = '<span style="color:Orange;">Score: </span><a href="/matches/' + matchId + '">0 - 0</a>';
					} else {
						var homeGoal = 0,
						awayGoal = 0;
						goalsReport.forEach((goal) => {
							if (homePlayer.has(goal.playerId)) {
								homeGoal++;
								scorer += "<tr><td align='left'>" + goal.minute + ". " + homePlayer.get(goal.playerId) + "</td></tr>";
							} else {
								awayGoal++;
								scorer += "<tr><td align='right'>" + awayPlayer.get(goal.playerId) + " ." + goal.minute + "</td></tr>";
							}
						});

						score = '<span style="color:Orange;">Score: </span><a href="/matches/' + matchId + '">' + homeGoal + " - " + awayGoal + '</a>';
						scorer += "</tbody></table>";
					}

					//replace content
					var replaceContent =
						'<table><tbody>' +
						'<tr><td>' + score + '</td></tr>' +
						'<tr><td>' + rank + '</td></tr>' +
						'<tr><td>' + possession + '</td></tr>' +
						'<tr><td>' + attendance + '</td></tr>';
					//'<tr><td>' + rate + '</td></tr>' + //comment for user request
					//'<tr><td>' + performance + '</td></tr>'; //comment for user request

					if (goalsReport.length > 0) {
						replaceContent += '<tr><td><span style="color:Orange;">Scorer: </span></td></tr>';
						replaceContent += '<tr><td>';
						replaceContent += scorer;
						replaceContent += '</td></tr>';
					}
					replaceContent += '</tbody></table>';
					$('#' + tableId + ' a[href="\/matches\/' + matchId + '\/"]')[0].parentElement.style.width = "60%";
					$('#' + tableId + ' a[href="\/matches\/' + matchId + '\/"]')[0].parentElement.innerHTML = replaceContent;
				}
			};
		});
	}
})();