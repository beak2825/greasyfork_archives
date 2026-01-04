// ==UserScript==
// @name         HVG Push Hide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide the annoying push notification div on HVG.hu
// @author       wirhock
// @license      MIT
// @match        https://hvg.hu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525139/HVG%20Push%20Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/525139/HVG%20Push%20Hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the push notification div
    function hidePushNotification() {
        var pushDiv = document.getElementById('webpushSelctorFormId');
        if (pushDiv) {
            pushDiv.style.display = 'none';
        }
    }

    // Run the function when the page loads
    window.onload = hidePushNotification;

    // Also run the function if new elements are added to the page (optional)
    var observer = new MutationObserver(hidePushNotification);
    observer.observe(document.body, { childList: true, subtree: true });
})();
