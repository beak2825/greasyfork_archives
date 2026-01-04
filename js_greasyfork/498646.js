// ==UserScript==
// @name         MBA 自动刷题
// @namespace    http://tampermonkey.net/
// @version      6.9.1
// @license MIT
// @description  自动刷题
// @author       Your Name
// @match        https://academyeurope.eu/lp-courses/mba-diploma-program/master-of-business-administration/lessons/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498646/MBA%20%E8%87%AA%E5%8A%A8%E5%88%B7%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/498646/MBA%20%E8%87%AA%E5%8A%A8%E5%88%B7%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickCompleteButton() {
        // Select the complete button using its class name
        const completeButton = document.querySelector('.lp-button.button.button-complete-item.button-complete-lesson.lp-btn-complete-item');

        // Check if the button exists, then click it
        if (completeButton) {
            completeButton.click();
            console.log('Complete button clicked.');
            setTimeout(clickYesButton, 1000); // Wait for the modal to appear before clicking Yes
        } else {
            console.log('Complete button not found.');
        }
    }

    function clickYesButton() {
        // Select the Yes button in the modal
        const yesButton = document.querySelector('.lp-modal-footer .btn-yes');

        // Check if the Yes button exists, then click it
        if (yesButton) {
            yesButton.click();
            console.log('Yes button clicked.');
        } else {
            console.log('Yes button not found.');
        }
    }

    // Wait for the DOM to be fully loaded before trying to click the button
    window.addEventListener('load', function() {
        setTimeout(clickCompleteButton, 2000); // Adjust the delay if necessary
    });

})();
