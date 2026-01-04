// ==UserScript==
// @name         TMVN Club HeadToHead
// @namespace    https://trophymanager.com
// @version      4
// @description  Trophymanager: check head to head record of club with your team
// @include      https://trophymanager.com/club/*
// @include      https://trophymanager.com/club/*/
// @exclude      https://trophymanager.com/club/
// @exclude      https://trophymanager.com/club/*/squad/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422272/TMVN%20Club%20HeadToHead.user.js
// @updateURL https://update.greasyfork.org/scripts/422272/TMVN%20Club%20HeadToHead.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const APPLICATION_COLOR = {
		FIRST_CLUB: 'Darkred',
		SECOND_CLUB: 'Blue',
		TITLE: 'Yellow',
		SEASON: 'Yellow'
	}

	const MATCH_TYPE = {
		LEAGUE: '<label style="color:White;">League</label>',
		PLAYOFF: '<label style="color:White;">Playoff</label>',
		CUP: '<label style="color:Orange;">Cup</label>',
		INTER_CUP: '<label style="color:Black;">International Cup</label>',
		FRIEND: '<label style="color:Aqua;">Friend</label>',
		FRIEND_LEAGUE: '<label style="color:Aqua;">Friend League</label>'
	}

	var leagueRecord = {
		firstClubWinCount: 0,
		secondClubWinCount: 0,
		drawCount: 0,
		firstClubGoal: 0,
		secondClubGoal: 0
	}
	var playoffRecord = {
		firstClubWinCount: 0,
		secondClubWinCount: 0,
		drawCount: 0,
		firstClubGoal: 0,
		secondClubGoal: 0
	}
	var cupRecord = {
		firstClubWinCount: 0,
		secondClubWinCount: 0,
		drawCount: 0,
		firstClubGoal: 0,
		secondClubGoal: 0
	}
	var interCupRecord = {
		firstClubWinCount: 0,
		secondClubWinCount: 0,
		drawCount: 0,
		firstClubGoal: 0,
		secondClubGoal: 0
	}
	var friendRecord = {
		firstClubWinCount: 0,
		secondClubWinCount: 0,
		drawCount: 0,
		firstClubGoal: 0,
		secondClubGoal: 0
	}
	var friendLeagueRecord = {
		firstClubWinCount: 0,
		secondClubWinCount: 0,
		drawCount: 0,
		firstClubGoal: 0,
		secondClubGoal: 0
	}
	var matchMap = new Map();
	var sortMap = new Map();

	var firstClubId,
	secondClubId,
	firstClubName,
	secondClubName;

	var checkClubInfoSuccess = false;
	var checkClubInfoInterval = setInterval(checkClubInfo, 500);
	var checkHeadToHeadInterval = setInterval(checkHeadToHead, 1000);

	function checkHeadToHead() {
		if (!checkClubInfoSuccess) {
			return;
		} else {
			clearInterval(checkHeadToHeadInterval);
		}

		if (firstClubId == secondClubId) {
			return;
		}

		$.ajaxSetup({
			async: false
		});

		let noMatchFound = false;
		let headToHeadUrl = 'https://trophymanager.com/ajax/match_h2h.ajax.php?home_team=' + firstClubId + '&away_team=' + secondClubId;

		$.ajax(headToHeadUrl, {
			type: "GET",
			dataType: 'json',
			crossDomain: true,
			success: function (response) {
				let matches = response.matches;
				if (matches.length == 0) {
					noMatchFound = true;
				} else {
					resetObject(leagueRecord);
					resetObject(playoffRecord);
					resetObject(cupRecord);
					resetObject(friendRecord);
					resetObject(friendLeagueRecord);
					resetObject(interCupRecord);
					matchMap = new Map();
					sortMap = new Map();

					Object.keys(matches).forEach(function (key, index) {
						let seasonArr = matches[key];
						for (let i = 0; i < seasonArr.length; i++) {
							let match = seasonArr[i];
							if (match.matchtype == 'l') {
								statistic(match, firstClubId, leagueRecord);
							} else if (match.matchtype.startsWith('lq')) {
								statistic(match, firstClubId, playoffRecord);
							} else if (match.matchtype.startsWith('p')) {
								statistic(match, firstClubId, cupRecord);
							} else if (match.matchtype == 'f') {
								statistic(match, firstClubId, friendRecord);
							} else if (match.matchtype == 'fl') {
								statistic(match, firstClubId, friendLeagueRecord);
							} else {
								statistic(match, firstClubId, interCupRecord);
							}
						}
					});
				}
			},
			error: function (e) {}
		});

		let headToHead =
			"<div class=\"box\">" +
			"<div class=\"box_head\">" +
			"<h2 class=\"std\">Head to Head</h2>" +
			"</div>" +
			"<div class=\"box_body\">" +
			"<div class=\"box_shadow\"></div>" +
			"<div id=\"tm_script_head_to_head_result_area_id\" class=\"content_menu\"></div>" +
			"</div>" +
			"<div class=\"box_footer\">" +
			"<div></div>" +
			"</div>" +
			"</div>";
		$(".column3_a").append(headToHead);

		let headToHead_content = "<table>";
		headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">#1: </span>' + firstClubName + '</td></tr>';
		headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">#2: </span>' + secondClubName + '</td></tr>';
		if (noMatchFound) {
			headToHead_content += '<tr><td><span style="color:Orange;">No match found</span></td></tr>';
		} else {
			let firstClubWinCount = 0,
			secondClubWinCount = 0,
			drawCount = 0,
			firstClubGoal = 0,
			secondClubGoal = 0;
			let firstClubWinRatio,
			secondClubWinRatio,
			drawRatio;
			let firstClubGoalAvg,
			secondClubGoalAvg;

			firstClubWinCount = leagueRecord.firstClubWinCount + playoffRecord.firstClubWinCount + cupRecord.firstClubWinCount + friendRecord.firstClubWinCount + friendLeagueRecord.firstClubWinCount + interCupRecord.firstClubWinCount;
			secondClubWinCount = leagueRecord.secondClubWinCount + playoffRecord.secondClubWinCount + cupRecord.secondClubWinCount + friendRecord.secondClubWinCount + friendLeagueRecord.secondClubWinCount + interCupRecord.secondClubWinCount;
			drawCount = leagueRecord.drawCount + playoffRecord.drawCount + cupRecord.drawCount + friendRecord.drawCount + friendLeagueRecord.drawCount + interCupRecord.drawCount;
			firstClubGoal = leagueRecord.firstClubGoal + playoffRecord.firstClubGoal + cupRecord.firstClubGoal + friendRecord.firstClubGoal + friendLeagueRecord.firstClubGoal + interCupRecord.firstClubGoal;
			secondClubGoal = leagueRecord.secondClubGoal + playoffRecord.secondClubGoal + cupRecord.secondClubGoal + friendRecord.secondClubGoal + friendLeagueRecord.secondClubGoal + interCupRecord.secondClubGoal;

			firstClubWinRatio = Math.round(firstClubWinCount / (firstClubWinCount + drawCount + secondClubWinCount) * 100);
			if (drawCount == 0) {
				secondClubWinRatio = 100 - firstClubWinRatio;
				drawRatio = 0;
			} else {
				secondClubWinRatio = Math.round(secondClubWinCount / (firstClubWinCount + drawCount + secondClubWinCount) * 100);
				drawRatio = 100 - firstClubWinRatio - secondClubWinRatio;
			}

			firstClubGoalAvg = (firstClubGoal / (firstClubWinCount + drawCount + secondClubWinCount)).toFixed(1);
			secondClubGoalAvg = (secondClubGoal / (firstClubWinCount + drawCount + secondClubWinCount)).toFixed(1);

			headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.TITLE + ';">All</span></td></tr>';
			headToHead_content += '<tr><td><span style="color:Orange;">#1 - Draw - #2: </span>' + firstClubWinCount + ' - ' + drawCount + ' - ' + secondClubWinCount + ' [' + firstClubWinRatio + '% - ' + drawRatio + '% - ' + secondClubWinRatio + '%]' + '</td></tr>';
			headToHead_content += '<tr><td><span style="color:Orange;">Goal #1 - #2: </span>' + firstClubGoal + ' - ' + secondClubGoal + '</td></tr>';
			headToHead_content += '<tr><td><span style="color:Orange;">Goal average: </span>' + firstClubGoalAvg + ' - ' + secondClubGoalAvg + '</td></tr>';

			if (leagueRecord.firstClubWinCount + leagueRecord.drawCount + leagueRecord.secondClubWinCount > 0) {
				headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.TITLE + ';">League</span></td></tr>';
				headToHead_content = setRecord(headToHead_content, leagueRecord);
			}
			if (playoffRecord.firstClubWinCount + playoffRecord.drawCount + playoffRecord.secondClubWinCount > 0) {
				headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.TITLE + ';">Playoff</span></td></tr>';
				headToHead_content = setRecord(headToHead_content, playoffRecord);
			}
			if (cupRecord.firstClubWinCount + cupRecord.drawCount + cupRecord.secondClubWinCount > 0) {
				headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.TITLE + ';">Cup</span></td></tr>';
				headToHead_content = setRecord(headToHead_content, cupRecord);
			}
			if (interCupRecord.firstClubWinCount + interCupRecord.drawCount + interCupRecord.secondClubWinCount > 0) {
				headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.TITLE + ';">Internaltional Cup</span></td></tr>';
				headToHead_content = setRecord(headToHead_content, interCupRecord);
			}
			if (friendLeagueRecord.firstClubWinCount + friendLeagueRecord.drawCount + friendLeagueRecord.secondClubWinCount > 0) {
				headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.TITLE + ';">Friend League</span></td></tr>';
				headToHead_content = setRecord(headToHead_content, friendLeagueRecord);
			}
			if (friendRecord.firstClubWinCount + friendRecord.drawCount + friendRecord.secondClubWinCount > 0) {
				headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.TITLE + ';">Friend</span></td></tr>';
				headToHead_content = setRecord(headToHead_content, friendRecord);
			}

			sortMap[Symbol.iterator] = function  * () {
				yield * [...this.entries()].sort((a, b) => b[1] - a[1]);
			}
			headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.TITLE + ';">Match:</span></td></tr>';
			for (let[key, value]of sortMap) {
				let match = matchMap.get(key);
				if (match.hometeam == '#1') {
					if (match.homegoal > match.awaygoal) {
						headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">[' + match.hometeam + ']</span> <span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">' + match.homegoal + '</span> - ' + match.awaygoal + ' <span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">[' + match.awayteam + ']</span>' + ' [<span onclick = \"window.open(\'https:\/\/trophymanager.com\/matches\/' + match.id + '\')\">' + match.matchtype + '</span>] [' + match.season + '] [' + match.date + ']</td></tr>';
					} else if (match.homegoal < match.awaygoal) {
						headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">[' + match.hometeam + ']</span> ' + match.homegoal + ' - <span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">' + match.awaygoal + '</span> <span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">[' + match.awayteam + ']</span>' + ' [<span onclick = \"window.open(\'https:\/\/trophymanager.com\/matches\/' + match.id + '\')\">' + match.matchtype + '</span>] [' + match.season + '] [' + match.date + ']</td></tr>';
					} else {
						headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">[' + match.hometeam + ']</span> ' + match.homegoal + ' - ' + match.awaygoal + ' <span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">[' + match.awayteam + ']</span>' + ' [<span onclick = \"window.open(\'https:\/\/trophymanager.com\/matches\/' + match.id + '\')\">' + match.matchtype + '</span>] [' + match.season + '] [' + match.date + ']</td></tr>';
					}
				} else {
					if (match.homegoal > match.awaygoal) {
						headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">[' + match.hometeam + ']</span> <span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">' + match.homegoal + '</span> - ' + match.awaygoal + ' <span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">[' + match.awayteam + ']</span>' + ' [<span onclick = \"window.open(\'https:\/\/trophymanager.com\/matches\/' + match.id + '\')\">' + match.matchtype + '</span>] [' + match.season + '] [' + match.date + ']</td></tr>';
					} else if (match.homegoal < match.awaygoal) {
						headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">[' + match.hometeam + ']</span> ' + match.homegoal + ' - <span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">' + match.awaygoal + '</span> <span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">[' + match.awayteam + ']</span>' + ' [<span onclick = \"window.open(\'https:\/\/trophymanager.com\/matches\/' + match.id + '\')\">' + match.matchtype + '</span>] [' + match.season + '] [' + match.date + ']</td></tr>';
					} else {
						headToHead_content += '<tr><td><span style="color:' + APPLICATION_COLOR.SECOND_CLUB + ';">[' + match.hometeam + ']</span> ' + match.homegoal + ' - ' + match.awaygoal + ' <span style="color:' + APPLICATION_COLOR.FIRST_CLUB + ';">[' + match.awayteam + ']</span>' + ' [<span onclick = \"window.open(\'https:\/\/trophymanager.com\/matches\/' + match.id + '\')\">' + match.matchtype + '</span>] [' + match.season + '] [' + match.date + ']</td></tr>';
					}
				}
			}
		}
		headToHead_content += "</table>";

		$("#tm_script_head_to_head_result_area_id").append(headToHead_content);
		try {
			$('.banner_placeholder.rectangle')[0].parentNode.removeChild($('.banner_placeholder.rectangle')[0]);
		} catch (err) {}
		$.ajaxSetup({
			async: true
		});
	}

	function statistic(match, firstClubId, record) {
		let result = match.result.split('-');
		if (match.hometeam == firstClubId) {
			record.firstClubGoal += parseInt(result[0]);
			record.secondClubGoal += parseInt(result[1]);
		} else {
			record.secondClubGoal += parseInt(result[0]);
			record.firstClubGoal += parseInt(result[1]);
		}
		if (result[0] == result[1]) {
			record.drawCount++;
		} else if (result[0] > result[1]) {
			if (match.hometeam == firstClubId) {
				record.firstClubWinCount++;
			} else {
				record.secondClubWinCount++;
			}
		} else {
			if (match.hometeam == firstClubId) {
				record.secondClubWinCount++;
			} else {
				record.firstClubWinCount++;
			}
		}
		let matchType = '';
		if (record == leagueRecord) {
			matchType = MATCH_TYPE.LEAGUE;
		} else if (record == playoffRecord) {
			matchType = MATCH_TYPE.PLAYOFF;
		} else if (record == cupRecord) {
			matchType = MATCH_TYPE.CUP;
		} else if (record == friendRecord) {
			matchType = MATCH_TYPE.FRIEND;
		} else if (record == friendLeagueRecord) {
			matchType = MATCH_TYPE.FRIEND_LEAGUE;
		} else {
			matchType = MATCH_TYPE.INTER_CUP;
		}

		let hometeam,
		awayteam;
		if (match.hometeam == firstClubId) {
			hometeam = '#1';
			awayteam = '#2';
		} else {
			hometeam = '#2';
			awayteam = '#1';
		}
		matchMap.set(match.id, {
			'id': match.id,
			'matchtype': matchType,
			'season': '<span style="color:' + APPLICATION_COLOR.SEASON + ';">' + match.season + '</span>',
			'date': match.date,
			'hometeam': hometeam,
			'awayteam': awayteam,
			'homegoal': result[0],
			'awaygoal': result[1]
		});
		sortMap.set(match.id, new Date(match.date));
	}

	function setRecord(headToHead_content, record) {
		let firstClubGoalAvg,
		secondClubGoalAvg;
		let firstClubWinRatio,
		secondClubWinRatio,
		drawRatio;

		firstClubGoalAvg = (record.firstClubGoal / (record.firstClubWinCount + record.drawCount + record.secondClubWinCount)).toFixed(1);
		secondClubGoalAvg = (record.secondClubGoal / (record.firstClubWinCount + record.drawCount + record.secondClubWinCount)).toFixed(1);

		firstClubWinRatio = Math.round(record.firstClubWinCount / (record.firstClubWinCount + record.drawCount + record.secondClubWinCount) * 100);
		if (record.drawCount == 0) {
			secondClubWinRatio = 100 - firstClubWinRatio;
			drawRatio = 0;
		} else {
			secondClubWinRatio = Math.round(record.secondClubWinCount / (record.firstClubWinCount + record.drawCount + record.secondClubWinCount) * 100);
			drawRatio = 100 - firstClubWinRatio - secondClubWinRatio;
		}

		headToHead_content += '<tr><td><span style="color:Orange;">#1 - Draw - #2: </span>' + record.firstClubWinCount + ' - ' + record.drawCount + ' - ' + record.secondClubWinCount + ' [' + firstClubWinRatio + '% - ' + drawRatio + '% - ' + secondClubWinRatio + '%]' + '</td></tr>';
		headToHead_content += '<tr><td><span style="color:Orange;">Goal #1 - #2: </span>' + record.firstClubGoal + ' - ' + record.secondClubGoal + '</td></tr>';
		headToHead_content += '<tr><td><span style="color:Orange;">Goal average: </span>' + firstClubGoalAvg + ' - ' + secondClubGoalAvg + '</td></tr>';
		return headToHead_content;
	}

	function resetObject(obj) {
		for (var key in obj) {
			obj[key] = 0;
		}
	}

	function checkClubInfo() {
		if (checkClubInfoSuccess) {
			clearInterval(checkClubInfoInterval);
		} else {
			try {
				firstClubId = $('.club.faux_link').attr('club');
				firstClubName = $('.club.faux_link')[0].innerText.trim();
				let url = location.href;
				secondClubId = url.split('/')[4];
				try {
					secondClubName = $('.column2_a div.box_sub_header.align_center a[club_link="' + secondClubId + '"]')[0].innerText;
				} catch (e) {
					secondClubName = secondClubId; //club doesn't exists
				}

				if (firstClubId != '' && firstClubName != '' && secondClubId != '' && secondClubName != '') {
					checkClubInfoSuccess = true;
				}
			} catch (e) {
				checkClubInfoSuccess = false;
			}
		}
	}
})();
