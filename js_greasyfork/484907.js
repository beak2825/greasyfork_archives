// ==UserScript==
// @name         [broken] Bypass atozcartoonist.com shortlink
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Bypass atozcartoonist.com link shorteners
// @author       Rust1667
// @match        https://cybercityhelp.in/*
// @match        https://www.akcartoons.in/*
// @grant        none
//
// @downloadURL https://update.greasyfork.org/scripts/484907/%5Bbroken%5D%20Bypass%20atozcartoonistcom%20shortlink.user.js
// @updateURL https://update.greasyfork.org/scripts/484907/%5Bbroken%5D%20Bypass%20atozcartoonistcom%20shortlink.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Note: some steps are redundant and do the same thing in different ways. But I don't remember which ones I could remove.

    // Step 1: Fill the field with the selector '#username'
    var usernameField = document.querySelector('#username');
    if (usernameField) {
        usernameField.value = 'https://duckduckgo.com/';
    }

    // Step 2: Click on any button with the selector '#tp982'
    var buttons1 = document.querySelectorAll('#tp982');
    if (buttons1) {
        buttons1.forEach(function(button) {
            button.click();
        });
    }

    // Step 3: Click on any button with the selector '#btn6 > button'
    var buttons2 = document.querySelectorAll('#btn6 > button');
    if (buttons2) {
        buttons2.forEach(function(button) {
            button.click();
        });
    }

    // Step 5: Click on a button with the class 'tp-btn' and 'tp-blue'
    var blueButton = document.querySelector('button.tp-btn.tp-blue');
    if (blueButton) {
        blueButton.click();
    }

    // Step 6: Redirect to links containing the domain "go.moonlinks.in"
    var linksToRedirect = document.querySelectorAll('a[href*="go.moonlinks.in"]');
    if (linksToRedirect) {
        linksToRedirect.forEach(function(link) {
            window.location.href = link.href;
        });
    }
})();
