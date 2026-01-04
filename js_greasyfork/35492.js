// ==UserScript==
// @name         Freebitcoin Auto Claim
// @namespace    http://romenum.online
// @version      1.5
// @description  Feel free to donate: 1KCwhJWdMcnqNECnKBxhZHb4Eu6RWjgg4U
// @author       romenum
// @match        https://freebitco.in/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/35492/Freebitcoin%20Auto%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/35492/Freebitcoin%20Auto%20Claim.meta.js
// ==/UserScript==

var count_min = 1;
$(document).ready(function(){
    console.log("Status: Page loaded.");
    
    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    }, random(2000,4000));
    
    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);
    
    setTimeout(function(){
        $('.close-reveal-modal')[0].click();
        console.log("Status: Button CLOSE POPUP clicked.");
    }, random(12000,18000));

    setInterval(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked again.");
    }, random(3605000,3615000));
});

function random(min,max){
   return min + (max - min) * Math.random();
}