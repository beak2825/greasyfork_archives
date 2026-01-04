// ==UserScript==
// @name         Freebitco.in auto Freeroll change Captcha with Rewardpoints 2021 www.BuyListas.com
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Please use my Referal-Link https://freebitco.in/?r=2878556
// @author       freeautobitco.blogspot.com
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376672/Freebitcoin%20auto%20Freeroll%20change%20Captcha%20with%20Rewardpoints%202021%20wwwBuyListascom.user.js
// @updateURL https://update.greasyfork.org/scripts/376672/Freebitcoin%20auto%20Freeroll%20change%20Captcha%20with%20Rewardpoints%202021%20wwwBuyListascom.meta.js
// ==/UserScript==

(function() {
    'use strict';
$('#play_without_captchas_button').click() // Solve/change Captcha with Rewardpoints, disable the line with // if you dont want more
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