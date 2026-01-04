// ==UserScript==
// @name         UpdateChck_GamdomRainNotif
// @namespace    https://greasyfork.org/en/users/154624-allinred
// @version      1.4
// @description  Lib for update checking of Gamdom Rain Notificator.
// @author       allin4
// @match        *://gamdom.com/*
// @grant        GM_info
// @license      Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License.
// ==/UserScript==

//Check version
var versChckMN = function(myVersInt){
//Hey allin4, remember to just +1 this and also +1 on the main script :). JUST +1. JUST +1. JUST +1.
if(myVersInt < 12){
var pleaseClOK = confirm("NEW SCRIPT VERSION! Download it on: http://bit.ly/gamdomRain");
if (pleaseClOK){
window.open("http://bit.ly/gamdomRain");
}
console.log("NEW SCRIPT VERSION! Download it on: http://bit.ly/gamdomRain");
}else{console.log("Script version it's equal :)");}
};

(function() {
    'use strict';

    console.log("Update lib loaded.");
})();