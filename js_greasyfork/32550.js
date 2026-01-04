// ==UserScript==
// @name         Lyrania: Auto Dungeon
// @namespace    http://tampermonkey.net/
// @version      2017.11.12.1
// @description  Automate dungeons
// @author       Amraki
// @match        https://lyrania.co.uk/game.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32550/Lyrania%3A%20Auto%20Dungeon.user.js
// @updateURL https://update.greasyfork.org/scripts/32550/Lyrania%3A%20Auto%20Dungeon.meta.js
// ==/UserScript==

// Storage
if (!localStorage.personalClearedRooms) { localStorage.personalClearedRooms = []; }
if (!localStorage.personalClearedCount) { localStorage.personalClearedCount = 0; }
if (!localStorage.guildClearedRooms) { localStorage.guildClearedRooms = []; }
if (!localStorage.guildClearedCount) { localStorage.guildClearedCount = 0; }

// Global variables
var clearedRooms = [];
var needsColor = false;
var selectedRoom = ""; // current room number
var mapType = "";
var prevMapType = "";
var canInk = "";
var exit = "";
var userName = $("[href*='javascript:profile']")[0].innerText;
var maxKillsPerRoom = 9;
var mobsKilled = 0;
var delayShort = 3; // time to wait after fighting in dungeon
var delayLong = 15; // time to wait after defeating 'maxKillsPerRoom' or changing rooms

$(document).ready(function() {
    'use strict';

	$("#side1").append('<br><div style="padding-left:5px;">' +
		'<div>Dungeon: <button id="btnDungeon" value="Pause">Pause</button></div>'
	);

	// Add start/stop button
	$("#btnDungeon").click(function() {
		var value = (this.textContent == "Pause") ? "Resume" : "Pause";

		this.textContent = value;
		this.value = value;
	});

	// Actions that should be handled quickly
	setInterval(function() {
		// Obey toggle setting
		if ($("#btnDungeon")[0].getAttribute("value") != "Pause") {
			return;
		}

		// Don't waste time sending action if it can't go through anyway
		if ($("#timer")[0].length > 0 && $("#timer")[0].innerText != "Action Timer: 0") {
			return;
		}

		var actions = ['Continue'];
		for (var index = 0; index < actions.length; index++) {
			if ($("input[value='" + actions[index] + "']").length > 0) {
				$("input[value='" + actions[index] + "']").click();
				return;
			}
		}
	}, 2.5 * 1000);

	// 
	dungeon();
});

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

	for (var word = 0; word < words.length; word++) {
		if (string.toLowerCase().indexOf(words[word].toLowerCase()) == -1) {
			return false;
		}
	}
	return true;
}

