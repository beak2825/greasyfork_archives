// ==UserScript==
// @name         MyAnimeList Artist Entry Colored Highlighting
// @namespace    https://greasyfork.org/en/users/238602
// @version      2.1
// @description  Highlights shows when accessing an artist entry on the database. The color is chosen based on how the user has marked the show (watching, watched, on-hold, dropped or planned to watch).
// @icon         https://gitlab.com/SergioSantana/mal-highlighter/raw/master/icon.png
// @author       Sekii
// @match        https://myanimelist.net/people/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376552/MyAnimeList%20Artist%20Entry%20Colored%20Highlighting.user.js
// @updateURL https://update.greasyfork.org/scripts/376552/MyAnimeList%20Artist%20Entry%20Colored%20Highlighting.meta.js
// ==/UserScript==

(function() {
	'use strict';
	
	// Colors to highlight each show
	const colors = [
		"", // Unused
		"#A5FA8E",  // Watching = Green
		"#C6CFF9",	// Watched  = Blue
		"#FAF38E",	// On-Hold  = Yellow
		"#FF847C",	// Dropped  = Red
		"",	// Unused
		"#CBCBCB"	// Plan to Watch = Gray
	];

	const Type = {
		ANIME: 'anime',
		MANGA: 'manga'
	}

	var animeStatus; // HashTable containing all anime the user has added to their list
	var mangaStatus; // HashTable containing all manga the user has added to their list

	var tables, userName;
	var hasVoice, hasAnime, hasManga;

	document.onload = init();
	function init() {
		// Get user name
		tables = document.getElementsByTagName("table");
		userName = document.getElementsByClassName("header-profile-link")[0].text;
		
		// Check what we need to highlight
		const allMedia = document.getElementsByTagName("td");
		const htmlString = allMedia[1].innerHTML;
		hasVoice = !htmlString.includes("No voice acting roles have been added to this person.");
		hasAnime = !htmlString.includes("No staff positions have been added to this person.");
		hasManga = !htmlString.includes("No published manga have been added to this person.");
		
		// Highlight anime
		if (hasVoice || hasAnime) {
			animeStatus = checkCache(Type.ANIME);
			if (animeStatus == null) {
				downloadList(Type.ANIME);
			}
			else {
				highlightTitlesByType(Type.ANIME, animeStatus);
			}
		}

		// Highlight manga
		if (hasManga) {
			mangaStatus = checkCache(Type.MANGA);
			if (mangaStatus == null) {
				downloadList(Type.MANGA);
			}
			else {
				highlightTitlesByType(Type.MANGA, mangaStatus);
			}
		}
	}

	function checkCache(type) {
		const stringTime = type + 'Time';
		const stringStatus = type + 'Status';

		const lastTime = localStorage.getItem(stringTime);
		const timeLimit = (Date.now() - 2*60*1000);
		if (lastTime && lastTime > timeLimit) {
			console.log("Using " + type + " data from cache. Wait 2 minutes to update the list.");
			const result = localStorage.getItem(stringStatus);
			return JSON.parse(result);
		}
		
		return null;
	}

	function downloadList(type) {
		console.log("Downloading user's " + type + " list. This may take some time.");
		var status = {};

		const url = 'https://myanimelist.net/' + type + 'list/' + userName + '/load.json?status=7&offset=';
		var offset = 0;
		
		var request = new XMLHttpRequest();
		request.onload = function() {
			var result = JSON.parse(request.responseText);
			for (var i = 0; i < result.length; ++i) {
				var title = result[i][type + "_title"];
				status[title] = result[i].status;
			}
			
			var allParsed = (result.length < 300);
			if (allParsed) {
				localStorage.setItem(type + 'Time',  Date.now());
				localStorage.setItem(type + 'Status', JSON.stringify(status));
				highlightTitlesByType(type, status);
			} else {
				offset = offset + 300;
				request.open("GET", url + offset, true); // async == true
				request.send(null);		
			}
		};
		request.onerror = function() {
			console.log("ERROR: Couldn't fetch user list.");
		};

		request.open("GET", url + offset, true); // async == true
		request.send(null);
	}

	function highlightTitlesByType(type, userList) {
		// Highlight titles
		var nTable = 1;
		if (type == Type.ANIME) {
			if (hasVoice) {
				highlightTitles(nTable, userList);
				++nTable;
			}
			if (hasAnime) {
				highlightTitles(nTable, userList);
			}
		}
		else { // type == Type.MANGA
			if (hasVoice) { ++nTable; }
			if (hasAnime) { ++nTable; }
			highlightTitles(nTable, userList);
		}
	}

	function highlightTitles(numberTable, userList) {
		var contents = tables[numberTable].getElementsByTagName("tr");
		if (contents.length === 0)
			return;
		
		for (var i = 0; i < contents.length; i++) {
			var td = contents[i].getElementsByTagName("td");
			if (td.length === 0)
				continue;
				
			var nameShow = td[1].getElementsByTagName("a");
			var status = userList[nameShow[0].text]
			if (!status)
				continue;
			
			var color = colors[status];
			contents[i].setAttribute("style", "background-color: " + color + ";");
		}
	}
})();