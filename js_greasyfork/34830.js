// ==UserScript==
// @name         ★HoodMan :D
// @version      6.9.6
// @description  custom from hoods clan.
// @author       Kyran Smith
// @match        *://moomoo.io/*
// @grant        none
// @namespace    https://greasyfork.org/en/scripts/28898-moomoo-io-changehat
// @downloadURL https://update.greasyfork.org/scripts/34830/%E2%98%85HoodMan%20%3AD.user.js
// @updateURL https://update.greasyfork.org/scripts/34830/%E2%98%85HoodMan%20%3AD.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var ID_BullHelmet = 7;
	var ID_StrawHat = 2;
	var ID_TankGear = 40;
	var ID_CowboyHat = 5;
	var ID_RangerHat = 4;
	var ID_ExplorerHat = 18;
	var ID_MarksmanCap = 1;
	var ID_SoldierHelmet = 6;
	var ID_EmpHelmet = 22;
	var ID_MinersHelmet = 9;
	var ID_BoosterHat = 12;
	var ID_BushGear = 10;
	var ID_SpikeGear = 11;
	var ID_BushidoArmor = 16;
	var ID_SamuraiArmor = 20;

	document.addEventListener('keydown', function(e) {
		switch (e.keyCode - 96) {
			case 0: storeEquip(0); break; // UnEquip
			case 1: storeEquip(ID_BullHelmet); break;
			case 2: storeEquip(ID_TankGear); break;
			case 3: storeEquip(ID_SoldierHelmet); break;
			case 4: storeEquip(ID_EmpHelmet); break;
			case 5: storeEquip(ID_BoosterHat); break;
			case 6: storeEquip(ID_BushGear); break;
			case 7: storeEquip(ID_SpikeGear); break;
			case 8: storeEquip(ID_BushidoArmor); break;
			case 9: storeEquip(ID_SamuraiArmor); break;
		}
	});

})();