function uniqueArray(arrArg) {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function delayFunction(func, mode) {
	if (mode == 'short') {
		seconds = getRandomInt(delayShort, delayShort + getRandomInt(0, 4));
	} else {
		seconds = getRandomInt(delayShort, delayShort + getRandomInt(0, 4));
	}

	if (seconds < 3) {
		//console.log(mode + " delay: " + seconds);
		seconds = getRandomInt(3, 6);
	}

	setTimeout(func, seconds * 1000);
}

function resetDungeonArray() {
	if (clearedRooms.length) {
		console.log("Resetting dungeon array: " + clearedRooms);
		clearedRooms = [];
		localStorage.setItem(mapType + "ClearedRooms", []);
		localStorage.setItem(mapType + "ClearedCount", 0);
	}
}

function dungeon() {
	// Obey toggle setting
	if ($("#btnDungeon")[0].getAttribute("value") != "Pause") {
		//console.log("User has disabled auto dungeons");
		setTimeout(dungeon, 5000);
		return;
	}

	// Don't continue if not in a dungeon
	if ($("#content > div > b").length === 0 || $("#content > div > b")[0].innerText.indexOf("DUNGEON!") === -1) {
		//console.log("Not in a dungeon");
		setTimeout(dungeon, 5000);
		return;
	}

	// Guild or personal dungeon
	if (mapType) { prevMapType = mapType; }
	mapType = $("a[href*='gdungeon']").length > 0 ? "guild" : "personal";

	// Reset array when dungeon type changes
	if (mapType !== prevMapType) {
	    var savedRoomsList = localStorage.getItem(mapType + "ClearedRooms").split(',');
		clearedRooms = (savedRoomsList.length > 1) ? savedRoomsList : [];
		console.log("Map changed: " + prevMapType + " -> " + mapType);
		console.log("Importing: " + clearedRooms);
	}

	if ($("#leftinfo").length > 0) {
		// Don't waste time if dungeon is complete
		if ($("#leftinfo")[0].innerText.indexOf("Percentage done: 100") > -1) {
			// Go to exit room
			if (exit !== "" && !$("input[value='Complete Dungeon']").length) {
				exit = Number(exit);
				console.log("warp to exit: " + exit);
				if (mapType == "personal") {
					setTimeout(function() { window.dungeon(1, exit); }, 2500);
				} else {
					setTimeout(function() { window.gdungeon(10); }, 2500);
				}
			}

			resetDungeonArray();
			delayFunction(dungeon, 'short');
			return;
		}

		// Map change check
		if (Number($("#leftinfo")[0].innerText.match(/cleared: (\d+)/)[1]) < Number(localStorage.getItem(mapType + "ClearedCount"))) {
			resetDungeonArray();
		}

		// Used elsewhere to determine if new map has been started
		localStorage.setItem(mapType + "ClearedCount", $("#leftinfo")[0].innerText.match(/cleared: (\d+)/i)[1]);
	} else {
		delayFunction(dungeon, 'short');
		return;
	}

	// Is ink available
	canInk = ($("input[value='Use Ink']").length > 0) ? true : false;

	// Indicate nearby rooms that have been cleared (NOTE: only shows for user and until window is refreshed)
	if (!canInk) {
		$("a[href*='dungeon']").each(function(index, val) {
			var room = val.toString().match(/,([\d]+)/)[1];
			if (clearedRooms.includes(room)) {
				$("a[href*='" + room + "']").parent().css('border-color', 'white');
			}
		});
	}

	// Loot room
	if ($("input[value='Investigate']").length > 0) {
		$("input[value='Investigate']")[0].click();
		needsColor = true;
		delayFunction(dungeon, 'long');
		return;
	}

	// Fight room enemy
	if ($("input[value='Fight']").length > 0) {
		//console.log("mobs killed: " + mobsKilled + " | remaining: " + $('#rightinfo')[0].textContent.match(/(\d)+/)[0]);
		$("input[value='Fight']")[0].click();
		needsColor = true;
		mobsKilled++;

		// Fight delay
		if (mobsKilled >= getRandomInt(maxKillsPerRoom - 2, maxKillsPerRoom + 1)) {
			mobsKilled = 0;
			console.log('Fight delay');
			delayFunction(dungeon, 'long');
		} else {
			delayFunction(dungeon, 'short');
		}

		return;
	}

	// Ink cleared room before moving on
	if (canInk && needsColor) {
		$("#inkcolour").val("FFFFFF").change();
		if ($("#inkcolour").val() === "FFFFFF") {
			$("input[value='Use Ink']").click();
			needsColor = false;
		}
	}

	// Add previous room to cleared list
	if (selectedRoom && !clearedRooms.includes(selectedRoom)) {
		clearedRooms.push(selectedRoom);
		clearedRooms = uniqueArray(clearedRooms); // remove duplicate entries
		localStorage.setItem(mapType + "ClearedRooms", clearedRooms);
		console.log("cleared room: " + selectedRoom + ". total cleared: " + clearedRooms.length);
	}

	if ($("input[value='Complete Dungeon']").length) {
		exit = selectedRoom;
	}

	// Look for another room
	var numAvailRooms = $("a[href*='dungeon']").length;
	if (numAvailRooms === 0) {
		console.log("No rooms found");
		delayFunction(dungeon, 'short');
		return;
	}

	// Room condition: not yet colored
	$("a[href*='dungeon']").each(function(index, val) {
		//console.log("* index: " + index + ", val: " + val);
		selectedRoom = val.toString().match(/,([\d]+)/)[1];
		//console.log("room number: " + selectedRoom);

		if ($(this).parent().css("border-color") == "rgb(0, 0, 0)") {
			needsColor = true;
			$("a[href*='dungeon']")[index].click();
			return false;
		} else {
			selectedRoom = "";
		}
	});

	// Room condition: not yet cleared by user
	if (selectedRoom === "") {
		$("a[href*='dungeon']").each(function(index, val) {
			//console.log("index: " + index + ", val: " + val);
			selectedRoom = val.toString().match(/,([\d]+)/)[1];
			//console.log("room number: " + selectedRoom);

			if (!clearedRooms.includes(selectedRoom)) {
				$("a[href*='dungeon']")[index].click();
				return false;
			} else {
				selectedRoom = "";
			}
		});
	}

	// No conditions met, choose random room
	if (selectedRoom === "") {
		console.log("all nearby rooms cleared. selecting one randomly");
		var rndmRoomIndex = getRandomInt(0, numAvailRooms);
		selectedRoom = $("a[href*='dungeon']:eq(" + rndmRoomIndex + ")").attr("href").match(/,([\d]+)/)[1];
		$("a[href*='dungeon']")[rndmRoomIndex].click();
	}

	// Change rooms
	var changedRooms = false;
	var actions = ['Go Here', 'Accept Challenge'];
	for (var index = 0; index < actions.length; index++) {
		if ($("input[value='" + actions[index] + "']").length > 0) {
			$("input[value='" + actions[index] + "']").click();
			changedRooms = true;
			break;
		}
	}

	if (changedRooms) {
		console.log("changed room");
		mobsKilled = 0;
		delayFunction(dungeon, 'long');
		return;
	}

	// Repeat function
	delayFunction(dungeon, 'short');
}