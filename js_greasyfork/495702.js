// ==UserScript==
// @name         Scope Keep Alive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  STOP SIGNING ME OUT!
// @author       You
// @match        https://scope.sciencecoop.ubc.ca/*
// @icon         https://scope.sciencecoop.ubc.ca/content/documents/themeUploads/2019-07-23/r16880205961767347468316334133875406397008582841013r/SCOPE_faviconr689394366556340227034068220847248902920373181207r.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495702/Scope%20Keep%20Alive.user.js
// @updateURL https://update.greasyfork.org/scripts/495702/Scope%20Keep%20Alive.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(function() {
    'use strict';
    console.log("Scope Keep Alive Successfully Injected");
    const refreshTime = 2 // minutes
    function makeRequest() {
        fetch("https://scope.sciencecoop.ubc.ca/keepAlive.htm?rand=" + Math.floor(10000 + Math.random() * 90000).toString(), {
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        console.log("Scope Keep Alive: Sent keep alive request")
    }
    setInterval(makeRequest, refreshTime * 60 * 1000);
})();