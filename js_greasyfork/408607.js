// ==UserScript==
// @name         Freebitcoin Auto Roll Sem Captcha (Pescador de Cripto)
// @namespace    https://greasyfork.org/en/users/466691-jadson-tavares
// @version      0.1
// @description  Script desenvolvido para fazer o free roll automaticamente
// @author       Jadson Tavares
// @match        *://*.freebitco.in/*
// @match        *://*.pescadordecripto.com/install/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408607/Freebitcoin%20Auto%20Roll%20Sem%20Captcha%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408607/Freebitcoin%20Auto%20Roll%20Sem%20Captcha%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
var count_min = 1;

function freeBitcoin() {
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
}

function random(min,max){
   return min + (max - min) * Math.random();
}

freeBitcoin();
document.getElementById('freebitco-in-roll-sem-captcha').classList.add("faucet-active");
})();