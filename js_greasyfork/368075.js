// ==UserScript==
// @name         XRP Auto Faucet Claimer.
// @namespace    twitch.tv/legalop
// @version      0.13
// @description  You can follow me on twitch.tv/legalop Donations are Aprecciated...
// @author       legalop
// @match        https://coinfaucet.io/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/368075/XRP%20Auto%20Faucet%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/368075/XRP%20Auto%20Faucet%20Claimer.meta.js
// ==/UserScript==

var count_min = 1;
$(document).ready(function(){
    console.log("Status: Page loaded.");
    $('#btnFreeRoll').click();
    console.log("Status: Button ROLL clicked.");
    
    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);

    setInterval(function(){
        $('#btnFreeRoll').click();
        console.log("Status: Button ROLL clicked again.");
    }, random(3605000,3615000));
});

function random(min,max){
   return min + (max - min) * Math.random();
}