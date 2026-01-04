// ==UserScript==
// @name		Tupalka for eRepublik
// @namespace		https://greasyfork.org/en/users/10060-lisugera
// @version		1.4
// @description		Бие когато му кажеш да бие.
// @author		lisugera
// @match		https://*.erepublik.com/*/military/battlefield/*
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/377295/Tupalka%20for%20eRepublik.user.js
// @updateURL https://update.greasyfork.org/scripts/377295/Tupalka%20for%20eRepublik.meta.js
// ==/UserScript==

var damage = 0;
var fighting = false;

if (SERVER_DATA.travelRequired === false) {
	initTupalka();
}

function initTupalka() {
	var css = document.createElement("style");
	css.innerHTML = `
	.btn {
		margin: 3px;
		display: block;
		outline: none;
		position: absolute;
		z-index: 10;
		background-color: #4CAF50;
		color: white;
		width: 90px;
		height: 20px;
		font-size: 14px;
		cursor: pointer;
		border: none;
		font: normal 700 15px Arial, Helvetica, sans-serif;
	}

	.btn:hover {
		background-color: #ddd;
		color: black;
	}

	.btnActive {
		background-color: red;
		box-shadow: 0 0 2px 2px #212121;
	}

	.btnActive:hover {
		background-color: red;
	}

	.damage {
		display: none;
		padding: 3px;
		margin-top: 28px;
		margin-left: 3px;
		border-radius: 3px;
		float: left;
		width: 84px;
		text-align: center;
		background-color: rgba(0, 0, 0, .4);
		font: normal 700 11px Arial, Helvetica, sans-serif;
		color: #ffe49b;
	}

	.damageActive {
		display: inline;
	}

	.btnDisabled {
		background-color: black;
		color: white;
		box-shadow: 0 0 2px 2px #212121;
	}`;

	document.head.appendChild(css);
	var tupalka = document.createElement("div");
	tupalka.style.marginTop = "40px";
	var fightButton = document.createElement("button");
	fightButton.id = "fightButton";
	fightButton.className = "btn";
	fightButton.addEventListener("click", fightButtonClicked);
	fightButton.innerHTML = "FIGHT";
	tupalka.appendChild(fightButton);
	var damage_panel = document.createElement("div");
	damage_panel.id = "damage_panel";
	damage_panel.className = "damage";
	var damage = document.createElement("span");
	damage.id = "damage";
	damage.innerHTML = "0";
	damage_panel.appendChild(damage);
	var damageIcon = document.createElement("img");
	damageIcon.src = "http://erepublik.com/images/modules/battle/damage_icon.png";
	damageIcon.style.marginLeft = "3px";
	damage_panel.appendChild(damageIcon);
	tupalka.appendChild(damage_panel);
	var erep = document.getElementById("pvp");
	erep.appendChild(tupalka);
}

async function fightButtonClicked() {
	var fightButton = document.getElementById("fightButton");
	if (fightButton.innerHTML == "FIGHT") {
		fightButton.innerHTML = "FIGHTING";
		fightButton.className = "btn btnActive";
		document.getElementById("damage_panel").className = "damage damageActive";
		fighting = true;
		await changeWeapon();
		while (fighting) {		
			var time = await fight();
			await sleep(time);
		}
		fightButton.innerHTML = "FIGHT";
		fightButton.className = "btn";
	} else {
		fighting = false;
		fightButton.className = "btn btnDisabled";
		fightButton.innerHTML = "STOPPING";
	}
}

async function fight() {
	var arg1 = "https://www.erepublik.com/en/military/fight-shoooot/" + SERVER_DATA.battleId;
	var arg2 = {
		"credentials": "include",
		"headers": {
			"accept": "application/json, text/javascript, */*; q=0.01",
			"accept-language": "en-US",
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
			"x-requested-with": "XMLHttpRequest"
		},
		"referrer": "https://www.erepublik.com/en/military/battlefield/" + SERVER_DATA.battleId,
		"body": "sideId=" + SERVER_DATA.countryId + "&battleId=" + SERVER_DATA.battleId + "&_token=" + SERVER_DATA.csrfToken,
		"method": "POST",
	};

	var response = await fetch(arg1, arg2);
	if (response.ok) {
		var contentType = response.headers.get("content-type");
		if (contentType && contentType.includes("application/json")) {
			var data = await response.json();
			if (data.error == false) {
				damage += data.user.givenDamage;
				document.getElementById("damage").innerHTML = damage;
				return 700;
			}
		}
	}
	return 450;
}

async function changeWeapon() {
	var response = {
		"ok": false
	};
	while (response.ok == false && fighting == true) {
		await sleep(200);
		response = await fetch("https://www.erepublik.com/en/military/change-weapon", {
				"credentials": "include",
				"headers": {
					"accept": "*/*",
					"accept-language": "en-US,en;q=0.9,bg-BG;q=0.8,bg;q=0.7",
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					"x-requested-with": "XMLHttpRequest"
				},
				"referrer": "https://www.erepublik.com/en/military/battlefield/" + SERVER_DATA.battleId,
				"referrerPolicy": "same-origin",
				"body": "_token=" + SERVER_DATA.csrfToken + "&battleId=" + SERVER_DATA.battleId + "&customizationLevel=-1",
				"method": "POST",
				"mode": "cors"
			});
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}