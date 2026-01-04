// ==UserScript==
// @name         Torn Quick Player Stats
// @version      2.5.4
// @description  Displays selected stats on user profiles.
// @author       Unknown
// @run-at       document-begin
// @match        *www.torn.com/profiles.php*
// @match        *www.torn.com/personalstats.php*
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @namespace https://greasyfork.org/users/54199
// @downloadURL https://update.greasyfork.org/scripts/426832/Torn%20Quick%20Player%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/426832/Torn%20Quick%20Player%20Stats.meta.js
// ==/UserScript==

jQuery.noConflict(true)(document).ready(function($) {
	var nullFunc = function() {};

	var statNames = localStorage.zStatNames && JSON.parse(localStorage.zStatNames);
	if (statNames) {
		if (statNames["refils"]) {
			statNames["refills"] = statNames["refils"];
			delete statNames["refils"];
		}
	}

	var apiFetch = function(callback, key, api, id, selections) {
		$.ajax({
			url: "https://api.torn.com/"+api+"/"+id,
			type: "GET",
			data: {
				key: key,
				selections: selections && selections.join ? selections.join(",") : selections,
			},
		}).done(function(response) {
			callback(response);
		});
	};

	var fetchUserStats = function(callback, userId, failCallback) {
		failCallback = failCallback || nullfunc;
		console.debug("Fetching stats for user: "+userId);

		var backupFetch = function() {
			console.debug("Using old stats fetch...");
			$.ajax({
				url: "/personalstats.php",
				type: "GET",
				data: {
					ID: userId,
				},
				crossDomain: true,
			}).done(function(response) {
				doc = $.parseHTML(response);
				var data = {}, count = 0;
				var _statNames = {};
				$(".personal-stats>.statistic>.statistic-cont>.statistic-kind", doc).not(".t-hide").children("[data-val]").each(function(i, ele) {
					++count;
					var name = $(ele).attr("data-val");
					var value = $(".value", ele).text().replace(/[$,]/g, "").split(/\W/)[0];
					data[name] = value;
					var name2 = $(".name", ele).text().replace(/[:]/g, "");
					_statNames[name] = name2;
				});
				if (count) {
					statNames = _statNames;
					console.debug(statNames);
					console.debug(data);
					localStorage.zStatNames = JSON.stringify(statNames);
					callback(data);
				} else {
					console.error("Old stats fetch failed!");
					failCallback("old");
				}
			});
		};

		var apiKey = localStorage.zStatKey;
		if (apiKey) {
			apiFetch(function(response) {
				if (response.error) {
					console.error(response.error);
					failCallback("api", response.error);
					return backupFetch();
				}
				return callback(response.personalstats);
			}, apiKey, "user", userId, ["personalstats"]);
		} else {
			return backupFetch();
		}
	};

	var displayError = function(error) {
		var a = $(".zGError");
		if (!a.length) a = $("<div class='zGError' style='background-color:goldenrod;'></div>").appendTo("body");
		a.text(error);
	};

	var pageProfile = function() {
		$(".profile-container").css("height", "auto").css("line-height", "initial");

		var statWrapper = $("<div class='profile-right-wrapper right m-top10 zStats'></div>").insertBefore($(".medals-wrapper").next().children(".clear").first());
		var statHeader = $("<div class='menu-header'>Stats</div>").appendTo(statWrapper);
		$("<button class='zStatAPI'></button>").css("margin-left", "10px").appendTo(statHeader).text(localStorage.zStatKey ? "Update API Key" : "Set API Key").click(function() {
			var value = prompt("Paste your Torn API Key below:", localStorage.zStatKey || "");
			console.debug(value);
			if (value != null) {
				localStorage.zStatKey = value;
				$('.zStatAPI', statHeader).text(localStorage.zStatKey ? "Update API Key" : "Set API Key");
			}
		});
		var statWindow = $("<div class='profile-container p10'></div>").appendTo(statWrapper).append("<div class='zStatTemp'>Loading...</div>");
		var userId = location.search.match(/[?&]XID=([^&]+)/);
		if (userId) {
			userId = userId[1];
		} else {
			statWindow.append("<div class='zError'>Failed to read user id...</div>");
			return;
		}

		var statNameError = false, visitProfile = false, fatalError = false;
		if (!statNames) {
			statWindow.append("<div class='zError statName'>Stat names not collected yet!</div>");
			statNameError = true;
			visitProfile = true;
		}

		var _selectedStats = localStorage.zStatSelected ? JSON.parse(localStorage.zStatSelected) : {};
		if (_selectedStats["refils"]) {
			_selectedStats["refills"] = _selectedStats["refils"];
			delete _selectedStats["refils"];
		}
		var selectedStats = [];
		for (var stat in _selectedStats) {
			if (_selectedStats[stat]) {
				selectedStats.push(stat);
			}
		}
		if (!selectedStats.length) {
			statWindow.append("<div class='zError'>No stats selected!</div>");
			visitProfile = true;
			fatalError = true;
		}

		if (visitProfile) {
			statWindow.append("<div>Please go to a <a href='/personalstats.php'>personal stats page</a>.</div>");
		}
		if (fatalError) {
			$(".zStatTemp", statWindow).remove();
			return;
		}

		fetchUserStats(function(stats) {
			$(".zStatTemp", statWindow).remove();
			if (statNames && statNameError) {
				$(".zError.statName").remove();
				statNameError = false;
			}

			var statTable = $(".zStatTable>tbody").empty();
			if (!statTable.length) statTable = $("<table class='zStatTable'><tbody></tbody></table>").appendTo(statWindow).children("tbody");
			for (var i=0;i<selectedStats.length;i++) {
				var stat = selectedStats[i];
				var value = stats[stat];
				var name = statNames[stat] || stat;
				$("<tr></tr>").append($("<td></td>").text(name)).append($("<td></td>").css("padding-left", "10px").text(value != null ? Number(value).toLocaleString() : "N/A")).appendTo(statTable);
			}
		}, userId, function(a, b) {
			switch(a) {
				case "old":
					$("<div class='zError'>Failed to load stats!</div>").appendTo(statWindow);
					break;
				case "api":
					if (b.code == 2) {
						// Incorrect API key
						$("<div class='zError'>Incorrect API key...</div>").appendTo(statWindow);
					} else {
						$("<div class='zError'></div>").text(b.error).appendTo(statWindow);
					}
					break;
			}
		});
	}, pageStats = function() {
		var selectedStats = localStorage.zStatSelected ? JSON.parse(localStorage.zStatSelected) : {};
		if (selectedStats["refils"]) {
			selectedStats["refills"] = selectedStats["refils"];
			delete selectedStats["refils"];
		}
		statNames = {};
		$(".personal-stats>.statistic>.statistic-cont>.statistic-kind").not(".t-hide").children("[data-val]").each(function(i, ele) {
			var name = $(ele).attr("data-val");
			switch(name) {
				// Patch stat names
				case "refils": // Seriously Ched?
					name = "refills";
					break;
			}
			var name2 = $(".name", ele).text().replace(/[:]/g, "");
			statNames[name] = name2;
			var toggle = $("<input type='checkbox' class='zStatToggle'></input>").attr('stat', name).prependTo(ele);
			if (selectedStats[name]) toggle.attr("checked", "");
			toggle.change(function() {
				// selectedStats = localStorage.zStatSelected ? JSON.parse(localStorage.zStatSelected) : {};
				// selectedStats[name] = $(toggle).attr("checked") ? true : false;
				// console.debug(toggle.attr("checked"));
				if (selectedStats[name]) {
					delete selectedStats[name];
				} else {
					selectedStats[name] = true;
				}
				localStorage.zStatSelected = JSON.stringify(selectedStats);
			});
			$(".name", ele).css("margin-left", "4px");
		});
		localStorage.zStatNames = JSON.stringify(statNames);
	};

	switch(location.pathname) {
		case "/profiles.php":
			pageProfile();
			break;
		case "/personalstats.php":
			pageStats();
			break;
		default:
			displayError("Failed to read pathname: "+location.pathname);
	}
});