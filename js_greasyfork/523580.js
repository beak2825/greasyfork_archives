// ==UserScript==
// @name         OC2.0 Payday
// @namespace    nieltorn.com/paydayoc2
// @version      1.0.2
// @author       Alma
// @description  OC payday buttons in OC 2.0
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-body
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523580/OC20%20Payday.user.js
// @updateURL https://update.greasyfork.org/scripts/523580/OC20%20Payday.meta.js
// ==/UserScript==

function mainthingy(event) {
	event.preventDefault();
	var crimes = document.getElementById("faction-crimes-root");
	var crimesList = crimes.getElementsByTagName("div")[2].children;
	let hr = "";
	let membersToBePaid = "";
	let teamsize = 0;
	let reward = "";
	let payPerMember = 0;
	const rex = /\d+/;
	let first = true;
	let spfirst = "";
	let spsec = "";
	let newa = "";
	for (let cs of crimesList) {
	    if (cs.querySelector("p.title___pB5FU").innerHTML == "success") {
	        cs.querySelectorAll("a.slotMenuItem___vkbGP").forEach(memb => {
	            hr = memb.getAttribute("href");
	            hr = rex.exec(hr)[0];
	
	            if (first) {
	                membersToBePaid = hr;
	                first = false;
	            }
	            else {
	                membersToBePaid += "," + hr;
	            }
	        });
	        reward = cs.querySelector("span.money___qdQXc").innerHTML.replace("$", "");
	        while (reward.includes(",")) reward = reward.replace(",", "");
	        reward = Math.round(reward * 0.9);
	        teamsize = membersToBePaid.split(",").length;
	        payPerMember = Math.round(reward / teamsize);
	        first = true;
	        spfirst = document.createElement("span");
	        spfirst.classList.add("btn-wrap");
	        spfirst.classList.add("again-btn");
	        spfirst.classList.add("silver");
	        spfirst.classList.add("right");
	        spsec = document.createElement("span");
	        spsec.classList.add("btn");
	        newa = document.createElement("a");
	        newa.classList.add("torn-btn");
	        newa.setAttribute("target", "_blank");
	        newa.setAttribute("href", "https://www.torn.com/factions.php?step=your#/tab=controls&option=pay-day&select=" + membersToBePaid + "&pay=" + 	payPerMember);
	        newa.innerHTML = "Pay Day";
	        cs.querySelector("div.wrapper___g3mPt").appendChild(spfirst).appendChild(spsec).appendChild(newa);
	    }
	}
}


const tm = document.querySelector("div.content-title.m-bottom10 h4");
let spinitfirst = document.createElement("span");
spinitfirst.classList.add("btn-wrap");
spinitfirst.classList.add("again-btn");
spinitfirst.classList.add("silver");
spinitfirst.classList.add("right");
let spinitsec = document.createElement("span");
spinitsec.classList.add("btn");
newinita = document.createElement("a");
newinita.classList.add("torn-btn");
newinita.classList.add("uniqueAlmaThing");
newinita.setAttribute("href", "#");
newinita.innerHTML = "Add Pay Day links";
tm.appendChild(spinitfirst).appendChild(spinitsec).appendChild(newinita);

//document.querySelector("a.uniqueAlmaThing").addEventListener('click', function() {
//    mainthingy();
//});

document.querySelector("a.uniqueAlmaThing").addEventListener("click", mainthingy, false);