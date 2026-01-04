// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include     /^https?://www\.google\.com/recaptcha/api2/anchor.*$/
// @require http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396411/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/396411/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        console.log("step1");
        $("#rc-anchor-container").click();
    },1000);
    // Your code here...
})();