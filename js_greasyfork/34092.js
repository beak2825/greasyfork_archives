// ==UserScript==
// @name         Lyrania: QoL
// @namespace    http://tampermonkey.net/
// @version      2017.11.22
// @description  chat filter and highlighter (and probably more by now)
// @author       Amraki
// @match        https://lyrania.co.uk/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34092/Lyrania%3A%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/34092/Lyrania%3A%20QoL.meta.js
// ==/UserScript==

// Global variables
/* Chat */
var userName = $("[href*='javascript:profile']")[0].innerText;
var guildName = "";
var gMembers = [];
/* WIP: Average money/xp */
var recentMoney = [];
var recentXP = [];

$(document).ready(function() {
    'use strict';

	// Initialize config
	window.navChange = function() { navChange(); };
	initConfig();

	// Toggle equipment list and (up/down)grade options
	modifyEquipmentLayout();

	// Add area to show user info
	$('#side2').append('<div id="log" style="font-size:12px;"></div>');

	// Change chat background color for better message highlighting
	$("#chatwindow").css("background-color", "rgb(102, 102, 102)");
	$("#chatwindow").css("background-image", "url(../images/DarkWood/chatbg.jpg)");

	// Save list of guild members
	getGuildMembers();

	// Loop checking for new chat messages
	chatObserver();

	// Loop averaging battle gains
	//setInterval(updateAverages, 2000);

	// Loop to show equipped jewelry totals
	setInterval(showJewelryTotals, 1000);

	// Setup area to show user drop/loot info
	initUserLog();

	// Add to existing functions
	modifyFunctions();

	// Make close button stay in top right while scrolling
	$('#popupholder > span').css("position", "fixed");
	$('#popupholder > span').css("left", Number($('#popupholder').css("width").replace("px", "")) - 15 + "px");
});

function initUserLog() {

	// Properties for scroll bar
	$('#side2').css("overflow-y", "hidden");
	$('#log').css("overflow-y", "auto");
	$('#log').css("overflow-x", "hidden");
	$('#log').css("max-height", Number($('#side2').css("height").replace("px", "")) / 2 - 20 + "px");

	// Dungeon room loot
	$(document).on("click", "input[value='Investigate']", function(){
		setTimeout(function() {
			if ($('#rightinfo').length === 0) { return; }
			let loot = $('#rightinfo')[0].textContent;
			if (loot.match(/:(.*)/)) {
				loot = loot.match(/:(.*)/)[1];
				if (loot.match(/([a-zA-Z])(\d)/)) {
					loot = loot.replace(/([a-zA-Z])(\d)/g, '$1, $2');
				}
			} else if (loot.indexOf("shiny copper") > -1) {
				loot = "shiny copper";
			}else if (loot.indexOf("glowing orb") > -1) {
				loot = "glowing orb";
			} else if (loot.indexOf("doesn't appear to be anything") > -1) {
				// Empty room
				return;
			}

			// log find
			log("map: " + loot);
		}, 1000);
	});

	// Boss loot
	$(document).on("click", "input[value='Loot']", function(){
		var regex = /hands you (.*) in exchange/;
		var regex2 = /you\sfind\sa\s(.*)!/;

		setTimeout(function() {
			if ($('#content > p').length === 0) { return; }
			let loot = $('#content > p')[0].textContent;
			if (loot.match(regex)) {
				loot = loot.match(regex)[1];
			} else if (loot.match(regex2)) {
				loot = loot.match(regex2)[1];
			} else if (loot.indexOf("refuse to pay") > -1) {
				// No contract & no loot
				return;
			}

			// log formatted loot
			log("boss: " + loot);
		}, 1000);
	});

	// Global drop
	var banner_default = window.banner;
	window.banner = function(drop) {
		console.log("drop: " + drop);

		// Default banner function actions
		banner_default(drop);

		// Don't log dungeon map completion text
		if (drop.indexOf("table") > -1) {
			return;
		}

		if (drop.indexOf("gained") > -1) {
			drop = drop.match(/gained\s(.*)!/)[1];
		} else if (drop.indexOf("found") > -1) {
			// remove 'level bonus' text
			if (drop.indexOf("level bonus") > -1) {
				drop = drop.replace(/\slevel\sbonus/, "");
			}
			if (drop.match(/of\s(.*\))!?/)) {
				drop = drop.match(/of\s(.*\))!?/)[1];
			}
			if (drop.match(/found\sa\s(.*\))/)) {
				drop = drop.match(/found\sa\s(.*\))/)[1];
			}
		}

		// Remove extra text before logging
		var remove = ["!", "few ", "single "];
		for (let i = 0; i < remove.length; i++) {
			if (drop.indexOf(remove[i]) > -1) {
				drop = drop.replace(remove[i], "");
			}
		}

		// Log formatted drop
		log("drop: " + drop);
	};

	// Scratchoff results
	$(document).on("click", "a:contains(\"Scratch\"):contains(\"at random\")", function(){
		setTimeout(function() {
			var loot = $('#content').text().match(/Kiosk(.*)Your Cards/)[1];
			if (!loot) {
				console.log("Results error: " + $('#content').text());
				return;
			}

			// Get winning amount
			if (loot.match(/You won (.*)!/)) {
				loot = loot.match(/You won (.*)!/);
			} else if (loot.indexOf("Better luck next time") > -1) {
				loot = "loss";
			}

			log("gamble: " + loot);
		}, 1000);
	});
}

