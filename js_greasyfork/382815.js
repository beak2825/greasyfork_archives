// ==UserScript==
// @name         Freebitco.in nast. Freeroll Auto Rollbot + Force Refresh Page 2022
/// @namespace
// @version      2.0
// @description  Please use my Referal-Link https://freebitco.in/?r=4087011
// @author       vulamapc
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/827687
// @downloadURL https://update.greasyfork.org/scripts/382815/Freebitcoin%20nast%20Freeroll%20Auto%20Rollbot%20%2B%20Force%20Refresh%20Page%202022.user.js
// @updateURL https://update.greasyfork.org/scripts/382815/Freebitcoin%20nast%20Freeroll%20Auto%20Rollbot%20%2B%20Force%20Refresh%20Page%202022.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
$(document).ready(function(){
    console.log("Status: Page loaded.");
 
    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    },20000);
    
});
 
function random(min,max){
   return min + (max - min) * Math.random();
}
 
})();