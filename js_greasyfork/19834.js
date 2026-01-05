// ==UserScript==
// @name        hg_steamgifts_sgtools
// @description Adds sgtools.info links to the giveaway's winner site
// @namespace   http://s522819788.online.de
// @match     	*://www.steamgifts.com/giveaway/*/winners
// @version     1.20
// @author      hage
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/19834/hg_steamgifts_sgtools.user.js
// @updateURL https://update.greasyfork.org/scripts/19834/hg_steamgifts_sgtools.meta.js
// ==/UserScript==

// set to false if your pop-up blocker prevents the script opening both tabs simultaneously
var oneclick = true;


var winner = Array();
var x = 0;
var y = 0;
var z = 0;


//Get the nicknames of the winner(s)
var rows = document.getElementsByClassName('table__column__heading');

for (var i = 0; i < rows.length; i++) {
		winner[i] = rows[i].querySelector("a").innerHTML;
	}


//Add sgtools links

if (oneclick) {
    var newspan = document.createElement("SPAN");
    var sgtools = document.createTextNode("(sgtools.info)");
    newspan.appendChild(sgtools);
    newspan.className = "is-clickable table__column__secondary-link hg_sgtools";
    $('.is-clickable.table__column__secondary-link.js__submit-form').after(newspan);
    $('.is-clickable.table__column__secondary-link.js__submit-form').after(' ');

	x = document.querySelectorAll("span.hg_sgtools");
}
else {
    var newspan1 = document.createElement("SPAN");
    var newspan2 = document.createElement("SPAN");
    var sgtools1 = document.createTextNode("(sgtools activated)");
    var sgtools2 = document.createTextNode("(sgtools multiple wins)");
    newspan1.appendChild(sgtools1);
    newspan1.className = "is-clickable table__column__secondary-link hg_sgtoolsna";
    newspan2.appendChild(sgtools2);
    newspan2.className = "is-clickable table__column__secondary-link hg_sgtoolsmw";

    $('.is-clickable.table__column__secondary-link.js__submit-form').after(newspan2);
    $('.is-clickable.table__column__secondary-link.js__submit-form').after(' ');
    $('.is-clickable.table__column__secondary-link.js__submit-form').after(newspan1);
    $('.is-clickable.table__column__secondary-link.js__submit-form').after(' ');

	y = document.querySelectorAll("span.hg_sgtoolsna");
	z = document.querySelectorAll("span.hg_sgtoolsmw");
}




function HandlerOneClick(i) {
		    return function(){openSgtoolsOneClick(i);};
	}

function HandlerTwoClicks1(i) {
		    return function(){openSgtoolsTwoClicks1(i);};
	}

function HandlerTwoClicks2(i) {
		    return function(){openSgtoolsTwoClicks2(i);};
	}



//Add click events
for (var a=0; a<x.length; a++) {
	x[a].addEventListener('click', HandlerOneClick(a), false);
	}

for (var b=0; b<y.length; b++) {
	y[b].addEventListener('click', HandlerTwoClicks1(b), false);
	}

for (var c=0; c<z.length; c++) {
	z[c].addEventListener('click', HandlerTwoClicks2(c), false);
	}




//Open links to sgtools.info
function openSgtoolsOneClick(id)
	{
	window.open('http://www.sgtools.info/nonactivated/' + winner[id]);
	window.open('http://www.sgtools.info/multiple/' + winner[id]);
	}

function openSgtoolsTwoClicks1(id)
	{
	window.open('http://www.sgtools.info/nonactivated/' + winner[id]);
	}

function openSgtoolsTwoClicks2(id)
	{
	window.open('http://www.sgtools.info/multiple/' + winner[id]);
	}