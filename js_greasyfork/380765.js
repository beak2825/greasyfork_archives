// ==UserScript==
// @name         Freebitco.in Freeroll Rollbot Script
// @namespace    https://greasyfork.org/en/scripts/370982-freebitco-in-freeroll-rollbot-script/code
// @version      0.1
// @description  Please use my Referal-Link https://freebitco.in/?r=15379995
// @author       unknown
// @match        https://freebitco.in/*
// @downloadURL https://update.greasyfork.org/scripts/380765/Freebitcoin%20Freeroll%20Rollbot%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/380765/Freebitcoin%20Freeroll%20Rollbot%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

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

})();