// ==UserScript==
// @name         Confirm Pyong Button
// @version      1.0
// @description  Show a confirmation alert before clicking the pyong button
// @license MIT
// @author       Fri
// @match        https://genius.com/*
// @grant        none
// @namespace https://greasyfork.org/users/944448
// @downloadURL https://update.greasyfork.org/scripts/495388/Confirm%20Pyong%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/495388/Confirm%20Pyong%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Tampermonkey script loaded and running.');

    const buttons = document.querySelectorAll('.pyong_button.header_with_cover_art-pyong_button, .LabelWithIcon__Container-hjli77-0.hrQuZg');

    if (buttons.length > 0) {
        console.log(`Found ${buttons.length} button(s).`);

        buttons.forEach(button => {
            let isConfirmationHandled = false;

            button.addEventListener('click', function(event) {
                if (!isConfirmationHandled) {
                    event.preventDefault();
                    event.stopPropagation();

                    const userConfirmed = confirm('Are you sure you want to perform this action?');

                    if (userConfirmed) {
                        isConfirmationHandled = true;
                        button.click();
                    }
                } else {
                    isConfirmationHandled = false;
                }
            }, true);
        });
    } else {
        console.log('No buttons found.');
    }
})();
