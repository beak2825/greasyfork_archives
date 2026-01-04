// ==UserScript==
// @name         Auto etykiety
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        *://*.plemiona.pl/game.php*screen=overview_villages*mode=incomings*subtype=attacks*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394038/Auto%20etykiety.user.js
// @updateURL https://update.greasyfork.org/scripts/394038/Auto%20etykiety.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

let ILE_SEKUND = 300 //co tyle sekund skrypt bedzie refreshowal strone, czestsze odswiezanie moze ztriggerowac captcha

let timerek
let petelka = sessionStorage.getItem('loop') || 0
let i = 299
let dodane_wioski = sessionStorage.getItem("dodane") || 0


$("#content_value").prepend(`<div><button id="turn_on">Turn on</button>&nbsp;&nbsp;<button id="turn_off">Turn off</button></div><div>Loop is set to ${petelka}.</div><div id="log">Dodalem ${dodane_wioski} etykiet</div><div id="counter"></div>`)



console.log($("#incomings_table").find("td:contains('Atak')").length)

setTimeout(function() {
    if ($("#incomings_table").find("td:contains('Atak')").length > 0) {
        let temp_dodane = sessionStorage.getItem("dodane") || 0
        sessionStorage.setItem("dodane",parseInt(temp_dodane)+$("#incomings_table").find("td:contains('Atak')").length)
        $(document.body).find("#select_all").trigger('click')
        setTimeout(function() {;$("input[value='Etykieta']").trigger('click')},2000);
    }
},2000)

if (petelka==1) {
    setInterval(function() {$("#counter").text(i--)},1000)
    timerek = setTimeout(function() {
        location.reload();
    }, ILE_SEKUND * 1000)
}


$(document.body).on('click','#turn_on',function() {
    sessionStorage.setItem('loop',1)
    setInterval(function() {$("#counter").text(i--)},1000)
    location.reload();
    })


$(document.body).on('click','#turn_off',function() {
    sessionStorage.setItem('loop',0)
    clearTimeout(timerek)
})
;
