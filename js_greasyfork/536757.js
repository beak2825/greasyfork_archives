// ==UserScript==
// @name         Grundos.cafe - RS Clock (modified) (Left Sidebar)
// @namespace    gc-rs-clock
// @version      v4.0.2
// @description  A second clock that counts down to the next shop restock, with links to all active shops
// @author       dani, ben (mushroom), rowan
// @match        https://grundos.cafe/*
// @match        https://www.grundos.cafe/*
// @exclude      https://www.grundos.cafe/~*
// @exclude      https://grundos.cafe/process/
// @exclude      https://www.grundos.cafe/userlookup/*
// @exclude      https://www.grundos.cafe/market/browseshop/?owner=*
// @exclude      https://www.grundos.cafe/petlookup/?pet_name=*
// @exclude      https://www.grundos.cafe/~*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536757/Grundoscafe%20-%20RS%20Clock%20%28modified%29%20%28Left%20Sidebar%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536757/Grundoscafe%20-%20RS%20Clock%20%28modified%29%20%28Left%20Sidebar%29.meta.js
// ==/UserScript==
/* globals $ */

//User Settings------------------------------------------------------------

//alert color time in seconds, to change, only edit numbers
//yellow is at 1 min
const orange = 35;
const red = 10;

//to change colors change hex codes below
//hex codes online: https://coolors.co/
const shoplinks = "#BC617C";
const linksbg = "#C19EBE";

const clockfont = "black";
const clockbg = "#FFFF63"; //change the font too ^
const border = "black";

//1m-36s
const clockfont1m = "#ffff00";
const clockbg1m = "#000000";

//35s-11s
const clockfont35s = "#FFA500";
const clockbg35s = "#000000";

//10-0s
const clockfont10s = "#000000";
const clockbg10s = "#FF0000";

const containerStyle1 = "margin:5px auto 0px;height:10px;border:1px solid;background:";
const containerStyle1b = ";border-color:";
const containerStyle2 = ";padding-top:2px;padding-bottom:2px;margin-top:10px;width:105px;height:15px;font-size:12px;color:";
const containerStyle3 = ";text-align:center;";

let time = -1;

function updateTime() {
	var mins = parseInt(document.querySelector("#NST_clock_minutes").innerHTML);
    var secs = parseInt(document.querySelector("#NST_clock_seconds").innerHTML);

	let newTime = mins * 60 + secs;
	if (newTime !== time) {
		time = newTime;
		updateClock();
	}
}

function updateClock() {
	let restockInterval = 6 * 60;
	let nextRestock = restockInterval - (time % restockInterval);
	let nextRestockMins = Math.floor(nextRestock / 60);
	let nextRestockSecs = nextRestock % 60;
	let padSeconds = nextRestockSecs < 10 ? '0' : '';

	timerContainer.innerHTML = `${nextRestockMins}:${padSeconds}${nextRestockSecs} until RS`;

	switch (nextRestockMins) {
		case 0:
			if (nextRestockSecs > orange)
				timerContainer.style = containerStyle1 + clockbg1m + containerStyle2 + clockfont1m + containerStyle3;

			if (nextRestockSecs <= orange && nextRestockSecs > red)
				timerContainer.style = containerStyle1 + clockbg35s + containerStyle2 + clockfont35s + containerStyle3;

			if (nextRestockSecs <= red && nextRestockSecs > -1)
				timerContainer.style = containerStyle1 + clockbg10s + containerStyle2 + clockfont10s + containerStyle3;

			break;
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		default:
			//timerContainer.style = containerStyle1 + clockbg + containerStyle1b + border + containerStyle2 + clockfont + containerStyle3;
			timerContainer.style = containerStyle1 + clockbg1m + containerStyle2 + clockfont1m + containerStyle3;
			break;
	}
}

(function(){
    "use strict";

	//Sidebar check
	if (document.getElementById("userinfo")) {
		//Containers
		var timerContainer = document.createElement("div");
		timerContainer.id = "timerContainer";
		document.querySelector("#sb_clock").append(timerContainer);
		timerContainer.innerHTML = "is broked :/";
		timerContainer.style = containerStyle1 + clockbg + containerStyle2 + clockfont + containerStyle3;
	}

    //first check
    updateTime();

    //refresh every 100 ms
    setInterval(updateTime, 50);
})();