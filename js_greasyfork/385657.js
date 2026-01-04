// ==UserScript==
// @name         Behind PB Sound Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  plays a warning sound or restarts when you are behind your personal best (PB)
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385657/Behind%20PB%20Sound%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385657/Behind%20PB%20Sound%20Script.meta.js
// ==/UserScript==

/**************************
   Behind PB Sound Script         
**************************/

(function() {
    window.addEventListener('load', function(){

localStorage.pbSound = localStorage.pbSound || "0";
localStorage.mapSound = localStorage.mapSound || "0"
localStorage.soundOrRestart = localStorage.soundOrRestart || "0"

var pbText = "If enabled, the finesse fault sound will played when falling behind your personal best time in sprint, cheese or a map (page refresh required)"
var mapText = "If enabled, the finesse fault sound will play when falling behind the global best time in a map (page refresh required)"

var pbOption = document.createElement("table");
pbOption.innerHTML = '<tbody><tr><td><input onclick="localStorage.pbSound^=1" type="checkbox" id="pbToggle"></td><td><label for="pbToggle">Behind PB sound</label></td></tr><tr><td></td><td><span class="settingsDesc">'+pbText+'</span></td></tr></tbody>'
tab_other.appendChild(pbOption)

var mapOption = document.createElement("table");
mapOption.innerHTML = '<tbody><tr><td><input onclick="localStorage.mapSound^=1" type="checkbox" id="mapToggle"></td><td><label for="mapToggle">Behind map record sound</label></td></tr><tr><td></td><td><span class="settingsDesc">'+mapText+'</span></td></tr></tbody>'
tab_other.appendChild(mapOption)

var sorOption = document.createElement("table");
sorOption.innerHTML = '<tbody><tr><td><input onclick="localStorage.soundOrRestart^=1" type="checkbox" id="sorToggle"></td><td><label for="sorToggle">Restart instead of playing sound</label></td></tr><tr><td></td></tr></tbody>'
tab_other.appendChild(sorOption)

pbToggle.checked = +localStorage.pbSound
mapToggle.checked = +localStorage.mapSound
sorToggle.checked = +localStorage.soundOrRestart


Game['prototype']['isBannedStartSequence'] = function() {
	localStorage.k9 = this["Settings"]["controls"][8]
    return 2<=this.queue.length&&1===this.isPmode(!1)&&(5<=this.queue[0].id||1===this.queue[0].id&&5<=this.queue[1].id);
};

if(+localStorage.pbSound || +localStorage.mapSound){

	Game["doRestart"] = function() {
		document.dispatchEvent(new KeyboardEvent("keydown",{keyCode:localStorage.k9}))
	}

	var globalBest;
	var personalBest;
	var oldTimerValue = 0.00;
	var currentTimerValue = 0.00;
	var username = document.getElementsByClassName("navbar-right")[0].children[0].children[0].innerText.slice(0,-1)
	var website = "https://jstris.jezevec10.com/"
	var snd = new Audio(website + "res/se0/fault.wav");

	var url = window.location.href
	var parts = /.*\=(\d)&(.*)\=(\d+)/g.exec(url)
	var leaderboardUrl = website;


	if(parts[2] == "map") {
		leaderboardUrl += "map/" + parts[3]
	} else if(parts[2] == "mode") {
		if(parts[1] == 1) {
			leaderboardUrl += "sprint?display=4&lines="+[,40,20,100,1000][parts[3]]+"L"
		} else if(parts[1] == 3) {
			leaderboardUrl += "cheese?display=4&lines="+[,10,18,100][parts[3]]+"L"
		}
	}

	if(leaderboardUrl != website) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {

			globalBest = Infinity
			personalBest = Infinity

			var tableEntries = this.responseXML.getElementsByClassName("table")[0].children[1].children

			for (var i = 0; i < tableEntries.length-1; i++) {
				var row = tableEntries[i].innerText.replace(/ /g,"").split("\n")
				if(i==0){globalBest = timeStringToMs(row[7])}
				if(row[4] == username){personalBest = timeStringToMs(row[7])}
			}

			window.setInterval(()=>{

				oldTimerValue = currentTimerValue
				currentTimerValue = timeStringToMs(clock.innerText);

				var personalSurpassed = (oldTimerValue <= personalBest) && (currentTimerValue >= personalBest)
				var globalSurpassed = (oldTimerValue <= globalBest) && (currentTimerValue >= globalBest)

				
					if(parts[2] == "map"){
						if(+localStorage.pbSound)
							personalSurpassed&&(+localStorage.soundOrRestart?Game["doRestart"]():snd.play())
						if(+localStorage.mapSound)
							globalSurpassed&&(+localStorage.soundOrRestart?Game["doRestart"]():snd.play())
					} else {
						if(+localStorage.pbSound)
							globalSurpassed&&(+localStorage.soundOrRestart?Game["doRestart"]():snd.play())
					}
				

			}, 200);

		}
		xhr.open("GET", leaderboardUrl);
		xhr.responseType = "document";
		xhr.send();
	}
}


function timeStringToMs(s) {
	var totalTime=0,parts;~s.indexOf(":")&&(parts=s.split(":"),totalTime+=6E4*parts[0],s=parts[1].slice(0));
	~s.indexOf(".")&&(parts=s.split("."),totalTime+=+(parts[1]+"00").substr(0,3),s=parts[0].slice(0));
	return(totalTime+1E3*s);
}

    });
})();