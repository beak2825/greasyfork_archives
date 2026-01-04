// ==UserScript==
// @name         BingoRoll.com Auto Roll (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      0.1
// @description  Script desenvolvido para fazer o free roll automaticamente
// @author       Jadson Tavares
// @match        *://*.bingoroll.com/cabinet/*
// @match        *://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408888/BingoRollcom%20Auto%20Roll%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408888/BingoRollcom%20Auto%20Roll%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
var count_min = 1;

function freeBitcoin() {
    console.log("Status: Page loaded.");
    setTimeout(function(){
        if(!$('#time_remaining').is(':visible')){
            if(grecaptcha && grecaptcha.getResponse().length > 0) {
                console.log("Status: reCAPTCHA solved.");
                if ($('#free_play_form_button').is(':visible')) {
                    $('#free_play_form_button').click();
                    console.log("Status: Button ROLL clicked.");
                } else {
                    console.log("Status: Button ROLL not visible.");
                    window.history.go(0);
                }
            } else {
                console.log("Status: reCAPTCHA not solved.");
                window.history.go(0);
            }
        }
    }, random(28000,30000));

    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);

    setTimeout(function(){
        $('.close-reveal-modal')[0].click();
        console.log("Status: Button CLOSE POPUP clicked.");
    }, random(31000,33000));

    setInterval(function(){
        if ($('#free_play_form_button').is(':visible')) {
            $('#free_play_form_button').click();
            console.log("Status: Button ROLL clicked again.");
        }
    }, random(3605000,3615000));
}

function random(min,max){
   return min + (max - min) * Math.random();
}

freeBitcoin();
document.getElementById('bingoroll-com-autoroll').classList.add("faucet-active");
})();