// ==UserScript==
// @name         Auto-Roll bot
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Roll when Captcha is solved
// @author       Gidotty-FX
// @match        https://freebitco.in/*
// @icon         https://www.google.com/s2/favicons?domain=freebitco.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429257/Auto-Roll%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/429257/Auto-Roll%20bot.meta.js
// ==/UserScript==
(function(){

    'use strict';

    // Roll when Captcha is solved
    var intervalId = setInterval(function() {
        if (document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
            document.getElementById("free_play_form_button").click();
            clearInterval(intervalId);
        }
    }, 500);

})();