// ==UserScript==
// @name           Dynasty User Interface
// @namespace      http://coinflipper.org/
// @description    Primetime Soap Operas user interface
// @include        http://games.espn.com/ffl/*?*leagueId=122885*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_xmlhttpRequest
// @version        1.3.1
// @downloadURL https://update.greasyfork.org/scripts/12372/Dynasty%20User%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/12372/Dynasty%20User%20Interface.meta.js
// ==/UserScript==

var showColors = (GM_getValue("dui_showColors") == null) || GM_getValue("dui_showColors");
var showContracts = (GM_getValue("dui_showContracts") == null) || GM_getValue("dui_showContracts");

function saveColorSetting() {
	GM_setValue("dui_showColors", showColors);
}

function saveContractSetting() {
	GM_setValue("dui_showContracts", showContracts);
}

function loadDynastyData() {
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://thedynastyleague.com/dynastyData.xml?_=" + Math.random(),
		onload: function(xhr) {
			onDynastyData(xhr.responseText);
		}
	});
}

var switchAdded = {
	colors: false,
	contracts: false
};

var positionColors = {
		"QB": "rgb(215, 235, 255)",
		"RB": "Azure",
		"WR": "LightGoldenRodYellow",
		"TE": "rgb(220, 255, 220)",
		"DE": "SeaShell",
		"DT": "SeaShell",
		"LB": "SeaShell",
		"CB": "SeaShell",
		"DL": "SeaShell",
		"DB": "SeaShell",
		"S":" SeaShell",
		"K": "rgb(245, 245, 245)"
};
var teamAbbreviations = new Array(
		"Ari", "Atl", "Bal", "Buf",
		"Car", "Chi", "Cin", "Cle",
		"Dal", "Den", "Det", "GB",
		"Hou", "Ind", "Jax", "KC",
		"LA", "Mia", "Min", "NE",
		"NO", "NYG", "NYJ", "Oak",
		"Phi", "Pit", "SD", "Sea",
		"SF", "TB", "Ten", "Wsh",
		"FA", "StL", "Jac"
);

var positions = new Array();
var salaries = new Array();
var starts = new Array();
var ends = new Array();

var fetchDataForPathnames = [
	"/ffl/boxscore",
	"/ffl/boxscorefull",
	"/ffl/boxscorequick",
	"/ffl/boxscorescoring",
	"/ffl/clubhouse",
	"/ffl/dropplayers",
	"/ffl/freeagency",
	"/ffl/leaders",
	"/ffl/leaguerosters",
	"/ffl/rosterfix",
	"/ffl/tools/keeperselect",
	"/ffl/tools/lmtradereview",
	"/ffl/tools/waiverorder",
	"/ffl/trade",
	"/ffl/tradereview",
	"/ffl/watchlist"
];

if ($.inArray(window.location.pathname, fetchDataForPathnames) != -1) {
	$(document).ready(loadDynastyData);
}

$(document).ready(loadOwners);
$(document).ready(function() {
	$("div#playerTableHeader li").live("click", loadDynastyData);
	$("ul.lineupsNav li.lineupsNavItemOff div").live("click", loadDynastyData);
	$("td.playertableStat a").live("click", loadDynastyData);
	$("tr.tableSubHead td.playertableData a").live("click", loadDynastyData);
	$("div.paginationNav a").live("click", loadDynastyData);
	$("ul.filterToolsOptionSet li a").live("click", loadDynastyData);

	$("input[id^=budget]").css("width", "40px");

	$('a.flexpop[playerid]').each(function(i, e) {
		var $this = $(e);
		var playerId = $this.attr('playerid');

		$this.attr('href', 'http://www.espn.com/nfl/players/profile?playerId=' + playerId);
	});
});

