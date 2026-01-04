// ==UserScript==
// @name         lolol
// @version      1.0
// @description  lolollollooololol
// @author       ass
// @match        http://moomoo.io/*
// @grant        none
// @connect      moomoo.io
// @namespace https://greasyfork.org/users/131053
// @downloadURL https://update.greasyfork.org/scripts/31345/lolol.user.js
// @updateURL https://update.greasyfork.org/scripts/31345/lolol.meta.js
// ==/UserScript==

(function() {
    
	'use strict';
    var myVar;
    var myVar2;
	var police = true;
	var ID_BummleHat = 8;
    var ID_EMPTY = 0;
	var ID_StrawHat = 2;
    
	document.addEventListener('keydown', function (e) {
		if (e.keyCode == 46 || e.keyCode == 119) {
			e.preventDefault();
			if (police) {
            storeEquip(ID_BummleHat);
            myVar = setTimeout(function(){ h1(); }, 1);
			} else {
            clearTimeout(myVar);
            clearTimeout(myVar2);
            storeEquip(ID_EMPTY);
			}
			police = !police;
		}
	});
    
    function h1() { 
    storeEquip(ID_StrawHat);
    clearTimeout(myVar);
    myVar2 = setTimeout(function(){ h2(); }, 1);
    }
    function h2() { 
    storeEquip(ID_BummleHat);
    clearTimeout(myVar2);
    myVar = setTimeout(function(){ h1(); }, 1);
    }
})();
