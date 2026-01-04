// ==UserScript==
// @name         xrpspin signin
// @namespace
// @version      1.1
// @description  Please use my Referal-Link https://e.vg/wpsTSMtUB?s=tg
// @author       vulamapc
// @match        https://xrpspin.com/login.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/827687
// @downloadURL https://update.greasyfork.org/scripts/525891/xrpspin%20signin.user.js
// @updateURL https://update.greasyfork.org/scripts/525891/xrpspin%20signin.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(document).ready(function(){
    console.log("Status: Page loaded.");
    setTimeout(function(){
        $('#basic-addon1').click();
        var username = document.getElementById("default-01");
        username.value = "YOU USERNAME";
        var password = document.getElementById("password");
        password.value = "YOUR PASSWORD";
        console.log("Status: Button ROLL clicked 2.");
    },5000);
    setTimeout(function(){
        $('#login').click();
    },6000);
});



})();