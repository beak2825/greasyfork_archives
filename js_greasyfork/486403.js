// ==UserScript==
// @name         Auto Coins
// @namespace    https://bot-hosting.net/
// @version      1.0
// @description  Automaticly claim coins on bot-hosting.net (You still need to complete captcha)
// @author       Gyro3630
// @match        https://bot-hosting.net/*
// @grant        none
// @license      MIT
// @icon         https://bot-hosting.net/assets/img/bothosting2.png
// @downloadURL https://update.greasyfork.org/scripts/486403/Auto%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/486403/Auto%20Coins.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function debounce(func, wait) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, arguments), wait);
        };
    }

    function clickOnClaim() {
        var boutonXPath = "/html/body/div[1]/div/section/section/article/div/main/div[1]/div/div[1]/div/div/button"; // Claim button XPath
        var bouton = document.evaluate(boutonXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (bouton) {
            bouton.click();
        }
    }

    var observer = new MutationObserver(debounce(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                clickOnClaim();
            }
        });
    }, 1000));

    var config = { subtree: true, childList: true };
    observer.observe(document.body, config);

    clickOnClaim();
})();