// ==UserScript==
// @name         Replay Details Script
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  shows additional information in replays
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/385654/Replay%20Details%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385654/Replay%20Details%20Script.meta.js
// ==/UserScript==

/**************************
   Replay Details Script
**************************/

(function() {
    window.addEventListener('load', function(){

var repDhold=document.createElement("div");
repDhold.id="repDHolder";
repDhold.style.position="absolute"
repDhold.style.left = (myCanvas.getBoundingClientRect().left - 500) + "px";
repDhold.style.top = (myCanvas.getBoundingClientRect().top + 100) + "px";
document.body.appendChild(repDhold);

var fRepD = '<style>#repDT {border-collapse:collapse;text-align:left}.repD {border:1px solid white;padding:5px}</style><table id="repDT">'

var website = "jstris.jezevec10.com"
var url = window.location.href
var parts = url.split("/")

if(parts[3]=="replay" && parts[2].endsWith(website) && parts[4] != "1v1"){

	var fetchURL = "https://"+parts[2]+"/replay/data?id="+parts[+(L=parts[4]=="live")+4]+"&type="+ +L;
	console.log(fetchURL)
	/*
 	if(parts[4] == "live"){
		fetchURL = "https://"+parts[2]+"/replay/data?id=" + parts[5] + "&type=1"
 	} else {
 		fetchURL = "https://"+parts[2]+"/replay/data?id=" + parts[4] + "&type=0"
 	}
 	*/

	fetch(fetchURL)
		.then(function(response) {
		    return response.json();
		})
		.then(function(jsonResponse) {
			try {
				var keys = Object.keys(jsonResponse.c)
			}
			catch (e) {
				console.log("very old replay, cant execute replay details script")
				keys = []
			}

			for (var i = 0; i < keys.length; i++) {
				var key=keys[i]
				var add=[key,jsonResponse.c[key]]

				if(key=="softDropId"){
					add[1]="Slow9Medium9Fast9Ultra9Instant".split(9)[add[1]]
				}
				if(key=="gameEnd" || key=="gameStart"){
					add[1]=(""+new Date(add[1])).split(" ").splice(0,5)
				}
				if(key=="v"){add[0]="version"}
				if(key=="bs"){add[0]="blockskin id"}
				if(key=="se"){add[0]="sound effects id"}
				if(key=="map"){add[1]="<a href='https://jstris.jezevec10.com/map/"+add[1]+"'>"+add[1]+"</a>"}

				fRepD+=`<tr><td class="repD">${add[0]}</td><td class="repD">${add[1]}</td></tr>`
			}

			repDHolder.innerHTML = fRepD+"</table>"
		});

}

    });
})();