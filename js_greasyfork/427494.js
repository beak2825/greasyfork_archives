// ==UserScript==
// @name         Police Mod Compatible With Any 2021 Updated Script
// @namespace    Police Mod Compatible With Any 2021 Updated Script
// @version      0.1
// @description  To Activate The Police Mod Just Buy The Hat "Bummle Hat" And "Winter Cap" After Buying Them Make Sure That The Light Of The Key "NumLock" Is On For The Mod To Work Without Error [ Command Keys (NumLock 2) "PoliceHat " l (NumLock 8) "AnimalsHat"]
// @author       GUST4V1NBRS M0Ds
// @match        *://*.*/*
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/v5nav1si68dbv3bybm4y382lya1d
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427494/Police%20Mod%20Compatible%20With%20Any%202021%20Updated%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/427494/Police%20Mod%20Compatible%20With%20Any%202021%20Updated%20Script.meta.js
// ==/UserScript==

(function() {

	'use strict';
    var myVar;
    var myVar2;
	var police = true;
	var ID_MooHead = 28;
    var ID_EMPTY = 0;
	var ID_PigHead = 29;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 104 || e.keyCode == 100) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_MooHead);
            myVar = setTimeout(function(){ h1(); }, 500);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});

    function h1() {
    storeEquip(ID_MooHead);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 500);
    }
    function h2() {
    storeEquip(ID_PigHead);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 500);
    }
})();


(function() {

	'use strict';
    var myVar;
    var myVar2;
	var police = true;
	var ID_BummleHat = 8;
    var ID_EMPTY = 0;
	var ID_WinterCap = 15;

	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 102 || e.keyCode == 98) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_BummleHat);
            myVar = setTimeout(function(){ h1(); }, 500);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});

    function h1() {
    storeEquip(ID_WinterCap);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 500);
    }
    function h2() {
    storeEquip(ID_BummleHat);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 500);
    }
})();

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


(function() {
	var leaderboard2 = document.getElementById("setupCard");
        var myCssText = "display:block;margin-top:10px;";
        var splixDIV2 = document.createElement("div");
        splixDIV2.className = "menuCard";
        splixDIV2.style.cssText = myCssText;
        splixDIV2.innerHTML = '<a style="font-size:14px" href="https://www.youtube.com/channel/UClv7gyJe8Z5efWJLi4Zl4-g" target="_blank">(Created by GUST4V1NBRS) | (Subscribe to My YouTube Channel) | (Thanks for Downloading My Mod) <font color="black"></font> </a>';
        leaderboard2.parentNode.insertBefore(splixDIV2, leaderboard2.nextSibling);
        uiElems.push(splixDIV2);

})();