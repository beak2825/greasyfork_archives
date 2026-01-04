// ==UserScript==
// @name         Freebitcoin Auto - Roll
// @namespace    http://lordofdark
// @version      3.0.11
// @description  To support please register on my free bitco.in reffer link: https://freebitco.in/?r=6869100
// @author       BoboLordOfDark
// @match        https://freebitco.in/*
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382335/Freebitcoin%20Auto%20-%20Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/382335/Freebitcoin%20Auto%20-%20Roll.meta.js
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