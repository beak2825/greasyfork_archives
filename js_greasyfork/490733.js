// ==UserScript==
// @name         Ethos Sub2Get Bypasser
// @namespace    https://greasyfork.org
// @version      1.1
// @description  Bypasses Sub2Get.com using the Ethos API and redirects the user to the bypassed link.
// @author       Shehajeez
// @match        https://www.sub2get.com/link?l=*
// @exclude      https://sub2get.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/490733/Ethos%20Sub2Get%20Bypasser.user.js
// @updateURL https://update.greasyfork.org/scripts/490733/Ethos%20Sub2Get%20Bypasser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currenturl = window.location.href;

    fetch('https://ethos-testing.vercel.app/api/sub2get/bypass?link=' + currenturl)
        .then(response => response.json())
        .then(data => {
            console.log('redirecting to the bypassed link:', data.bypassed);
            window.location.href = data.bypassed;
        })
        .catch(error => console.error('error:', error));
})();