// ==UserScript==
// @name         Freebitco.in AutoRoll 2023
// @namespace
// @version      1.2
// @description  Please use my Referal-Link  https://freebitco.in/?r=966336
// @author       auq60712
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/en/users/1103422
// @downloadURL https://update.greasyfork.org/scripts/468928/Freebitcoin%20AutoRoll%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/468928/Freebitcoin%20AutoRoll%202023.meta.js
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