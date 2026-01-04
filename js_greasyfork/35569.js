// ==UserScript==
// @name         CoinFaucet Auto Claim
// @namespace    http://romenum.online
// @version      1.0.1
// @description  Feel free to donate: 1KCwhJWdMcnqNECnKBxhZHb4Eu6RWjgg4U
// @author       romenum
// @match        https://coinfaucet.io/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35569/CoinFaucet%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/35569/CoinFaucet%20Auto%20Claim.meta.js
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