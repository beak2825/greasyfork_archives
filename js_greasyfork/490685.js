// ==UserScript==
// @name         Ethos Sub2Unlock Bypasser
// @namespace    https://greasyfork.org
// @version      1.0
// @description  Bypasses Sub2Unlock.com using the Ethos API and redirects the user to the bypassed link.
// @author       Shehajeez
// @match        https://sub2unlock.com/*
// @grant        none
 
// @downloadURL https://update.greasyfork.org/scripts/490685/Ethos%20Sub2Unlock%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/490685/Ethos%20Sub2Unlock%20Bypasser.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var currenturl = window.location.href;
 
    fetch('https://ethos-testing.vercel.app/api/sub2unlock/bypass?link=' + currenturl)
        .then(response => response.json())
        .then(data => {
            console.log('redirecting to the bypassed link:', data.bypassed);
            window.location.href = data.bypassed;
        })
        .catch(error => console.error('error:', error));
})();