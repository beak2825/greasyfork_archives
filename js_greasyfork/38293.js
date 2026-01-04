// ==UserScript==
// @name         LNM Logger
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Making LNM Login a Bit Easier
// @author       art_hack
// @match        https://172.22.2.6/connect/PortalMain
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38293/LNM%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/38293/LNM%20Logger.meta.js
// ==/UserScript==


var counter = 0;
var myTimer,myInterval;

myTimer = setInterval(function myFn(){
    if(document.getElementById('LoginUserPassword_auth_password')  != null){
        document.getElementById('LoginUserPassword_auth_username').value = 'USERNAME';
        document.getElementById('LoginUserPassword_auth_password').value = 'PASSWORD';
        document.querySelector('input[type="submit"]').click();
    }

    if(document.getElementById('UserCheck_Logoff_Button_span')!= null){
        setTimeout(function myFn(){
            document.getElementById('UserCheck_Logoff_Button_span').click();
            location='Reset';
        console.log("it should appear after 5 second");
        }, 10800000);
    }
}, 100);

