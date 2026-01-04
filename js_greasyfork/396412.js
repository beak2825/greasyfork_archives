// ==UserScript==
// @name         New Userscript1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include     /^https?://www\.google\.com/recaptcha/api2/bframe.*$/
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396412/New%20Userscript1.user.js
// @updateURL https://update.greasyfork.org/scripts/396412/New%20Userscript1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        $("#recaptcha-audio-button").click();
        console.log("step2");
        setTimeout(function(){
            $("#solver-button").click();
            console.log("step3");
        },3000);
    },3000);
    // Your code here...
})();