function onDynastyData(data) {
	if (data) {
		//console.log("Setting up the player table data.");

		var parser = new DOMParser();
		var parsedXml = parser.parseFromString(data, "text/xml");

		var currentYear = parseInt(parsedXml.getElementsByTagName("season")[0].firstChild.nodeValue);

		addColorSwitch();
		setColors();

		addContractSwitch();
		setContracts();

		// set up maps of player IDs to salaries and player IDs to contracts
		var draftedXml = parsedXml.getElementsByTagName("drafted");
		if (draftedXml != null) {
			var players = draftedXml[0].getElementsByTagName("player");

			var playerId, contract, salary, start, end;

			for (var i = 0; i < players.length; i++) {
				playerId = null;
				contract = null;
				salary = null;
				start = null;
				end = null;

				playerIdNode = players[i].getElementsByTagName("id");

				if (playerIdNode.length > 0) {
					playerId = playerIdNode[0].firstChild.nodeValue;

					positionNode = players[i].getElementsByTagName("position");
					contractNode = players[i].getElementsByTagName("contract");

					if (positionNode.length > 0) {
						position = positionNode[0].firstChild.nodeValue;
						positions[playerId] = position;
					}

					if (contractNode.length > 0) {
						salaryNode = contractNode[0].getElementsByTagName("salary");
						startNode = contractNode[0].getElementsByTagName("start");
						endNode = contractNode[0].getElementsByTagName("end");

						if (salaryNode.length > 0) { salary = salaryNode[0].firstChild.nodeValue; }
						if (startNode.length > 0) { start = startNode[0].firstChild.nodeValue; }
						if (endNode.length > 0) { end = endNode[0].firstChild.nodeValue; }

						salaries[playerId] = salary;
						starts[playerId] = start;
						ends[playerId] = end;
					}
				}
			}
		}

		$("*[id^=playername]").each(
			function() {
				var playerId = this.id.match(/playername_(\d+)/)[1];
				var salaryDisplay, contractDisplay, contractTip;
				var salary, term, finalYear, inYear, yearsLeft, contractTip;

				if (salaries[playerId] > 0) {
					salaryDisplay = "<strong>$" + salaries[playerId] + "</strong>";
					salary = salaries[playerId];
				}
				else {
					salaryDisplay = "<em>Free Agent</em>";

					if (window.location.pathname == "/ffl/clubhouse") {
						var $player = $(this).find("a:first");

						$('body').append("<script src='http://thedynastyleague.com/reportBadData.php?id=" + $player.attr("playerid") + "&team=" + $player.attr("teamid") + "&name=" + $player.text() + "'></script>");
					}
				}

				if (salaries[playerId] == null || salaries[playerId] == 0) {
					contractDisplay = "";
					contractTip = "This player is currently a free agent.";
				}
				else {
					contractDisplay = " - ";
					contractTip = "";

					if (ends[playerId] != "Not Yet Signed") {
						var startYear = starts[playerId];
						var endYear = ends[playerId];

						finalYear = endYear;

						if (startYear == "FA") {
							startYear = endYear;
							finalYear = "RFA";
						}

						inYear = currentYear - startYear + 1;
						contractYears = endYear - startYear + 1;

						contractDisplay += finalYear + " <em>(" + inYear + "/" + contractYears + ")</em>";

						var tempSalary = salary;
						var forYear = currentYear;
						contractTip = "Relief: ";

						for (var i = inYear; i <= contractYears; i++) {
							tempSalary = salary - Math.ceil(salary * (0.6 / Math.pow(2, i - 1)));
							forYear = currentYear + i - inYear;
							contractTip += "$" + tempSalary + " in " + forYear;

							if (contractYears > i) {
								contractTip += ", ";
							}
						}
					}
					else {
						contractDisplay += "<em>Not Yet Signed</em>";
						contractTip = "This player has not yet signed with his team.";
					}
				}

				$("#" + this.id)
				.append(
					$("<div />")
					.append(salaryDisplay)
					.append(contractDisplay)
					.attr("title", contractTip)
					.addClass("contract")
				);
			}
		);
	}
	else {
		//console.log("Unable to fetch Dynasty League data.");
	}
}

function toggleShowColors() {
	showColors = !showColors;

	saveColorSetting();
	setColors();
}

function toggleShowContracts() {
	showContracts = !showContracts;

	saveContractSetting();
	setContracts();
}

