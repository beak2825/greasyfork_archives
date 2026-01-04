// ==UserScript==
// @name         Freebitco.in AutoRoll without captcha 2023
// @version      1.2
// @description  my Referal-Link  https://freebitco.in/?r=52097022
// @author       parker787
// @match        https://freebitco.in/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/en/users/1103422
// @downloadURL https://update.greasyfork.org/scripts/474499/Freebitcoin%20AutoRoll%20without%20captcha%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/474499/Freebitcoin%20AutoRoll%20without%20captcha%202023.meta.js
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

})();