function chatObserver() {
	// Select the target node to monitor
	var target = document.getElementById('chatwindow');

	// create an observer instance
	// reference: http://www.javascripture.com/MutationRecord
	var MutationObserver = window.MutationObserver;
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			for (var i = 0; i < mutation.addedNodes.length; i++) {
				//console.log("new message: " + mutation.addedNodes[i].textContent);
				examineMessage(mutation.addedNodes[i].textContent);
			}
		});
	});

	// configuration of the observer:
	var config = { attributes: true, childList: true, characterData: true };

	// pass in the target node, as well as the observer options
	try {
		observer.observe(target, config);
	} catch (e) {
		console.log(e);
	}
}

function examineMessage(msg) {

	// Open profile on sender's name click instead of starting whisper
	if (localStorage.QoL_overrideChatname == "Enabled") {
		var playerName = $('span.chatname:eq(0)');
		//console.log(playerName[0].innerText);
		playerName.parent().attr('href', 'javascript:profile("' + playerName[0].innerText + '")');
	}

	// Don't highlight sent messages
	if (msg.indexOf(userName + ": ") > 0) {
		return;
	}

	// Audio alert reminder for contract
	if (localStorage.QoL_alarmContract == "Enabled" && stringIncludes(1, msg, ["inquire about mercenary"])) {
		let typeWriter = new Audio("https://www.freesound.org/data/previews/272/272004_3162775-lq.mp3");
		typeWriter.play();
	}

	// Audio alert when bosses can be attacked
	if (localStorage.QoL_alarmBoss == "Enabled" && stringIncludes(1, msg, ["is attacking", "trapped a boss"])) {
		let typeWriter = new Audio("https://www.freesound.org/data/previews/272/272004_3162775-lq.mp3");
		typeWriter.play();
	}

	// Audio alert when mod whispers (in event player is tabbed out)
	if (stringIncludes(1, msg, ["whisper from"])) {
		if (msg.match(/Whisper from ([\w\d(?: )?]+):/i)[1].indexOf("Mod") === -1) {
			return;
		}

		let typeWriter = new Audio("https://www.freesound.org/data/previews/135/135613_2477074-lq.mp3");
		typeWriter.play();
	}

	// Highlight incoming messages
	if (localStorage.QoL_highlightName == "Enabled" && stringIncludes(1, msg, [userName, "whisper from"])) {
		console.log("highlight match: " + msg);

		var bgColor = "black";
		var textColor = "white";

		// Highlight message
		$("#chatwindow > div:contains('" + msg + "')").css("background-color", bgColor);
		$("#chatwindow > div:contains('" + msg + "')").children().css("color", textColor);
		$("#chatwindow > div:contains('" + msg + "')").css("color", textColor);

		// Return here to avoid removing highlighted message
		return;
	}

	// Hide Global messages not for user or guild members
	if (localStorage.QoL_filterGlobal == "Enabled") {
		filterGlobal(msg);
	}
}

