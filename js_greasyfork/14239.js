// ==UserScript==
// @name         Stat Collector
// @namespace    http://your.homepage/
// @version      1.0
// @description  Records stats of people you play with
// @author       You
// @match        https://epicmafia.com/game/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/14239/Stat%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/14239/Stat%20Collector.meta.js
// ==/UserScript==

var scope = $("body").scope();
var notRun = true;

if (scope.record) {
	var records = GM_getValue("em_gameRecords");
	if (!records) {
		console.log("Setting records to empty object");
		records = {};
	}
	else {
		console.log("Setting records to saved content: " + records);
		records = JSON.parse(records);
	}

	$("body").bind("keypress", function(e) {
		if (e.which == 114) {
			GM_setValue("em_gameStats", "");
			GM_setValue("em_gameRecords", "{}");
			records = JSON.parse(GM_getValue("em_gameRecords"));
			console.log("Stats reset");
		}
	});
	$("body").click(function() {
		if (notRun && !records[scope.game_id]) {
			console.log("Collecting stats");
			notRun = false;
			records[scope.game_id] = true;
			GM_setValue("em_gameRecords", JSON.stringify(records));
			console.log(records);
			var stats = GM_getValue("em_gameStats");
			var role_data = {"villager":"village","mafia":"mafia","doctor":"village","nurse":"village","surgeon":"village","bodyguard":"village","cop":"village","insane":"village","confused":"village","paranoid":"village","naive":"village","lazy":"village","watcher":"village","tracker":"village","detective":"village","snoop":"village","journalist":"village","mortician":"village","pathologist":"village","vigil":"village","sheriff":"village","deputy":"village","drunk":"village","sleepwalker":"village","civilian":"village","miller":"village","suspect":"village","leader":"village","bulletproof":"village","bleeder":"village","bomb":"village","granny":"village","hunter":"village","crier":"village","invisible":"village","governor":"village","telepath":"village","agent":"village","celebrity":"village","loudmouth":"village","mason":"village","templar":"village","shrink":"village","samurai":"village","jailer":"village","chef":"village","turncoat":"village","enchantress":"village","priest":"village","trapper":"village","baker":"village","ghoul":"village","party":"village","penguin":"village","judge":"village","gallis":"village","treestump":"village","secretary":"village","virgin":"village","blacksmith":"village","oracle":"village","psychic":"village","dreamer":"village","angel":"third","lightkeeper":"village","keymaker":"village","gunsmith":"village","tinkerer":"village","mimic":"village","santa":"village","caroler":"village","siren":"third","monk":"third","cultist":"third","cthulhu":"third","zombie":"third","fool":"third","lover":"third","cupid":"third","lyncher":"third","killer":"third","clockmaker":"third","survivor":"third","warlock":"third","mistletoe":"third","prophet":"third","alien":"third","werewolf":"third","amnesiac":"third","anarchist":"third","creepygirl":"third","traitor":"third","admirer":"third","maid":"third","autocrat":"third","politician":"third","silencer":"mafia","blinder":"mafia","sniper":"mafia","illusionist":"mafia","saboteur":"mafia","yakuza":"mafia","consigliere":"mafia","godfather":"mafia","framer":"mafia","hooker":"mafia","disguiser":"mafia","actress":"mafia","tailor":"mafia","informant":"mafia","strongman":"mafia","janitor":"mafia","don":"mafia","interrogator":"mafia","whisperer":"mafia","spy":"mafia","lawyer":"mafia","forger":"mafia","stalker":"mafia","enforcer":"mafia","quack":"mafia","poisoner":"mafia","driver":"mafia","toreador":"mafia","gramps":"mafia","interceptor":"mafia","fiddler":"mafia","witch":"mafia","ventriloquist":"mafia","voodoo":"mafia","thief":"mafia","paralyzer":"mafia","paparazzi":"mafia","scout":"mafia","associate":"mafia","fabricator":"mafia","lookout":"mafia","ninja":"mafia","hitman":"mafia","arsonist":"mafia","terrorist":"mafia","mastermind":"third"};
			var winner;

			if (!stats) {
				stats = {};
			}
			else {
				stats = JSON.parse(stats);
			}

			while (!$("#linkright").hasClass("ng-hide")) {
				$("#linkright a").click();
			}

			winner = $(".log").first().text().split(" ")[0].toLowerCase();

			var align;
			for (var user in scope.users) {
				if (!stats[user]) {
					stats[user] = {
						align: {},
						role: {}
					};
				}

				align = role_data[scope.users[user].role];
				if (align == winner) {
					if (stats[user].align[align]) {
						stats[user].align[align] ++;
					}
					else {
						stats[user].align[align] = 1;
					}

					if (stats[user].role[scope.users[user].role]) {
						stats[user].role[scope.users[user].role] ++;
					}
					else {
						stats[user].role[scope.users[user].role] = 1;
					}
				}
				else if (scope.users[user].role == winner) {
					if (stats[user].align["third"]) {
						stats[user].align.third ++;
					}
					else {
						stats[user].align["third"] = 1;
					}

					if (stats[user].role[scope.users[user].role]) {
						stats[user].role[scope.users[user].role] ++;
					}
					else {
						stats[user].role[scope.users[user].role] = 1;
					}
				}
			}

			GM_setValue("em_gameStats", JSON.stringify(stats));
			console.log(stats);
		}
	});
}
