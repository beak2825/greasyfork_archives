// ==UserScript==
// @name         Cookie Clicker Autoclicker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autoclicker for Cookie Clicker to increase cookie count automatically.
// @author       YourName
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=orteil.dashnet.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489505/Cookie%20Clicker%20Autoclicker.user.js
// @updateURL https://update.greasyfork.org/scripts/489505/Cookie%20Clicker%20Autoclicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = null;

    function startAutoclicker() {
        intervalId = setInterval(clickCookie, 0.00001);
        console.log("Autoclicker started.");
    }

    function stopAutoclicker() {
        clearInterval(intervalId);
        console.log("Autoclicker stopped.");
    }

    function clickCookie() {
        const bigCookie = document.getElementById("bigCookie");
        if (bigCookie) {
            bigCookie.click();
        }
    }

    startAutoclicker();
})();
