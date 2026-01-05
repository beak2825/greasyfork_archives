// ==UserScript==
// @name         SmartStat
// @namespace    https://greasyfork.org/en/users/9694-croned
// @version      1.0
// @description  Taking over EpicMafia, one script at a time
// @author       Croned
// @match        https://epicmafia.com/game/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13773/SmartStat.user.js
// @updateURL https://update.greasyfork.org/scripts/13773/SmartStat.meta.js
// ==/UserScript==

var scope = $("body").scope();
window.calcStat = calcStat;
window.predictWin = predictWin;

function calcStat(name, cb) {
	var stats= {};
	var info = scope.users[name];
	var role = info.role;
	var align = scope.role_data[role];
	
	$.get("https://epicmafia.com/user/" + info.id + "/statistics", function(data) {
		var div = $("<div></div>");
		div.html(data);
		
		if (div.find("#pie").length > 0) {
			//Percent games won in total
			var roleData = div.find(".roledata").has(".role-" + role);
			stats.totalWins = JSON.parse(div.find("#pie_data").text())[1][1] / (JSON.parse(div.find("#pie_data").text())[2][1] + JSON.parse(div.find("#pie_data").text())[1][1]);
			
			//Percent games won as role
			if (roleData.length > 0) {
				stats.roleWins = parseInt(roleData.find(".bar").attr("data-wins")) / parseInt(roleData.find(".bar").attr("data-total"));
			}
			else {
				stats.roleWins = 0;
			}
			
			//Percent games won as alignment
			switch (align) {
				case "village":
					stats.alignWins = parseInt(div.find(".align_stats").has(".role-village").text().replace("%", "")) / 100;
					break;
					
				case "mafia":
					stats.alignWins = parseInt(div.find(".align_stats").has(".role-mafia").text().replace("%", "")) / 100;
					break;
					
				case "third":
					stats.alignWins = parseInt(div.find(".align_stats").has(".role-fool").text().replace("%", "")) / 100;
					break;
			
				default:
			}
			
			//Times played setup
			div.find(".gamesetup").each(function() {
				if($(this).find("a").first().attr("href").split("/")[2] == scope.setup_id) {
					stats.setup = true;
				}
			});
			
			if (!stats.setup) {
				stats.setup = false;
			}
			
			//Expected win %
			if (stats.setup) {
				stats.exp = (.6 * stats.roleWins) + (.25 * stats.alignWins) + (.15 * stats.totalWins);
			}
			else {
				stats.exp = (.55 * stats.roleWins) + (.25 * stats.alignWins) + (.15 * stats.totalWins);
			}
		}
		else {
			stats.exp = 0;
		}
		
		if (cb) {
			cb(stats);
		}
		else {
			console.log(stats);
		}
	});
	
	if (!cb) {
		return stats;
	}
}

function predictWin(callb) {
	var alignList = {
		village: false,
		mafia: false,
		third: false
	};
	var teamAmt = 0;
	var teamList = {};
	var scores = {
		village: 0,
		mafia: 0,
		third: 0
	};
	
	for (var role in scope.role_data) {
		alignList[scope.role_data[role]] = true;
	}
	
	for (var align in alignList) {
		if (alignList[align]) {
			teamAmt ++;
		}
	}
	
	for (var user in scope.users) {
		var role = scope.users[user].role;
		var align = scope.role_data[role];
		
		if (teamList[align]) {
			teamList[align].push(user);
		}
		else {
			teamList[align] = [user];
		}
	}
	
	var scoresDone = 0;
	var cycleUsers = function(teamName, team, i, cb) {
		if (i < team.length) {
			calcStat(team[i], function(stats) {
				if (scores[teamName] > 0 && i == team.length - 1) {
					$.get("/setup/" + scope.setup_id, function(data) {
						var div = $("<div></div>");
						div.html(data);
						var setupWin;
						if (teamName == "village") {
							setupWin = div.find("#winstats tr").has(".role-villager").text().split("%")[0];
							scores[teamName] = (((scores[teamName] + stats.exp) / 2) + (setupWin / 100)) / 2;
						}
						else if (teamName == "mafia") {
							setupWin = div.find("#winstats tr").has(".role-mafia").text().split("%")[0];
							scores[teamName] = (((scores[teamName] + stats.exp) / 2) + (setupWin / 100)) / 2;
						}
						else {
							setupWin = 0;
							div.find("#winstats tr").each(function() {
								if (!$(this).find(".roleimg").hasClass("role-villager") && !$(this).find(".roleimg").hasClass("role-mafia")) {
									setupWin += $(this).text().split("%")[0];
								}
							});
							if (setupWin > 0) {
								scores[teamName] = (((scores[teamName] + stats.exp) / 2) + (setupWin / 100)) / 2;
							}
							else {
								scores[teamName] = (scores[teamName] + stats.exp) / 2;
							}
						}
						i ++;
						cycleUsers(teamName, team, i, cb);
					});
				}
				else if (scores[teamName] > 0) {
					scores[teamName] = (scores[teamName] + stats.exp) / 2;
					i ++;
					cycleUsers(teamName, team, i, cb);
				}
				else {
					scores[teamName] = stats.exp
					i ++;
					cycleUsers(teamName, team, i, cb);
				}
			});
		}
		else {
			cb();
		}
	}
	
	for (var team in teamList) {
		cycleUsers(team, teamList[team], 0, function() {
			scoresDone ++;
			if (scoresDone == teamAmt) {
				console.log(scores);
				if (callb) {
					callb(scores);
				}
				else {
					return scores;
				}
			}
		});
	}
}

$(".payout_container").dblclick(function() {
    predictWin(function(scores) {
		if (scores.village > scores.mafia && scores.village > scores.third) {
			alert("Village predicted to win!");
		}
		else if (scores.mafia > scores.village && scores.mafia > scores.third) {
			alert("Mafia predicted to win!");
		}
		else if (scores.third > scores.mafia && scores.third > scores.village) {
			alert("Third predicted to win!");
		}
	});
})

setTimeout(function() {
	$(".username").dblclick(function() {
		calcStat($(this).text(), function(stats) {
			alert("%" + (stats.exp * 100).toFixed(2));
		});
	});
}, 1500);