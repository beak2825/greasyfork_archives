// ==UserScript==
// @name         MooMoo.io Hat Macros
// @version      1.3
// @description  Change hats with the press of a button. 
// @author       Blackfire
// @match        http://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @match        http://sandbox.moomoo.io/*
// @match        *://*.moomoo.io/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @connect      moomoo.io
// @namespace    https://greasyfork.org/en/users/150424
// @downloadURL https://update.greasyfork.org/scripts/377942/MooMooio%20Hat%20Macros.user.js
// @updateURL https://update.greasyfork.org/scripts/377942/MooMooio%20Hat%20Macros.meta.js
// ==/UserScript==

function revertTitle(){
    f++;
    setTimeout(function(){
        f--;
        if (!f) {
            document.title = "Moo Moo";
        }
    }, 1500);
}

(function() {

var aV = [0,0];
var hZ =
    [
        [29, "Pig Head"],
        [28, "Moo Head"],
        [12, "Booster Hat"],
        [26, "Barbarian Armor"],
        [40, "Tank Gear"],
        [26, "Dark Knight"],
        [7, "Bull Helmet"],
        [20, "Samurai"]
    ];
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
		document.title = "Bought";
	}
}

document.addEventListener('keydown', function(kfc) {
    if(!$(':focus').length) {
        switch (kfc.keyCode) {
            case 186: aV[0] = 1; aV[1] = 300; document.title = "Buying...."; kfc.preventDefault(); break;
            case 222: if(aV[0] === 1){aV[1] = 120; document.title = "Not buying....";} aV[0] = 0; kfc.preventDefault(); break;
            case 76: storeEquip(0); kfc.preventDefault(); break; // None [l]
            case 191: hF(0); kfc.preventDefault(); break; // Pig Head [/]
            case 16: hF(1); kfc.preventDefault(); break; // Moo Head [shift]
            case 188: hF(2); kfc.preventDefault(); break; // Booster [,]
            case 77: hF(3); kfc.preventDefault(); break; // Tank Gear [m]
            case 78: hF(4); kfc.preventDefault(); break; // Barbarian Armor [n]
            case 66: hF(5); kfc.preventDefault(); break; // Dark Knight [b]
            case 75: hF(6); kfc.preventDefault(); break; // Bull Helmet [k]
            case 74: hF(7); kfc.preventDefault(); break; // Samurai [j]
        }
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

