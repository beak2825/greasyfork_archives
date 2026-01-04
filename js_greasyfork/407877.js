// ==UserScript==
// @name         trezor test
// @namespace    dddf
// @description  jies bescc
// @version      1.1
// @match        https://stake.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/407877/trezor%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/407877/trezor%20test.meta.js
// ==/UserScript==
// ==UserScript==
// @name         trezor test
// @match        https://stake.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at document-start
// @license      GPL-3.0
// ==/UserScript==
(function() {
    'use strict';
function random(min,max){
   return min + (max - min) * Math.random();
}
var prof = document.getElementsByClassName('styles__Content-rlm06o-1 ixoRjG')[0].childNodes[0].data / 500;  //betrag für trezor
            if (document.getElementsByClassName('styles__Content-rlm06o-1 ixoRjG')[0].childNodes[0].data >= 0)   //wenn ballance größer als 0
                  document.getElementsByClassName('Link-q08rh0-0 fODGkp')[0].click();document.getElementsByClassName('NavLink__StylesNavLink-sc-140hi5a-0 etHlta')[3].click();document.getElementsByClassName('Button__StyledButton-sc-8bd3dp-0 fGwihv')[0].click(); //klick trezor
document.getElementsByClassName('styles__InputField-ix7z99-3 gQVvYS')[0].value= prof; //betrag einzeben
                  document.getElementsByClassName('Button__StyledButton-sc-8bd3dp-0 fbjzSA')[0].click(); // klick einzahlen
})();
