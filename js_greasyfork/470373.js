// ==UserScript==
// @name         Freebitcoin simple AutoRoll without Captcha
// @namespace
// @version      1.0
// @description  Please use my Referal-Link https://freebitco.in/?r=966336
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.2/jquery.min.js
// @namespace https://greasyfork.org/users/1103422
// @downloadURL https://update.greasyfork.org/scripts/470373/Freebitcoin%20simple%20AutoRoll%20without%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/470373/Freebitcoin%20simple%20AutoRoll%20without%20Captcha.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(document).ready(function(){
    console.log("Status: Page loaded.");

    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    },2000);
    
});

function random(min,max){
   return min + (max - min) * Math.random();
}

})();