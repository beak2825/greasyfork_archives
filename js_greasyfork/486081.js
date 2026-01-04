// ==UserScript==
// @name         bnbfree.in AutoRoll 2024
// @namespace    
// @version      1.0
// @description  Automatic rolls and claims 
// @author       YG90
// @match        https://bnbfree.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/486081/bnbfreein%20AutoRoll%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/486081/bnbfreein%20AutoRoll%202024.meta.js
// ==/UserScript==
//Please use my Referal-Link  https://bnbfree.in/?r=47094 Thanks

(function() {
    'use strict';

    (document).ready(function(){
        console.log("Status: Page loaded.");

        setTimeout(function(){
            ('#free_play_form_button').click();
            console.log("Status: Button ROLL clicked.");
        },2000);

    });

    function random(min,max){
        return min + (max - min) * Math.random();
    }

})();