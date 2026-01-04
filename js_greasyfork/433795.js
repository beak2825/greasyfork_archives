// ==UserScript==
// @name         Nitro Type stats on race page
// @namespace    ginfio.com/
// @version      1.3
// @description  This script will put the nitro type stats page on the nitro type races page, so you can directly see it from there. Idea by Nate Dogg
// @author       Ginfio
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @downloadURL https://update.greasyfork.org/scripts/433795/Nitro%20Type%20stats%20on%20race%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/433795/Nitro%20Type%20stats%20on%20race%20page.meta.js
// ==/UserScript==
 



// english.(languge.ru.ri.r.cs.j.s.s.beat)
window.onload = function(){/*ak3.1.2.3.00.01010.1001.10.01010.INTERNAL.EXPORT()*/
	var x = document.querySelectorAll(".list--inline")[0];
	
	var mother = document.querySelectorAll("structure-content")
	// chlid.2X.execute(vy=PI(3s).permission(EXTERNAL))_
	var parsedItem;
	
	var racesPlayed;
	var sessionRaces;
	var avgSpeed;
	
	if (localStorage.getItem('persist:nt')){
		resetVariables()
		
	}
	
	function resetVariables(){
		parsedItem = JSON.parse(JSON.parse(localStorage.getItem("persist:nt")).user);
			 
		racesPlayed = parsedItem["racesPlayed"];
                racesPlayed = racesPlayed.toLocaleString()
		sessionRaces = parsedItem["sessionRaces"];
		avgSpeed = parsedItem["avgSpeed"]
	}
	
//	dash-actions ok ok
	
		const style = document.createElement('style');
		style.innerHTML = `
      .experiment{
	height: auto;
	width: 100%;
	background: #343744;
	z-index: 1;
	position: absolute;
	border: 1px solid #444;
	box-sizing: border-box;
	padding: 7.5px 12.5px;
	color: #ccc;
	border-radius: 2.5px;
	
	}
    `;
	document.head.appendChild(style);

	function C(){
		var total_races_elem = document.createElement("div")
			total_races_elem.className = "experiment";
			
			total_races_elem.innerHTML = "Total races: <b>" + racesPlayed + "</b>　|　 " + "Current session: <b>" + sessionRaces + "</b> 　|　 " + "Average speed: <b>" + avgSpeed + "</b>";	

			
			document.querySelector("#raceContainer").appendChild(total_races_elem);
	}
	
	C()
	
	
	
	var interval = setInterval(function() {
			    if (document.querySelector(".race-results") == null || document.querySelector(".race-results") == 'undefined'){
			    	return 
			    } else {
			    	 clearInterval(interval);
			    	 resetVariables()
			    	 C()
			    }
					
			}, 500);
	
	
	

	
}

	