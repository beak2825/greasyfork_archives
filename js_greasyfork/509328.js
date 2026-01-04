// ==UserScript==
// @name         Auto Submit Form
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically submits form every 2 seconds on specified page by simulating button click on the first visible input[type="submit"] button
// @author       You
// @match        http://u.ilhjy.cn/index.php?m=Wxcx&a=testt
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509328/Auto%20Submit%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/509328/Auto%20Submit%20Form.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function simulateClickSubmitButton() {
        const submitButtons = document.querySelectorAll('input[type="submit"]');
        for (const submitButton of submitButtons) {
            if (submitButton.offsetParent !== null) { // Check if the button is visible
                // Create a new event
                const event = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                // Dispatch the event to the submit button
                submitButton.dispatchEvent(event);
                break; // Exit loop after clicking the first visible button
            }
        }
    }

    setInterval(simulateClickSubmitButton, 2000); // 2000 milliseconds = 2 seconds

})();
