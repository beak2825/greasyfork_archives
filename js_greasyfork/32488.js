// ==UserScript==
// @name Perussi's Moomoo.io Hat Haxxxx
// @version 5.6
// @description https://tinyurl.com/ydb5weh3
// @author Perussi
// @match *://moomoo.io/*
// @grant none
// @namespace https://greasyfork.org/users/128061
// @downloadURL https://update.greasyfork.org/scripts/32488/Perussi%27s%20Moomooio%20Hat%20Haxxxx.user.js
// @updateURL https://update.greasyfork.org/scripts/32488/Perussi%27s%20Moomooio%20Hat%20Haxxxx.meta.js
// ==/UserScript==

(function() {

document.title = "Perussi's Moomoo.io Hat Haxxxx";
var vs = ["2 Peter 3:9", "John 3:16", "Psalm 23", "Romans 12:2", "John 5:24", "John 11:25-26", "Job 19:25-26"];
var aV = [0,0];
var hZ = [[15, "Winter Cap"], [12, "Booster Hat"], [31, "Flipper Hat"], [6, "Soldier Helmet"], [22, "Emp Helmet"], [26,  "Demolisher Armor"], [20, "Samurai Armor"], [7, "Bull Helmet"], [11, "Spike Gear"]];
var rZe = 0;

function hF(ki){
	if(aV[0] === 0){
		storeEquip(hZ[ki][0]);
		document.title = hZ[ki][1];
		aV[1] = 90;
	} else {
		storeBuy(hZ[ki][0]);
		aV[0] = 0;
		aV[1] = 180;
		document.title = "Bought. (if you had enough gold or didn't already buy it)";
	}
}

document.addEventListener('keydown', function(kfc) {
	switch (kfc.keyCode) {
		case 96: aV[0] = 1; aV[1] = 300; document.title = "Buying...."; break;
		case 110: if(aV[0] === 1){aV[1] = 120; document.title = "Not buying....";}  aV[0] = 0; break;
		case 107: storeEquip(0); break;
		case 97: hF(0); break;
		case 98: hF(1); break;
		case 99: hF(2); break;
		case 100: hF(3); break;
		case 101: hF(4); break;
		case 102: hF(5); break;
		case 103: hF(6); break;
		case 104: hF(7); break;
		case 105: hF(8); break;
	}
});

function tK(){
	aV[1]--;
	letThereBeLight();
}

function letThereBeLight(){
	if(aV[1] === 0){
		rZe = Math.floor(Math.random()*vs.length-0.00001);
		if(rZe < 0){
			rZe = 0;
		}
		document.title = vs[rZe];
	}
}

setInterval(tK, 1000/60);
})();