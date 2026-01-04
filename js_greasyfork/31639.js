// ==UserScript==
// @name         MyAnimeList(MAL) - Average Friends Score (Animelist)
// @version      1.0.1
// @description  This script will create a new column with the average score of your friends.
// @author       Cpt_mathix
// @match        https://myanimelist.net/animelist/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @namespace    https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/31639/MyAnimeList%28MAL%29%20-%20Average%20Friends%20Score%20%28Animelist%29.user.js
// @updateURL https://update.greasyfork.org/scripts/31639/MyAnimeList%28MAL%29%20-%20Average%20Friends%20Score%20%28Animelist%29.meta.js
// ==/UserScript==

(function($) {
	if (document.getElementsByClassName("username")[0].textContent.trim() !== "Your") {
		return false;
	}

	var timer, index, table_rows;
	var timeout = 1000, succeed = 0, running = true;
	var table = document.getElementsByClassName("list-table")[0];

	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (timer) { clearTimeout(timer); }
			if (!running) { timer = setTimeout(function() {init();}, 500); }
		});
	});

	// configuration of the observer:
	var config = { attributes: false, childList: true, characterData: false };

	// pass in the target node, as well as the observer options
	observer.observe(table, config);

	var table_header = table.getElementsByClassName("list-table-header")[0];
	table_header.insertAdjacentHTML("beforeend", "<th class=\"header-title tags\">Friend Score</th>");
	table_header.addEventListener("click", function() {
		removeDatabase();
		location.reload();
	});

	init();
	function init() {
		table_rows = table.querySelectorAll(".list-item:not(.calculated)");
		index = 0;
		getFriendScore(table_rows[index]);
	}

	function getFriendScore(row) {
		var id = row.getElementsByClassName("more-info")[0].id.match(/\d/g).join("");
		var score = GM_getValue("friend_score:" + id);
		var count = GM_getValue("friend_count:" + id);

		if (!score) {
			calcFriendScore(id, row);
			setTimeout(function() {
				next();
			}, timeout);
		} else {
			insertFriendScore(score, count, row);
			next();
		}
	}

	function calcFriendScore(id, row) {
		var url = "https://myanimelist.net/anime/" + id + "/random/stats";
		$.get(url + '/stats', function(data) {
			var elements = $(data).find('table.table-recently-updated > tbody > tr:nth-child(n) > td:nth-child(2)').not('.borderClass.fw-b.ac');

			var sum = 0;
			var count = 0;
			$(elements).each( function() {
				var score = $(this).text();
				if(!isNaN(score)) {
					sum += parseInt(score);
					count += 1;
				}
			});

			var averageScore;
			if (sum > 0) {
				averageScore = (sum/count).toPrecision(3);
			} else {
				averageScore = '-';
			}

			succeed += 1;
			if (succeed > 5) {
				timeout = (timeout > 500 ? timeout - 100 : timeout);
			}

			GM_setValue("friend_score:" + id, averageScore);
			GM_setValue("friend_count:" + id, count);
			insertFriendScore(averageScore, count, row);
		}).fail(function() {
			timeout += 100;
			succeed = 0;
		});
	}

	function insertFriendScore(score, count, row) {
		row.firstElementChild.insertAdjacentHTML("beforeend", "<td class=\"data tags\"" + (score !== "-" ? "title=\"" + count + (count > 1 ? " Friends have" : " Friend has") + " rated this anime\"" : "") + ">" + score + "</td>");
		row.classList.add("calculated");
	}

	function next() {
		index += 1;
		if (index < table_rows.length) {
			getFriendScore(table_rows[index]);
		} else if (table.querySelectorAll(".list-item:not(.calculated)").length > 0) {
			init();
		} else {
			running = false;
		}
	}

	function removeDatabase() {
		var keys = GM_listValues();
		for (var i = 0; i < keys.length; i++) {
			GM_deleteValue(keys[i]);
		}
	}
})(jQuery);