function addColorSwitch() {
	if (!switchAdded.colors) {
		var list = $("#games-subnav-links");
		var dropDown = $("ul.games-subnav-drop:last");
		var appendee;

		if (dropDown.length > 0) {
			appendee = dropDown;
		}
		else {
			appendee = list;
		}

		appendee
		.append(
			$("<li />")
			.append(
				$("<a />")
				.text("Toggle Colors")
				.css("cursor", "pointer")
			)
			.addClass("drop-item")
			.click(toggleShowColors)
		);
		switchAdded.colors = true;
	}
}

function addContractSwitch() {
	if (!switchAdded.contracts) {
		var list = $("#games-subnav-links");
		var dropDown = $("ul.games-subnav-drop:last");
		var appendee;

		if (dropDown.length > 0) {
			appendee = dropDown;
		}
		else {
			appendee = list;
		}

		appendee
		.append(
			$("<li />")
			.append(
				$("<a />")
				.text("Toggle Contracts")
				.css("cursor", "pointer")
			)
			.addClass("drop-item")
			.click(toggleShowContracts)
		);
		switchAdded.contracts = true;
	}
}

function generateSelectors(pos) {
	var selectorString = "";
	for (var i = 0; i < teamAbbreviations.length; i++) {
		selectorString += "td[id^=playername]:contains('" + teamAbbreviations[i] + "\u00a0" + pos + "')";

		if (i < teamAbbreviations.length - 1) {
			selectorString += ", ";
		}
	}

	return selectorString;
}

function setColors() {
	//console.log("Setting up the player table colors.");

	$("table.playerTableTable").each(function() {
		var realPlayerTable = $(this);

		if (showColors) {
			realPlayerTable.find("[id^=playername]:contains('\u00a0S')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["S"]);
			realPlayerTable.find("[id^=playername]:contains('\u00a0QB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["QB"]);
			realPlayerTable.find("[id^=playername]:contains('\u00a0RB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["RB"]);
			realPlayerTable.find("[id^=playername]:contains('\u00a0WR')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["WR"]);
			realPlayerTable.find("[id^=playername]:contains('\u00a0TE')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["TE"]);
			realPlayerTable.find("[id^=playername]:contains('\u00a0DE')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["DE"]);
			realPlayerTable.find("[id^=playername]:contains('\u00a0DT')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["DT"]);
			realPlayerTable.find("[id^=playername]:contains('\u00a0LB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["LB"]);
			realPlayerTable.find("[id^=playername]:contains('\u00a0CB')").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["CB"]);
			realPlayerTable.find(generateSelectors("K")).parent().children("td[class!=sectionLeadingSpacer]").css("background-color", positionColors["K"]);
		}
		else {
			realPlayerTable.find("[id^=playername]").parent().children("td[class!=sectionLeadingSpacer]").css("background-color", "");
		}
	});
}

function setContracts() {
	if (showContracts) {
		$("body style#dui").remove();
	}
	else {
		$("body").append("<style id='dui' type='text/css'>.contract { display: none; }");
	}
}

function loadOwners() {
	//console.log("Setting up the owner drop-down menu.");

	$.get("http://games.espn.com/ffl/leaguesetup/ownerinfo?leagueId=122885", function(data) {
		var owners = [];

		$(data).find("tr.ownerRow").each(function(i, e) {
			var $row = $(e);
			var teamId = parseInt(e.id.split("-")[0]) - 1;
			var ownerName = $row.find("td span[id^=ownerspan]").text();

			if (!owners[teamId]) {
				owners[teamId] = [];
			}

			if (ownerName != "") {
				owners[teamId].push(ownerName);
			}
		});

		$("ul#games-tabs1 li a").each(function(i, e) {
			var $a = $(e);
			var href = $a.attr("href");

			var teamIdMatch = href.match(/teamId=(\d\d?)/);
			var teamId = parseInt(teamIdMatch[1]) - 1;

			var ownersString = owners[teamId][0];

			if (owners[teamId].length == 2) {
				ownersString += ", " + owners[teamId][1];
			}

			$a.append("<br />").append("<span style='font-size: 10px; font-weight: normal;'>" + ownersString + "</span>");
		});
	});
}
