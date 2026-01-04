// ==UserScript==
// @name         Remove Specific Ad Containers on GameBanana
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically removes specific ad container divs by ID on GameBanana
// @match        https://gamebanana.com/*
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/514472/Remove%20Specific%20Ad%20Containers%20on%20GameBanana.user.js
// @updateURL https://update.greasyfork.org/scripts/514472/Remove%20Specific%20Ad%20Containers%20on%20GameBanana.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAdContainers() {
        const adContainer1 = document.getElementById("google_ads_iframe_/154013155,21667764984/1024309/72721/1024309-72721-bottom_rail_0__container__");
        const adContainer2 = document.getElementById("pw-oop-bottom_rail");

        if (adContainer1) {
            adContainer1.remove();
            console.log("First ad container removed.");
        }
        if (adContainer2) {
            adContainer2.remove();
            console.log("Second ad container removed.");
        }
    }

    // Run the function initially and on page load completion
    removeAdContainers();
    window.addEventListener("load", removeAdContainers);
    document.addEventListener("DOMNodeInserted", removeAdContainers);
})();