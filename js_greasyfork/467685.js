// ==UserScript==
// @name         Freebitco.in auto roll without Captcha
// @namespace
// @version      1.5
// @description  Please use my Referal-Link https://freebitco.in/?r=5545913
// @author       CLONER
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/en/users/1088885
// @downloadURL https://update.greasyfork.org/scripts/467685/Freebitcoin%20auto%20roll%20without%20Captcha.user.js
// @updateURL https://update.greasyfork.org/scripts/467685/Freebitcoin%20auto%20roll%20without%20Captcha.meta.js
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