// ==UserScript==
// @name         Csgoprizes Auto-Ticket
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       BossCan
// @match        http://csgoprizes.com/get-tickets
// @description  CSGoPrizes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13800/Csgoprizes%20Auto-Ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/13800/Csgoprizes%20Auto-Ticket.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var x = document.getElementById('dailyframe');
x.parentElement.parentElement.removeChild(x.parentElement);
setTimeout(function(){
    var y = document.getElementsByClassName("bouton_get_tickets")[0];
    y.childNodes[3].click();
}, 121000);