function stringIncludes(mode, string, words) {
	// mode 1: if string contains any of the words
	// otherwise: string must contain all words to return true

	if (mode == 1 || mode == "any") {
		for (var i = 0; i < words.length; i++) {
			if (string.toLowerCase().indexOf(words[i].toLowerCase()) > -1) {
				return true;
			}
		}
		return false;
	}

	for (var i = 0; i < words.length; i++) {
		if (string.toLowerCase().indexOf(words[i].toLowerCase()) == -1) {
			return false;
		}
	}
	return true;
}

function getGuildMembers() {
	// Pull up guild member list
	guildpage(4);

	// Regular expression to obtain member names
	var regEx = /([\w]+)[\s\w-]+ \[/g;
	var data = $("#content")[0].innerText;
	var match = regEx.exec(data);

	// Not on page if no matches so try again
	if (match === null) {
		console.log("No guild members found");
		setTimeout(getGuildMembers, 500);
		return;
	}

	while (match !== null) {
		//console.log(match[1]);

		// Add name to array
		gMembers.push(match[1]);

		// Get next name
		match = regEx.exec(data);
	}

	console.log("Collected " + gMembers.length + " guild member names");

	// Save guild name
	guildName = $('#content > div > b')[0].innerText;

	// Change to 'Battle' tab
	setTimeout(function() {
		$("#mainnav").val("1").change();
	}, 500);
}

function filterGlobal(msg) {
	// Must be a global message if player is in a guild
	if (gMembers.length > 0 && stringIncludes("all", msg, ["global:"])) {
		// Don't hide if informing of jade rain
		if (stringIncludes("all", msg, ["started", "jade rain"])) {
			return;
		}

		// Don't hide new day notices
		if (stringIncludes("any", msg, ["everyone got", "win a", "wins a"])) {
			return;
		}

		// If message contains a guild members name
		if (!stringIncludes("any", msg, gMembers) && !stringIncludes("all", msg, [guildName])) {
			// Ignore purple area boss messages
			if ($("#chatwindow > div:contains('" + msg + "')").children(1).css("color") == "rgb(122, 103, 238)") {
				return;
			}

			//console.log("Hiding " + $("#chatwindow > div:contains('" + msg + "')").length + " match: " + msg);
			$("#chatwindow > div:contains('" + msg + "')").toggle();
		}
	}
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function moneyToString(money) {
    var plat = Math.floor(money / 1000000);
    var gold = Math.floor((money - (plat * 1000000)) / 10000);
    var silver = Math.floor((money - (plat * 1000000) - (gold * 10000)) / 100);
    var copper = Math.floor(money- (plat * 1000000) - (gold * 10000) - (silver * 100));
	var newGold = '';

    if(plat > 0) {
        newGold = plat+'p '+gold+'g '+silver+'s '+copper+'c';
    }
    if(plat === 0 && gold > 0) {
        newGold = gold+'g '+silver+'s '+copper+'c';
    }
    if(plat === 0 && gold === 0 && silver > 0) {
        newGold = silver+'s '+copper+'c';
    }
    if(plat === 0 && gold === 0 && silver === 0) {
        newGold = copper+'c';
    }
    return newGold;
}

function showJewelryTotals() {
	if (!$('a:contains("Load Loadout")').length) { return; }

	if (localStorage.QoL_jewelryStats != "Enabled") {
		return;
	}

	if (!$('#statTotals').length) {
		$('a:contains("Load Loadout")').before('<div id="statTotals"></div>');
		$('#statTotals').css("text-align", "center");
	}

	var stats = ["Health", "Attack", "Defence", "Accuracy", "Evasion"];
	var statTotals = [];

	// Initialize each stat with a total of 0
	for (var i = 0; i < stats.length; i++) {
		statTotals[i] = 0;
	}

	// Get stats from each equipped jewelry
	$('a:contains("[Unequip]")').each(function() {
		var statText = $(this).prev().children().attr("glt_title");

		for (var i = 0; i < stats.length; i++) {
			var regex = new RegExp("(-?\\d+)\\s" + stats[i]);
			if (statText.match(regex) === null) { continue; }
			statTotals[i] += Number(statText.match(regex)[1]);
		}
	});

	// Convert totals to formatted html
	var statHTML = '<b>Jewellery Totals</b>';
	for (let i = 0; i < stats.length; i++) {
		statHTML += '<br>' + stats[i] + ': ' + statTotals[i];
	}

	$('#statTotals')[0].innerHTML = statHTML;
}

function modifyFunctions() {

	// Change "Scratch" to "Scratch All"
	$(document).on("click", "a:contains(\"Consumables\")", function(){
		// Cancel if option is disabled
		 if (localStorage.QoL_multiScratch !== "Enabled" || $('a:contains("Scratch")').length === 0) {
			 return;
		 }

		// Add button
		if (!$('#btnScratchAll').length) {
			$('#inventdiv4').prepend('<div><button id="btnScratchAll">Scratch All</button></div>');
			$('#btnScratchAll').click(function() {
				var maxAttempts = 5;
				var i = 0;

				var intVal = setInterval(function(){
					var clickText = ["Scratch", "Back to Casino"];
					for (var index = 0; index < clickText.length; index++) {
						var button = $('a:contains("' + clickText[index] + '")');
						if (button[0]) {
							button[0].click();
							break;
						}
						if (index == clickText.length - 1) {
							i++;
						}
					}
					if (i == maxAttempts) {
						clearInterval(intVal);
					}
				}, 1000);
			});
		}


	});

}

function log(str) {
	console.log(str); // Show in console as backup
	$('#log').append(str + "<br>"); // Show to user on page
	$('#log')[0].scrollTop = $('#log')[0].scrollHeight; // Scroll down
}

function initConfig() {

	// Settings
	if (!localStorage.QoL_filterGlobal) { localStorage.QoL_filterGlobal = "Enabled"; }
	if (!localStorage.QoL_highlightName) { localStorage.QoL_highlightName = "Enabled"; }
	if (!localStorage.QoL_alarmContract) { localStorage.QoL_alarmContract = "Enabled"; }
	if (!localStorage.QoL_alarmBoss) { localStorage.QoL_alarmBoss = "Enabled"; }
	if (!localStorage.QoL_jewelryStats) { localStorage.QoL_jewelryStats = "Enabled"; }
	if (!localStorage.QoL_overrideChatname) { localStorage.QoL_overrideChatname = "Enabled"; }
	if (!localStorage.QoL_multiScratch) { localStorage.QoL_multiScratch = "Enabled"; }

	// Add new option to dropdown
	if (!$('#mainnav option[value="QoL"]').length) {
		$('#mainnav').append('<option value="QoL">QoL</option>');
		$('#mainnav').attr('onchange', 'navChange()');
	}

}

function navChange() {

	// Use default function if script dropdown option isn't selected
	if ($('#mainnav').val() != 'QoL') {
		return mainnav();
	}

	// Show buttons
	$('#content')[0].innerHTML = '<div style="margin:10px;">' +
		'<div><button id="btnFilterGlobal" value="QoL_filterGlobal">' + localStorage.QoL_filterGlobal + '</button> Show only personal and guild member\'s global messages</div>' +
		'<div><button id="btnHighlightName" value="QoL_highlightName">' + localStorage.QoL_highlightName + '</button> Highlight messages with "' + userName + '"</div>' +
		'<div><button id="btnAlarmContract" value="QoL_alarmContract">' + localStorage.QoL_alarmContract + '</button> Audio alarm for contracts</div>' +
		'<div><button id="btnAlarmBoss" value="QoL_alarmBoss">' + localStorage.QoL_alarmBoss + '</button> Audio alarm for bosses (area and guild)</div>' +
		'<div><button id="btnJewelryStats" value="QoL_jewelryStats">' + localStorage.QoL_jewelryStats + '</button> Show total stats on equipped jewellery</div>' +
		'<div><button id="btnOverrideChatname" value="QoL_overrideChatname">' + localStorage.QoL_overrideChatname + '</button> Show profile instead of whispering when chat name is clicked</div>' +
		'<div><button id="btnMultiScratch" value="QoL_multiScratch">' + localStorage.QoL_multiScratch + '</button> Add button to scratch all cards</div>' +
		'';

	// Toggle button and save setting
	var clickFunction = function(e){
		var value = (this.textContent == "Enabled") ? "Disabled" : "Enabled";
		this.textContent = value;
		localStorage.setItem(e.currentTarget.value, value);
	};

	$('#btnFilterGlobal').click(clickFunction);
	$('#btnHighlightName').click(clickFunction);
	$('#btnAlarmContract').click(clickFunction);
	$('#btnAlarmBoss').click(clickFunction);
	$('#btnJewelryStats').click(clickFunction);
	$('#btnOverrideChatname').click(clickFunction);
	$('#btnMultiScratch').click(clickFunction);

}

function modifyEquipmentLayout() {

	// Move equipment header and bar to prevent hiding
	$('#equipstuff').insertAfter($('#equipment'));
	$('#equipment > h3, hr:eq(0)').each(function() {
		$(this).insertBefore($('#equipment'));
	});
	$('#side2 > h3').css("margin-top", "5px");
	$('#side2 > h3').css("margin-bottom", "5px");

	// Hide equipment list and show (u/d)grade options in its place
	$('a[href*="equip"]').click(function() {
		$('#equipment').hide();
	});

	// Override close button to show equip list
	window.closeequip = function() {
		$('#equipstuff')[0].innerHTML = '';
		$('#equipment').show();
	};
}

function updateAverages() {
	var dataSet = 5; // number of attacks worth of data to keep
	var gains = $('#content')[0].innerText.match(/You gained (.*) and (.*) exp/);
	if (gains !== null) {

		// Determine money gained
		var copper = 0;
		var money = gains[1];
		if (stringIncludes("all", money, ["p"])) {
			copper += Math.floor(money.match(/(\d+)p/)[1]) * 1000000;
		}
		if (stringIncludes("all", money, ["g"])) {
			copper += Math.floor(money.match(/(\d+)g/)[1]) * 10000;
		}
		if (stringIncludes("all", money, ["s"])) {
			copper += Math.floor(money.match(/(\d+)s/)[1]) * 100;
		}
		if (stringIncludes("all", money, ["c"])) {
			copper += Math.floor(money.match(/(\d+)c/)[1]);
		}

		//console.log('extracted: ' + money);
		//console.log('copper: ' + copper);
		//console.log('stringified: ' + moneyToString(copper));

		// Add to money array
		recentMoney.push(copper);
		if (recentMoney.length > dataSet) {
			recentMoney.shift();
		}

		// Determine xp gained
		var xp = Number(gains[2].replace(/\D/, ''));

		// Add to xp array
		recentXP.push(xp);
		if (recentMoney.length > dataSet) {
			recentMoney.shift();
		}
	}

	// Include misses/losses in data
	if (stringIncludes("any", $('#content')[0].innerText, ["You missed", "You were defeated"])) {
		recentMoney.push(0);
		recentXP.push(0);
	}

	// Don't continue to calculate averages or display if not enough data yet
	if (recentMoney.length < dataSet || recentXP.length < dataSet) { return; }

	// Determine average from recent 5 attacks
	var sum = 0;
	for (var index = 0; index < recentMoney.length; index++) {
		sum += recentMoney[index];
	}
	var averageMoney = Math.floor(sum / recentMoney.length);

	sum = 0;
	for (index = 0; index < recentXP.length; index++) {
		sum += recentXP[index];
	}
	var averageXP = Math.floor(sum / recentXP.length);

	// Display averages
	//console.log('average: ' + moneyToString(averageMoney) + ', ' + addCommas(averageXP));
}