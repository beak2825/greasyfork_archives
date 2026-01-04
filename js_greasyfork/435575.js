// ==UserScript==
// @name         Jelszo Kitolto automatikusan
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  felgyorsítja a belepest
// @author       RicsiRobi
// @match        http://localhost/AFP_1_2021_Big/*
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435575/Jelszo%20Kitolto%20automatikusan.user.js
// @updateURL https://update.greasyfork.org/scripts/435575/Jelszo%20Kitolto%20automatikusan.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
if(window.location.href.indexOf("login")>-1)
{
    var username = "admin";
    var jelszo = "adminjelszo1";
    document.getElementsByClassName("form-control")[0].value = username;
    document.getElementsByClassName("form-control")[1].value = jelszo;
}

})();