// ==UserScript==
// @name         xrpspin login/index.php
// @namespace
// @version      1.1
// @description  Please use my Referal-Link https://e.vg/wpsTSMtUB?s=tg
// @author       vulamapc
// @match        https://xrpspin.com/index.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/827687
// @downloadURL https://update.greasyfork.org/scripts/525889/xrpspin%20loginindexphp.user.js
// @updateURL https://update.greasyfork.org/scripts/525889/xrpspin%20loginindexphp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        console.log("Status: Page loaded.");
        setTimeout(function(){
           // window.location.replace("https://xrpspin.com/withdraw.php");
        },5000);
        setTimeout(function(){
            window.location.replace("https://xrpspin.com/login.php");
        },6000);
});



})();