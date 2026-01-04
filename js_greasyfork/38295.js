// ==UserScript==
// @name         LNM Logger
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Making LNM Login a Bit Easier
// @author       art_hack
// @match        https://172.22.2.6/connect/PortalMain
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/38295/LNM%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/38295/LNM%20Logger.meta.js
// ==/UserScript==

var encKey  = GM_getValue ("encKey",  "");
var usr     = GM_getValue ("lognUsr", "");
var pword   = GM_getValue ("lognPwd", "");

if ( ! encKey) {
    encKey  = prompt (
        'Script key not set for ' + location.hostname + '. Please enter a random string:',
        ''
    );
    GM_setValue ("encKey", encKey);

    usr     = pword = "";   // New key makes prev stored values (if any) unable to decode.
}

function decodeOrPrompt (targVar, userPrompt, setValVarName) {
    if (targVar) {
        targVar     = unStoreAndDecrypt (targVar);
    }
    else {
        targVar     = prompt (
            userPrompt + ' not set for ' + location.hostname + '. Please enter it now:',
            ''
        );
        GM_setValue (setValVarName, encryptAndStore (targVar) );
    }
    return targVar;
}

function encryptAndStore (clearText) {
    return  JSON.stringify (sjcl.encrypt (encKey, clearText) );
}

function unStoreAndDecrypt (jsonObj) {
    return  sjcl.decrypt (encKey, JSON.parse (jsonObj) );
}

usr         = decodeOrPrompt (usr,   "U-name", "lognUsr");
pword       = decodeOrPrompt (pword, "P-word", "lognPwd");

//-- Add menu commands that will allow U and P to be changed.
GM_registerMenuCommand ("Change Username", changeUsername);
GM_registerMenuCommand ("Change Password", changePassword);

function changeUsername () {
    promptAndChangeStoredValue (usr,   "U-name", "lognUsr");
}

function changePassword () {
    promptAndChangeStoredValue (pword, "P-word", "lognPwd");
}

function promptAndChangeStoredValue (targVar, userPrompt, setValVarName) {
    targVar     = prompt (
        'Change ' + userPrompt + ' for ' + location.hostname + ':',
        targVar
    );
    GM_setValue (setValVarName, encryptAndStore (targVar) );
}

var myTimer = setInterval(function myFn(){
    if(document.getElementById('LoginUserPassword_auth_password')  !== null){
        document.getElementById('LoginUserPassword_auth_username').value = usr;
        document.getElementById('LoginUserPassword_auth_password').value = pword;
        document.querySelector('input[type="submit"]').click();
    }

    if(document.getElementById('UserCheck_Logoff_Button_span')!== null){
        setTimeout(function myFn(){
            document.getElementById('UserCheck_Logoff_Button_span').click();
            location='Reset';
            console.log("it should appear after 5 second");
        }, 10800000);
    }
}, 100);

