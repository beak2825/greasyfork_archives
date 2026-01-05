// ==UserScript==
// @name         Klipfolio Page Refresh
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Refresh Klipfolio Page to avoid logout
// @author       vic10us
// @include http://app.klipfolio.com/*
// @include https://app.klipfolio.com/*
// @match http://app.klipfolio.com/*
// @match https://app.klipfolio.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15915/Klipfolio%20Page%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/15915/Klipfolio%20Page%20Refresh.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

window.xscript = "Version 1.0.2";

var inactivityTime = function () {
    var t;
    window.onload = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    function refreshPage() {
        console.log("Reloading page.");
        location.reload(true);
        //location.href = 'logout.php'
    }

    function resetTimer() {
        clearTimeout(t);
        console.log('Timer reset');
        t = setTimeout(refreshPage, 900000)
        // 1000 milisec = 1 sec
    }
};

window.inactivityTime = inactivityTime;

inactivityTime();