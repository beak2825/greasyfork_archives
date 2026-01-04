// ==UserScript==
// @name         Freebitco.in Roll automático com rolagem em apenas 10
// @namespace
// @version      1.0
// @description  Por favor, use o meu link de referência https://freebitco.in/?r=35704097
// @author       alandeschamps
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace    https://greasyfork.org/users/alandeschamps
// @downloadURL https://update.greasyfork.org/scripts/463004/Freebitcoin%20Roll%20autom%C3%A1tico%20com%20rolagem%20em%20apenas%2010.user.js
// @updateURL https://update.greasyfork.org/scripts/463004/Freebitcoin%20Roll%20autom%C3%A1tico%20com%20rolagem%20em%20apenas%2010.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(document).ready(function(){
    console.log("Status: Page loaded.");

    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    },30000);

});
setTimeout(function(){ location.reload(); }, 360*1000);
setTimeout(function(){ location.reload(); }, 3600*1000);

function random(min,max){
   return min + (max - min) * Math.random();
}

})();