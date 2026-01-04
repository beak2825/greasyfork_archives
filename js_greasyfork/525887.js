// ==UserScript==
// @name         xrpspin withdrawal
// @namespace
// @version      1.2
// @description  Please use my Referal-Link https://e.vg/wpsTSMtUB?s=tg
// @author       vulamapc
// @match        https://xrpspin.com/withdraw.php
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace https://greasyfork.org/users/827687
// @downloadURL https://update.greasyfork.org/scripts/525887/xrpspin%20withdrawal.user.js
// @updateURL https://update.greasyfork.org/scripts/525887/xrpspin%20withdrawal.meta.js
// ==/UserScript==

(function() {
    'use strict';

$(document).ready(function(){
    console.log("Status: Page loaded.");
    setTimeout(function(){
        $('#tabItem7 #basic-addon1').click();
        console.log("Status: Button ROLL clicked 2.");
    },5000);
    setTimeout(function(){
        $('#basic-addon1').click();
        var password = document.getElementById("passwordXrp");
        password.value = "YOUR PASSWORD";
        console.log("Status: Button ROLL clicked 3.");
    },7000);
    setTimeout(function(){
        $('#goXRPbtn').click();
        console.log("Status: Button ROLL clicked 4.");
    },9000);
    setTimeout(function(){
        //window.location.replace("https://xrpspin.com/index.php")
        console.log("test5")
        document.cookie.replace(
            /(?<=^|;).+?(?=\=|;|$)/g,
            name => location.hostname
            .split(/\.(?=[^\.]+\.)/)
            .reduceRight((acc, val, i, arr) => i ? arr[i]='.'+val+acc : (arr[i]='', arr), '')
            .map(domain => document.cookie=`${name}=;max-age=0;path=/;domain=${domain}`)
        );
    },300000);
    setTimeout(function(){
        window.location.replace("https://xrpspin.com/");
    },301000);

});




})();