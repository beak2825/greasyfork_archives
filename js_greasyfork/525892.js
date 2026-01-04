// ==UserScript==
// @name         xrpspin spin
// @namespace
// @version      1.1
// @description  Please use my Referal-Link https://e.vg/wpsTSMtUB?s=tg
// @author       vulamapc
// @match        https://xrpspin.com/spin.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/827687
// @downloadURL https://update.greasyfork.org/scripts/525892/xrpspin%20spin.user.js
// @updateURL https://update.greasyfork.org/scripts/525892/xrpspin%20spin.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(document).ready(function(){
    console.log("Status: Page loaded.");
    setTimeout(function(){
        window.location.replace("https://xrpspin.com/withdraw.php");
        console.log("Status: Button ROLL clicked 2.");
    },5000);
});



})();