// ==UserScript==
// @name         Busca Minuciosa
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Ativa a busca minuciosa em loop 
// @author       Miguel Dinis
// @match        http://*/*
// @grant        none
// @include      http*://*.tribalwars.com.pt/*
// @downloadURL https://update.greasyfork.org/scripts/394891/Busca%20Minuciosa.user.js
// @updateURL https://update.greasyfork.org/scripts/394891/Busca%20Minuciosa.meta.js
// ==/UserScript==

var loop;
var timeEachScavenge = 10000; // in ms
var counter = 0;
var counterCap = 1;

(function() {
    'use strict';

    // checkbox
    if (checkPage("mode", "scavenge")) {
		
		
        var d = document.getElementById("content_value");
		
        var cb = document.createElement("input");
        cb.id = "cb";
        cb.type = "checkbox";
		cb.onchange = function() { setHours(); };
		
		var hoursInput = document.createElement("input");
		hoursInput.id = "hoursInput";
		hoursInput.type = "number";
		
		var spanHours = document.createElement("span");
		spanHours.id = "spanHours";
		spanHours.innerText = "   number of hours you wish this script to run (round a bit down please)";
		
		var br = document.createElement("br");
		
		var selectScavenge = document.createElement("input");
		selectScavenge.id = "selectScavenge";
		selectScavenge.placeholder = "Scavenge Number";
		selectScavenge.type = "number";
		selectScavenge.min = "1";
		selectScavenge.max = "4";
		selectScavenge.value = "3";
		
        d.appendChild(cb);
		d.appendChild(hoursInput);
		d.appendChild(spanHours);
		d.appendChild(br);
		d.appendChild(selectScavenge);

        loop = setInterval(function() {
            if (cb.checked && (counter < counterCap)) {
                document.getElementsByClassName("fill-all")[0].click();
				var paladin_value = document.getElementsByClassName("unitsInput")[7].value;
				
				// if paladin value is 1, click again to clear. otherwise, dont click
				if (paladin_value == "1") {
					document.getElementsByClassName("units-entry-all")[7].click();
				}
				
				var scavengeNumber = document.getElementById("selectScavenge").value;
				
                document.getElementsByClassName("free_send_button")[scavengeNumber-1].click();
				
				counter++;
				
				console.log(counter);
				console.log(counterCap);
				console.log(scavengeNumber);
            }
        }, timeEachScavenge);
    }


})();

function checkPage(variable, value) {

    var query = window.location.search.substring(1);
    var vars = query.split("&");

    for (var i = 0; i < vars.length; i++) {
        var temp = vars[i].split("=");
        if (temp[0] == variable && temp[1] == value) return true;
    }

    return false;

}

function setHours() {
    var h = document.getElementById("hoursInput").value;
	counterCap = (h * 60 * 60 * 1000) / timeEachScavenge;
	counter = 0;
}