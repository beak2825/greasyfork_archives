// ==UserScript==
// @name         Splix Server List
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @description  Open the browser console to see an up-to-date list of Splix.io servers
// @author       unnamed
// @match        http*://splix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388861/Splix%20Server%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/388861/Splix%20Server%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';

	var locCountries = {
		"nyc": "USA",
		"sfo": "USA",
		"tor": "Canada",
		"ams": "Netherlands",
		"fra": "Germany",
		"sgp": "Singapore",
		"blr": "India"
	}

    function printServerList(DATA) {
		console.log("%c" + "Location".padEnd(20, " ") + "%c" + "Normal".padEnd(10, " ") + "%c" + "Team".padEnd(10, " "),
			"color:black; font-weight: bold; background: #FFFFFF; font-size: 130%; font-weight: bold;",
			"color: #0086BF;background: #FFFFFF; font-size: 130%; font-weight: bold;",
			"color: #B152B1;background: #FFFFFF;font-size: 130%; font-weight: bold;");
        for (var l = 0; l < DATA.locations.length; l++) {
			var singleServerName = "Unknown";
			var teamServerName = "Unknown";
			if (DATA.locations[l].loc in locCountries) {
				var locString = DATA.locations[l].loc + " (" + locCountries[DATA.locations[l].loc] + ")";
			}
			else {
				var locString = DATA.locations[l].loc + "";
			}
			locString = locString.padEnd(20, " ");
			try {
				for (var gm = 0; gm < DATA.locations[l].gamemodes.length; gm++) {
					for (var ver = 0; ver < DATA.locations[l].gamemodes[gm].versions.length; ver++) {
						for (var lob = 0; lob < DATA.locations[l].gamemodes[gm].versions[ver].lobbies.length; lob++) {
							if (DATA.locations[l].gamemodes[gm].gm == "default") {
								singleServerName = DATA.locations[l].gamemodes[gm].versions[ver].lobbies[lob].hash;
							}
							else {
								teamServerName = DATA.locations[l].gamemodes[gm].versions[ver].lobbies[lob].hash;
							}
						}
					}
				}
				console.log("%c" + locString + "%c" + singleServerName.padEnd(10, " ") + "%c" + teamServerName.padEnd(10, " "),
					"color:black; font-weight: bold; background: #FFFFFF; font-size: 130%;",
					"color: #0086BF;background: #FFFFFF; font-size: 130%;",
					"color: #B152B1;background: #FFFFFF;font-size: 130%;");
			}
			catch (err) {
				console.log("%c" + locString+ "%c" + "Error",
					"color:black; font-weight: bold; background: #FFFFFF; font-size: 130%;",
					"color: #FF4F4F;background: #FFFFFF;font-size: 130%;");
			}
    	}
	}

	function parse(obj) {
		var DATA = JSON.parse(obj);
		printServerList(DATA);
	}

	var request = new XMLHttpRequest();
	request.open('GET', '/json/servers.2.json');
	request.onloadend = function() {
		parse(request.responseText);
	}
	request.send();

})();