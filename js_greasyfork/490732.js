// ==UserScript==
// @name         Ethos SocialWolvez Bypasser
// @namespace    https://greasyfork.org
// @version      1.1
// @description  Bypasses SocialWolvez.com using the Ethos API and redirects the user to the bypassed link.
// @author       Shehajeez
// @match        https://socialwolvez.com/app/l/*
// @exclude      https://socialwolvez.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/490732/Ethos%20SocialWolvez%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/490732/Ethos%20SocialWolvez%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currenturl = window.location.href;

    fetch('https://ethos-testing.vercel.app/api/socialwolvez/bypass?link=' + currenturl)
        .then(response => response.json())
        .then(data => {
            console.log('redirecting to the bypassed link:', data.bypassed);
            window.location.href = data.bypassed;
        })
        .catch(error => console.error('error:', error));
})();