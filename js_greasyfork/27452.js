// ==UserScript==
// @name         Auto signin - DH1 + DH2
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  You never have to sign in manually again with this! :D
// @author       Lasse98brus
// @match        *.diamondhunt.co/
// @match        *.diamondhunt.co/index.php
// @match        *.diamondhunt.co/php/foward-login.php
// @match        *.diamondhunt.co/DH1/
// @match        *.diamondhunt.co/DH1/index.php
// @match        *.diamondhunt.co/DH1/php/login-process.php
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27452/Auto%20signin%20-%20DH1%20%2B%20DH2.user.js
// @updateURL https://update.greasyfork.org/scripts/27452/Auto%20signin%20-%20DH1%20%2B%20DH2.meta.js
// ==/UserScript==

if (location.href.indexOf(/.co(\/php|\/DH1\/php)\//g)) {
    location.href = location.protocol + '//' + location.host + location.pathname.split('php/')[0];
}

var gameVersion;
if (location.href.indexOf('.co/DH1/') !== -1) {
    gameVersion = "dh1";
} else {
    gameVersion = "dh2";
}


// Just a small config to easily type in your username and password!
// THE PASSWORD IS CASE SENSITIVE!
var config = {
    dh1 : {
        username : "free user",
        password : "free pass"
    },
    dh2 : {
        username: "free user",
        password: "free pass"
    }
};


// This is the actual script to sign in automatically xD
document.getElementById("username").value = config[gameVersion].username;
document.getElementById("password").value = config[gameVersion].password;
$("#loginSubmitButton").click();