// ==UserScript==
// @name         Auto Click Script for friend.tech
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically click the star element when it is off
// @author       Your Name
// @match        https://www.friend.tech/*
// @grant        none
// @license      风无向  
// @downloadURL https://update.greasyfork.org/scripts/476187/Auto%20Click%20Script%20for%20friendtech.user.js
// @updateURL https://update.greasyfork.org/scripts/476187/Auto%20Click%20Script%20for%20friendtech.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndClickStar() {
        // Use the given XPath to find the image element
        const xpath = '/html/body/div/div/div/div/div[2]/div/div[4]/div[2]/div[2]/div[3]/img';
        const imgElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // If the image element is found and its src attribute is "starOff.svg", click it
        if (imgElement && imgElement.src.endsWith('starOff.svg')) {
            imgElement.click();
            console.log('Clicked the star element.');
        }
    }

    // Set the interval to check and click the star element every 3 seconds
    setInterval(checkAndClickStar, 3000);
})();
