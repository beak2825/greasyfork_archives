// ==UserScript==
// @name         Earnbitmoon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto Faucet
// @author       White
// @match        https://earnbitmoon.club/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earnbitmoon.club
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479651/Earnbitmoon.user.js
// @updateURL https://update.greasyfork.org/scripts/479651/Earnbitmoon.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElementToBeVisible(elementSelector, callback) {
        var element = document.querySelector(elementSelector);
        if (element) {
            callback(element);
        } else {
            setTimeout(function() {
                waitForElementToBeVisible(elementSelector, callback);
            }, 500);
        }
    }

    function clickButtonAfterDelay(button) {
        setTimeout(function() {
            button.click();
            setTimeout(function() {
                location.reload();
            }, 15000);
        }, 5000);
    }

    function checkVerificationComplete() {
        var divElement = document.querySelector('.iconcaptcha-modal__body-title');

        if (divElement && divElement.innerText.toLowerCase() === 'verification complete.') {
            setTimeout(function() {
                var buttonElement = document.querySelector('button.zxz');
                if (buttonElement) {
                    buttonElement.click();
                }
            }, 5000);
        } else {
            setTimeout(checkVerificationComplete, 1000);
        }
    }

    waitForElementToBeVisible('button[data-target="#modal2my"]', function(element) {
        clickButtonAfterDelay(element);
    });

    checkVerificationComplete();

})();
