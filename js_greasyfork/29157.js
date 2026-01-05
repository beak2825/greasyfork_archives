// ==UserScript==
// @name			★moomoo.io ActionMacro
// @version			1.3
// @description		Action Macro (SpeedilyBuildItem/ChangeWepon&Hat/...)
// @author			nekosan
// @match			*://moomoo.io/*
// @grant			none
// @namespace		https://greasyfork.org/en/scripts/29157-moomoo-io-actionmacro
// @downloadURL https://update.greasyfork.org/scripts/29157/%E2%98%85moomooio%20ActionMacro.user.js
// @updateURL https://update.greasyfork.org/scripts/29157/%E2%98%85moomooio%20ActionMacro.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Hat
	var hat = 0;
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

	// Wepon
	var subitemmode = 0;		// （0:BoostPad 1:PitTrap）
	var flag_subweapon = false;

	// Item
	var food = 1;			// 0:apple		1:cokkie
	var wall = 2;			// 2:woodwall	3:stonewall
	var spike = 5;			// 4:spikes		5:greater spikes
	var mill = 6;			// 6:windmill	7:faster windmill
	var mine = 8;			// 9:mine
	var trap = 9;			// 9:pit trap
	var boost = 10;			// 10:boost pad

	var dir;
	document.getElementById('gameCanvas').addEventListener('mousemove', function (e) {
		dir = Math.atan2(e.pageY - window.innerHeight / 2, e.pageX - window.innerWidth / 2);
	});

	function send(n, v) {
		io.managers[Object.keys(io.managers) [0]].nsps['/'].emit(n, v);
	}

	function p(a, itemid) {
		if (a !== 0) {
			send('2', dir + a);
		}
		send('5', itemid);
		send('4', 1);
	}

	document.addEventListener('keydown', function (e) {
		if (document.activeElement.id == 'chatBox') return;
		switch (e.keyCode) {
			// [CapsLock]
			case 240:
				if (hat == ID_BoosterHat) {
					hat = ID_SamuraiArmor;
				} else {
					hat = ID_BoosterHat;
				}
				storeEquip(hat);
				break;
			// [Space]
			case 32:
				e.preventDefault();
				p(0, boost);
				setTimeout(function () {
					p(0, boost);
					setTimeout(function () {
						p(1.5, spike);
						p(-1.5, spike);
						setTimeout(function () {
							p(1.5, spike);
							p(-1.5, spike);
							setTimeout(function () {
								p(0, spike);
							}, 80);
						}, 80);
					}, 50);
				}, 200);
				break;
			// [0]
			case 48:
				subitemmode = (subitemmode === 0) ? 1 : 0;
				break;
			// [B]
			case 66:
				p(0, subitemmode === 0 ? boost : trap);
				break;
			// [C]
			case 67:
				if (subitemmode === 0) {
					p(0, boost);
					setTimeout(function () {
						p(2, spike);
						p(-2, spike);
					}, 300);
				} else {
					p(0, trap);
				}
				break;
			// [F]
			case 70:
				p(0, spike);
				break;
			// [G]
			case 71:
				p(0.7, spike);
				p(-0.7, spike);
				break;
			// [H]
			case 72:
				p(0, spike);
				p(1.4, spike);
				p(-1.4, spike);
				break;
			// [I]
			case 73:
				p(2.5, mill);
				p(-2.5, mill);
				p(1, mill);
				p(-1, mill);
				break;
			// [J]
			case 74:
				p( Math.PI / 3, spike);
				p(-Math.PI / 3, spike);
				p(Math.PI, spike);
				break;
			// [N]
			case 78:
				p(2.5, mill);
				p(-2.5, mill);
				break;
			// [Q]
			case 81:
				p(0, food);
				break;
			// [R]
			case 82:
				p(Math.PI, spike);
				break;
			// [T]
			case 84:
				p(Math.PI,trap);
				break;
			// [V]
			case 86:
				p(2.3, spike);
				p(-2.3, spike);
				break;
			// [X]
			case 88:
				p( Math.PI / 3, wall);
				p(-Math.PI / 3, wall);
				p(Math.PI, wall);
				break;
			// [Z]
			case 90:
				p(0.7, wall);
				p(-0.7, wall);
				break;
		}
		if (e.shiftKey) {
			flag_subweapon = !flag_subweapon;

			// Sub Weapon
			if (flag_subweapon) {
				// hunting bow
				if ($('#actionBarItem3').css('display') != 'none') {
					$('#actionBarItem3').click();
					if (hat != ID_MarksmanCap) {
						hat = ID_MarksmanCap;
					}
					storeEquip(hat);
				// wooden shield
				} else if ($('#actionBarItem5').css('display') != 'none') {
					$('#actionBarItem5').click();
				}
			// Main Weapon
			} else {
				// great axe
				if ($('#actionBarItem1').css('display') != 'none') {
					$('#actionBarItem1').click();
				// short sword
				} else if ($('#actionBarItem2').css('display') != 'none') {
					$('#actionBarItem2').click();
				}
				if (hat == ID_MarksmanCap) {
					hat = ID_BoosterHat;
					storeEquip(hat);
				}
			}
		}
	});

	document.addEventListener('contextmenu', function (e) {
		if (document.activeElement.id == 'chatBox') return false;
		p(0, subitemmode === 0 ? boost : trap);
	}, false);
})();