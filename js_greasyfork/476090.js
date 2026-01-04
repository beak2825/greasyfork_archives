// ==UserScript==
// @name         Webwork Keep Alive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  NEVER GET LOCKED OUT OF WEBWORK AGAIN
// @author       You
// @match        https://webwork.elearning.ubc.ca/*
// @icon         https://webwork.elearning.ubc.ca/webwork2_files/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476090/Webwork%20Keep%20Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/476090/Webwork%20Keep%20Alive.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(function() {
    'use strict';
    console.log("Webwork Keep Alive Successfully Injected");
    const refreshTime = 5 // minutes
    function makeRequest() {
        fetch(window.location.href, {
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
    }
    setInterval(makeRequest, refreshTime * 60 * 1000);
})();