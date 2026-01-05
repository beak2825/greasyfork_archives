// ==UserScript==
// @name         ★moomoo.io ChangeHat
// @version      0.3
// @description  Change the hat with the numeric keypad.
// @author       nekosan
// @match        *://moomoo.io/*
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/28898-moomoo-io-changehat
// @downloadURL https://update.greasyfork.org/scripts/28898/%E2%98%85moomooio%20ChangeHat.user.js
// @updateURL https://update.greasyfork.org/scripts/28898/%E2%98%85moomooio%20ChangeHat.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var ID_BummleHat = 8;
	var ID_StrawHat = 2;
	var ID_WinterCap = 15;
	var ID_CowboyHat = 5;
	var ID_RangerHat = 4;
	var ID_ExplorerHat = 18;
	var ID_MarksmanCap = 1;
	var ID_SoldierHelmet = 6;
	var ID_HoneycrispHat = 13;
	var ID_MinersHelmet = 9;
	var ID_BoosterHat = 12;
	var ID_BushGear = 10;
	var ID_SpikeGear = 11;
	var ID_BushidoArmor = 16;
	var ID_SamuraiArmor = 20;

	document.addEventListener('keydown', function(e) {
		switch (e.keyCode - 96) {
			case 0: storeEquip(0); break; // UnEquip
			case 1: storeEquip(ID_BummleHat); break;
			case 2: storeEquip(ID_WinterCap); break;
			case 3: storeEquip(ID_SoldierHelmet); break;
			case 4: storeEquip(ID_HoneycrispHat); break;
			case 5: storeEquip(ID_BoosterHat); break;
			case 6: storeEquip(ID_BushGear); break;
			case 7: storeEquip(ID_SpikeGear); break;
			case 8: storeEquip(ID_BushidoArmor); break;
			case 9: storeEquip(ID_SamuraiArmor); break;
		}
	});

})();