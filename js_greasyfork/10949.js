// ==UserScript==
// @name        Pardus Missile Buyer
// @namespace   fear.math@gmail.com
// @description Quickly buys the best available missiles on a planet or SB. Great for poaching missiles off of a hostile planet.
// @include     http*://*.pardus.at/main.php*
// @include     http*://*.pardus.at/planet.php*
// @include     http*://*.pardus.at/ship_equipment.php*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10949/Pardus%20Missile%20Buyer.user.js
// @updateURL https://update.greasyfork.org/scripts/10949/Pardus%20Missile%20Buyer.meta.js
// ==/UserScript==

// --------User Variables--------

//Set which key you want to use to buy missiles.
var key = "M";

//Rank the following missiles according to your order of preference. A rank of 0 means never buy that type of missile. Do NOT duplicate ranks, and only use the whole number ranks from 0-14.
var P80_Sidewinder = 5;
var KL760_Homing_Missile = 4;
var LV111_Intelligent_Missile = 3;
var NN500_Fleet_Missile = 2;
var NN550_Fleet_Missile = 1;

var Imperial_MO89_Lord_Missile = 0;
var Imperial_G7_Smartwinder = 0;
var Imperial_A50_Pogo = 0;
var Imperial_D70_Havar = 0;
var Imperial_Elite_MkI = 0;
var Imperial_Elite_MkII = 0;
var King_Relon = 0;
var King_Kraak = 0;
var Royal_Redeemer = 0;

// ------------------------------

window.addEventListener('keydown', buyMissiles);

var neutral_missile_array = [P80_Sidewinder,KL760_Homing_Missile,LV111_Intelligent_Missile,NN500_Fleet_Missile,NN550_Fleet_Missile];
var imperial_missile_array = [P80_Sidewinder,KL760_Homing_Missile,LV111_Intelligent_Missile,NN500_Fleet_Missile,NN550_Fleet_Missile,Imperial_MO89_Lord_Missile,Imperial_G7_Smartwinder, Imperial_A50_Pogo, Imperial_D70_Havar, Imperial_Elite_MkI, Imperial_Elite_MkII, King_Relon, King_Kraak, Royal_Redeemer];

function buyMissiles(e) {
    if (String.fromCharCode(e.keyCode) == key) {
		if (location.href.indexOf("ship_equipment") === -1) {
			location.assign(location.href.substr(0,location.href.indexOf("at")+2) + "/ship_equipment.php?sort=weapon" );
		} else {
			var imperial;
			if (document.body.innerHTML.indexOf("Imperial") === -1) {imperial = false;} else {imperial = true;}
			if (imperial) {
				pickAndBuyMissiles(imperial_missile_array);
			} else {
				pickAndBuyMissiles(neutral_missile_array);
			}
		}
	}
}

function pickAndBuyMissiles(missile_array) {
	var table = document.getElementsByClassName("messagestyle")[0];
	for (i = 1; i < imperial_missile_array.length+1; i++) {
		if (missile_array.indexOf(i) != -1) {
			var available = table.rows[missile_array.indexOf(i)+1].cells[6].innerHTML;
			if (available > 0) {
				table.rows[missile_array.indexOf(i)+1].cells[7].firstChild.submit();
				break;
			}
		}
	}
}