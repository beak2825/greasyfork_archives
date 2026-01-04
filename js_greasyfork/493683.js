// ==UserScript==
// @name         Ethos MediaFire Bypasser / Auto Downloader
// @namespace    https://ethos-testing.vercel.app
// @version      1.0
// @description  Bypasses MediaFire using the Ethos API and downloads the content automatically for the user,
// @author       Shehajeez
// @match        https://mediafire.com/*
// @match        https://www.mediafire.com/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/493683/Ethos%20MediaFire%20Bypasser%20%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/493683/Ethos%20MediaFire%20Bypasser%20%20Auto%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currenturl = window.location.href;

    fetch('https://ethos-testing.vercel.app/api/adlinks/bypass?url=' + currenturl)
        .then(response => response.json())
        .then(data => {
            console.log('redirecting to the bypassed link:', data.bypassed);
            window.location.href = data.bypassed;
        })
        .catch(error => console.error('error:', error));
})();