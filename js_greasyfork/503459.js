// ==UserScript==
// @name         epiotrkow.pl - blokada adblocka
// @namespace    http://tampermonkey.net/
// @version      2024-08-12
// @description  Wyłączenie wykrywania Adblocka dla epiotrkow.pl - omijanie niesamowicie zaawanasowanego skrypu wykrywającego używanie blokera reklam XD
// @author       Kacper Nowak
// @license MIT
// @match        https://epiotrkow.pl/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=epiotrkow.pl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503459/epiotrkowpl%20-%20blokada%20adblocka.user.js
// @updateURL https://update.greasyfork.org/scripts/503459/epiotrkowpl%20-%20blokada%20adblocka.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Podmiana funkcji wykrywającej działanie Adblocka
    //Z pozdrowieniami dla piotrkowskich programistów xD
function adbfunct(val){
	if(val == "on"){
        console.log("Adblock włączony, blokada skryptów działa!");
	}
	if(val == "off"){
        console.log("Adblock włączony, blokada skryptów działa!");
	}
}

    //Skypt odpowiedzialny za podmianę
addJS_Node (adbfunct);

function addJS_Node (text, s_URL, funcToRun, runOnLoad) {
    var D = document;
    var scriptNode = D.createElement ('script');
    if (runOnLoad) {
        scriptNode.addEventListener ("load", runOnLoad, false);
    }
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (scriptNode);
}

})();