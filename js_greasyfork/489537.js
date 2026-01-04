// ==UserScript==
// @name         Auto-Login
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Auto-Login for Moodle Services
// @author       F. Zahner
// @match        https://moodle.ost.ch/auth/shibboleth/login.php*
// @match        https://ost.login.eduid.ch/idp/profile/SAML2/Redirect/SSO*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ost.ch
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489537/Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/489537/Auto-Login.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async function() {
    'use strict';
    if (window.location.href.includes("moodle.ost.ch/auth/shibboleth/login.php")) {
        console.log("In login page");
        var btn1 = document.getElementsByClassName("btn btn-primary btn-block mb-1")[0];
        btn1.click();
    }

    if (window.location.href.includes("ost.login.eduid.ch/idp/profile/SAML2/Redirect/SSO")) {
        console.log("In SSO Page");
        var username = document.getElementById("username");
        var btn2 = document.getElementById("button-submit");

        if(btn2 == null) {
            console.log("Did not find button-submit, trying button-proceed...");
            await sleep(100);
            var btn3 = document.getElementById("button-proceed");
            btn3.click();
        } else {
            console.log("Found button-submit button");
            console.log("2.1")
            await sleep(50); 
            btn2.click();
        }
    }
})();