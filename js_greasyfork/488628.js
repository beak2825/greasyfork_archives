// ==UserScript==
// @name         1xbit1->1xstavka live URL
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Modify URL as requested
// @author       LM
// @match        https://1xbit1.com/cs/*/*/*/*
// @match        https://1xbit6.com/cs/*/*/*/*
// @match        https://1xbit7.com/cs/*/*/*/*
// @match        https://1xbit8.com/cs/*/*/*/*
// @match        https://1xbit9.com/cs/*/*/*/*
// @match        https://1xbit10.com/cs/*/*/*/*
// @match        https://1xbit11.com/cs/*/*/*/*
// @match        https://1xbit2.com/cs/*/*/*/*
// @match        https://1xbit3.com/cs/*/*/*/*
// @match        https://1xbit4.com/cs/*/*/*/*
// @match        https://1xbit5.com/cs/*/*/*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488628/1xbit1-%3E1xstavka%20live%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/488628/1xbit1-%3E1xstavka%20live%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current URL
    var currentUrl = window.location.href;

    // Extract the number after the fifth "/"
    var parts = currentUrl.split('/');
    var match = parts[7].match(/^(\d+)-/);
    var extractedNumber = match ? match[1] : null;

    if (extractedNumber) {
        // Construct the new URL with the extracted number
        var newUrl = "https://1xstavka.ru/LiveFeed/GetGameZip?id=" + extractedNumber + "&lng=en&cfview=0&isSubGames=true&GroupEvents=true&countevents=50&grMode=2";

        // Redirect to the new URL
        window.location.replace(newUrl);
    } else {
        console.error("Number extraction failed.");
    }
})();