// ==UserScript==
// @name         Zmiana daty MES
// @namespace    https://setup.suwalki.pl/
// @version      0.1
// @description  set user tasks start date to a year before in MES
// @author       You
// @compatible   chrome
// @match        *://192.168.100.200:89/operations
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/418805/Zmiana%20daty%20MES.user.js
// @updateURL https://update.greasyfork.org/scripts/418805/Zmiana%20daty%20MES.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.getElementById('MojeGniazda').click();
document.getElementById('ZwinRozwinNaMoichGniazdachRoboczychDoWykonania').click();


var step;

for (step = 0; step < 365; step++) {
document.getElementById('ZmniejszDateOdNaMoichGniazdachRoboczychDoWykonania').click();
}

document.getElementById('PokazOperacjeNaMoichGniazdachRoboczychDoWykonania').click();

document.getElementById('ZwinRozwinNaMoichGniazdachRoboczychDoWykonania').click();
})();
