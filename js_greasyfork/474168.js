// ==UserScript==
// @name         TvaNouvelle Bypass Ad Detection
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Bypasses TvaNouvelle adblock detection by simpy deleting some elements (use Ublock Origin as it bypasses it and this just makes the page better)
// @author       You
// @match        https://www.tvanouvelles.ca/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474168/TvaNouvelle%20Bypass%20Ad%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/474168/TvaNouvelle%20Bypass%20Ad%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xpathsToDelete = [
        "/html/body/div[4]",
        '//*[@id="myTopBarSticky"]/div[1]'
    ];

    xpathsToDelete.forEach(function(xpath) {
        var targetElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (targetElement) {
            targetElement.remove();
        }
    });

    var consoleSnippet = '$("body").css({"overflow":"visible"});';
    var script = document.createElement('script');
    script.textContent = consoleSnippet;
    document.body.appendChild(script);
})();
