// ==UserScript==
// @name         TMVN Cup Champion
// @namespace    https://trophymanager.com
// @version      2
// @description  Trophymanager: count the number of championships by teams in current tournament, to see successful teams on the cup arena
// @match        https://trophymanager.com/cup/*
// @match        https://trophymanager.com/cup/
// @match        https://trophymanager.com/cup
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421975/TMVN%20Cup%20Champion.user.js
// @updateURL https://update.greasyfork.org/scripts/421975/TMVN%20Cup%20Champion.meta.js
// ==/UserScript==

(function () {
	'use strict';

	var clubChampionMap = new Map();
	var clubRunnerUpMap = new Map();
	var clubSortMap = new Map();
	var clubMap = new Map();
	var currentSeason = $('#top_menu a[class="none white small"]')[0].innerText.split(/(\s+)/)[2];
	var country = $('.country_link')[1].getAttribute("href").split('/')[2];

	var trArr = $('.zebra.hover tr a[class!="match_link normal"]');
	trArr.each(function () {
		let clubId = this.getAttribute("club_link");
		if (!clubMap.has(clubId)) {
			let clubName = this.innerText;
			clubMap.set(clubId, clubName);
		}
	});

	var scanCount = 0;
	for (var i = currentSeason - 1; i > 0; i--) {
		$.ajax('https://trophymanager.com/history/cup/' + country + '/' + i, {
			type: "GET",
			dataType: 'html',
			crossDomain: true,
			success: function (response) {
				let final = $('.match_list.border_bottom li', response)[0];
				if (final) {
					let aArr = final.querySelectorAll('a');
					let leftClubId = aArr[0].getAttribute('club_link');
					let rightClubId = aArr[2].getAttribute('club_link');

					let score = aArr[1].innerText.split('-');
					if (score[0] > score[1]) {
						if (clubMap.has(leftClubId)) {
							increaseValueOfMap(clubChampionMap, leftClubId);
						}
						if (clubMap.has(rightClubId)) {
							increaseValueOfMap(clubRunnerUpMap, rightClubId);
						}
					} else {
						if (clubMap.has(leftClubId)) {
							increaseValueOfMap(clubRunnerUpMap, leftClubId);
						}
						if (clubMap.has(rightClubId)) {
							increaseValueOfMap(clubChampionMap, rightClubId);
						}
					}
				}
				scanCount++;
			},
			error: function (e) {}
		});
	}

	var myInterval = setInterval(append, 1000);

	function append() {
		if (scanCount < currentSeason - 1) {
			return;
		}
		clearInterval(myInterval);

		for (let[key, value]of clubMap) {
			let champion = clubChampionMap.get(key) == undefined ? 0 : clubChampionMap.get(key);
			let runnerUp = clubRunnerUpMap.get(key) == undefined ? 0 : clubRunnerUpMap.get(key);
			if (champion * 1000 + runnerUp > 0) {
				clubSortMap.set(key, champion * 1000 + runnerUp);
			}
		}

		clubSortMap[Symbol.iterator] = function  * () {
			yield * [...this.entries()].sort((a, b) => b[1] - a[1]);
		}

		/*APPEND CHAMPION HISTORY TABLE*/
		let champion =
			"<div class=\"box\">" +
			"<div class=\"box_head\">" +
			"<h2 class=\"std\">ACTIVE CHAMPION</h2>" +
			"</div>" +
			"<div class=\"box_body\">" +
			"<div class=\"box_shadow\"></div>" +
			"<div id=\"champion_content\" class=\"content_menu\"></div>" +
			"</div>" +
			"<div class=\"box_footer\">" +
			"<div></div>" +
			"</div>" +
			"</div>";
		$(".column3_a .box")[0].innerHTML = champion + $(".column3_a .box")[0].innerHTML;

		let champion_content = "<table>" +
			"<tr><th>#</th><th>Club</th><th align='right'>#1</th><th align='right'>#2</th></tr>";
		let rowCount = 0;
		for (let[key, value]of clubSortMap) {
			rowCount++;
			let classOdd = "";
			if ((rowCount % 2) == 1) {
				classOdd = "class='odd'";
			}
			let clubName = clubMap.get(key);
			let championCount = clubChampionMap.get(key);
			let runnerUpCount = clubRunnerUpMap.get(key);

			champion_content += "<tr " + classOdd + ">" +
			"<td>" + rowCount + "</td>" +
			"<td><span onclick = \"window.open(\'https:\/\/trophymanager.com\/club\/" + key + "\')\">" + clubName + "</span></td>" +
			"<td align='right'>" + (championCount != undefined ? championCount : "") + "</td>" +
			"<td align='right'>" + (runnerUpCount != undefined ? runnerUpCount : "") + "</td>" +
			"</tr>";
		}
		champion_content += "</table>";
		$("#champion_content").append(champion_content);
	}

	function increaseValueOfMap(map, key) {
		if (map.has(key)) {
			let count = map.get(key);
			count++;
			map.set(key, count);
		} else {
			map.set(key, 1);
		}
	}
})();
