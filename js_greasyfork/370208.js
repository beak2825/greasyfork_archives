// ==UserScript==
// @name         Travelling/Hospitalized Bounty Remover
// @namespace    Society of Avalon
// @version      1.0
// @description  Trim down the bounty list
// @author       You
// @match        https://www.torn.com/bounties.php*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/370208/TravellingHospitalized%20Bounty%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/370208/TravellingHospitalized%20Bounty%20Remover.meta.js
// ==/UserScript==

$(document).ready(function(){
    var X = window.setInterval(function(){
        $('.t-red').parent().parent().parent().parent().hide();
    }, 100);
});
