// ==UserScript==
// @name         Exhib Generator
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  This isn't a description.
// @author       ZE
// @include      https://mugen.spriteclub.tv/exhibitions
// @include      https://mugen.spriteclub.tv/characters?division=4
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/40226/Exhib%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/40226/Exhib%20Generator.meta.js
// ==/UserScript==

function genExhib() {
    var redSide = [];
    var i = 0;
    var j = 0;
    var z = 0;
    var templateNum = prompt("Select template number, 1 for Heroes, 2 for Jobbers", 0);
    templateNum = parseInt(templateNum, 10);
	
	
    // Separated double if for accessibility
    if (templateNum === 1) {
	   // PUT EXCLUDED CHARACTER NAMES HERE
       var excludedNames = ["Example","Example2"];
       var names = characterList;
	   for (j = 0; j < excludedNames.length; j += 1) {
           if (names.indexOf(excludedNames[j]) !== -1) {
              names.splice(names.indexOf(excludedNames[j]), 1)
	       }
	   }	   
       // Song Pool
       var songPool = ["Skullgirls - NMO Arena","Rick Derringer - Real American (Theme of WWE's Hulk Hogan)","Jock Jams - Let's Get Ready to Rumble (Space Jam OST)",       "John Cafferty - Hearts on Fire (Rocky IV OST)","Exile - Indestructible (Street Fighter IV OST)","Yuka Tsujiyoko - Rawk Hawk (Paper Mario: The Thousand Year Door OST)"];
       // Stage Pool (EX)
       var stagePool = ["SFV - Ring of Destiny","SFV - Ring of Destiny"];
	   // Fixed Blue
	   var blueSide = ["Bomber Hugo","Bousou-Alex","Clark's Fun Ride","M-Griffon"];
	   // Names
	   var teamNames = ["Our Heroes SFVguile 7","These Randos RTSD"];
	   // Active Turns Mode
	   document.querySelector('#blue-turns').checked = true;
       document.querySelector('#red-turns').checked = true;
	   // Push Random Opponents
       for (z = 0; z < 4; z += 1) {
	       redSide.push(names[Math.floor(Math.random() * (names.length))]);
	   }
    }
    if (templateNum === 2) {
	    // Song Pool (EX)
        var songPool = ["Jin Hashimoto - STAND PROUD (Jojo's Bizarre Adventure: Stardust Crusaders OST)","Jin Hashimoto - STAND PROUD (Jojo's Bizarre Adventure: Stardust Crusaders OST)"];
        // Stage Pool (EX)
		var stagePool = ["JJBA - Clocktower","JJBA - Clocktower"];		
		// Fixed Blue
	    var blueSide = ["Sanic", "Blaze Sman"];
	    // Names
	    var teamNames = ["JOBBERS UNITED","ACROSS THE WORLD"];
		redSide = ["Random 3rd Division","Random 4th Division"];
    }

	// Assign team names
	if (teamNames !== undefined) {
	   document.querySelector('#request-t1').value = teamNames[0];
	   if (teamNames[1] !== undefined) document.querySelector('#request-t2').value = teamNames[1];
	}
	
	// Assign Fixed Blue
	// Always at least 1 character
    document.querySelector('input#request-p1').value = blueSide[0];
	if (blueSide[1] !== undefined) document.querySelector('input#request-p3').value = blueSide[1];
	if (blueSide[2] !== undefined) document.querySelector('input#request-p5').value = blueSide[2];
	if (blueSide[3] !== undefined) document.querySelector('input#request-p7').value = blueSide[3];
		 
	// Red Side
	// Always at least 1 character
    document.querySelector('input#request-p2').value = redSide[0];
    if (redSide[1] !== undefined) document.querySelector('input#request-p4').value = redSide[1]
    if (redSide[2] !== undefined) document.querySelector('input#request-p6').value = redSide[2]
	if (redSide[3] !== undefined) document.querySelector('input#request-p8').value = redSide[3]

    // Song Choice (Random)
    document.querySelector('#request-track').value = songPool[Math.floor(Math.random() * songPool.length)];
    // Stage Random
    document.querySelector('#request-stage').value = stagePool[Math.floor(Math.random() * stagePool.length)];
	
}


if (window.location.href === "https://mugen.spriteclub.tv/exhibitions") {
    if (GM_getValue("characterList") === undefined) {
    GM_setValue("characterList", "[]");
    }
    unsafeWindow.characterList = JSON.parse(GM_getValue("characterList"));
	
    var genExhibButton = document.createElement('button');
    genExhibButton.textContent = "Generate Exhib";
    genExhibButton.style = "width:100px; height:40px; color:black; font-size:12px; margin-left:50px";
    genExhibButton.onclick = genExhib;
    document.querySelector('div.flex-row:nth-child(6)').appendChild(genExhibButton);
} else {
    var statElem = Array.from(document.querySelectorAll('.stat-elem'));
    var names = [];
    var currName = "";
    for (i = 0; i < statElem.length; i += 1 ) {
        currName = statElem[i].querySelector('.characters-name').textContent
        names.push(currName)
    }
    GM_setValue("characterList", JSON.stringify(names));
}

