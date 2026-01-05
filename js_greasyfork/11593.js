// ==UserScript==
// @name         CompSearch
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.4
// @description  Finds trends between people who play together in comp
// @author       Croned
// @match        https://epicmafia.com/round
// @downloadURL https://update.greasyfork.org/scripts/11593/CompSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/11593/CompSearch.meta.js
// ==/UserScript==

var master = {};
var masterArray = [];

$("head").append("<style type='text/css'>table { font-size: 15px; margin-top: 10px; } table td { padding: 3px; } table th { padding: 3px; text-align: center; } table tr:nth-child(even) { background-color: #eee; } table tr:nth-child(odd) { background-color: #fff; } table th { color: white; background-color: black; } </style>");
$("#round_middle").prepend("<div id='compSearch'><h3 style='margin-bottom: 10px;'>Search for a player's competition trends!</h3><form class='form' id='searchCompForm' style='margin-left: 7px;'><div class='search'><div class='search-icon'><i class='icon-search'></i></div><input autocomplete='off' id='searchCompText' placeholder='Player ID, round' type='text' style='border: 1px solid #777;'></div></form><div id='loadingReport' style='text-align: center; display: none;'>Loading report...</div><table id='reportTable' style='display: none;'><tr><th>Name</th><th>Wins</th><th>Losses</th><th>Mutual Wins</th><th>Mutual Losses</th><th>Games</th></tr></table></div>");

$("#searchCompForm").submit(function (e) {
	e.preventDefault();
	var input = $("#searchCompText").val();
	var inputSplit = input.split(", ");
	if (inputSplit.length != 2) {
		alert("Please enter the user's id and the round number, separated by a comma and space.");
	}
	else {
		master = {};
		masterArray = [];
		$("#searchCompForm").hide();
		$("#reportTable tr").remove();
		$("#reportTable").append("<tr><th>Name</th><th>Wins</th><th>Losses</th><th>Mutual Wins</th><th>Mutual Losses</th><th>Games</th></tr>");
		$("#reportTable").hide();
		$("#loadingReport").show();
		var userId = inputSplit[0];
		var round = inputSplit[1];
		setTimeout(function() {
			var userPage = $.ajax({ method: "GET", url: "/user/" + userId, async: false });
			userPage = userPage.responseText;
			var div = $("<div></div>");
			div.html(userPage);
			var username = div.find("#usertitle").text();
			username = username.toLowerCase();

			var gameList = getGames(round, userId);
			for (var i = 0; i < gameList.length; i++) {
				recordGame("/game/" + gameList[i].id + "/review", gameList[i].win, gameList[i].lose);
			}
			//Evaluate data
			if (master[username]) {
				master[username].mutWin = "";
				master[username].mutLose = "";
			}
			delete master.deleted;
			for (var user in master) {
				if (master.hasOwnProperty(user)) {
					var temp = { name: user, win: master[user].win, lose: master[user].lose, mutWin: master[user].mutWin, mutLose: master[user].mutLose, total: master[user].total };
					masterArray.push(temp);
				}
			}

			masterArray.sort(function (a, b) {
				return b.total - a.total;
			});
			console.log(masterArray);

			for (var i = 0; i < masterArray.length; i++) {
				$("#reportTable tbody").append("<tr><td>" + masterArray[i].name + "</td><td>" + masterArray[i].win + "</td><td>" + masterArray[i].lose + "</td><td>" + masterArray[i].mutWin + "</td><td>" + masterArray[i].mutLose + "</td><td>" + masterArray[i].total + "</td></tr>");
			}
			$("#loadingReport").hide();
			$("#searchCompForm").show();
			$("#reportTable").show();
		}, 500);
	}
});

function recordGame(url, win, lose) {
	var data = $.ajax({ method: "GET", url: url, async: false });
	data = data.responseText;
	var div2 = $("<div></div>");
	div2.html(data);
	var rows = div2.find(".players tr");
	for (var i = 0; i < rows.length; i++) {
		div2.html(rows[i]);
		var cells = div2.find("td");
		var name = cells[1].textContent;
		name = name.toLowerCase();
		var res = cells[2].textContent;
		if (master[name]) {
			if (win || lose) {
				if (win) {
					master[name].win++;
				}
				else if (lose) {
					master[name].lose++;
				}

				if (win && res == "win") {
					master[name].mutWin++;
				}
				else if (lose && res == "lose") {
					master[name].mutLose++;
				}
				master[name].total++;
			}
		}
		else {
			if (win || lose) {
				var temp = {};
				if (win) {
					temp.win = 1;
					temp.lose = 0;
				}
				else if (lose) {
					temp.lose = 1;
					temp.win = 0;
				}

				if (win && res == "win") {
					temp.mutWin = 1;
					temp.mutLose = 0;
				}
				else if (lose && res == "lose") {
					temp.mutWin = 0;
					temp.mutLose = 1;
				}
				else {
					temp.mutWin = 0;
					temp.mutLose = 0;
				}

				temp.total = 1;
				master[name] = temp;
			}
		}
	}
}


function getGames(round, userId) {
	var gameList = [];
	var hitEnd = false;

	for (var i = 1; !hitEnd; i++) {
		var data = $.ajax({ method: "GET", url: "/round/" + round + "/user/" + userId + "/game/page?page=" + i, async: false});
		data = data.responseJSON;
		if (data.data.length > 0) {
			for (var j = 0; j < data.data.length; j++) {
				gameList.push(data.data[j]);
			}
		}
		else {
			hitEnd = true;
		}
	}
	return gameList;
}