// ==UserScript==
// @name            Freebitco.in autoroll just a simple script.
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     Please use my Referal Link https://freebitco.in/?r=49067105
// @author          elmer76
// @license         MIT
// @match           https://freebitco.in/*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/441468/Freebitcoin%20autoroll%20just%20a%20simple%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/441468/Freebitcoin%20autoroll%20just%20a%20simple%20script.meta.js
// ==/UserScript==
/*
==================================================================================================================================================                                                                                                                                              |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                     TY and enjoy                                               |
|         Please use my referal link      https://tiggercoin.com/?ref=32wojjAHVAC3rz6sZzLqGNBKJq2MJAaKj4                                         |
==================================================================================================================================================
*/
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