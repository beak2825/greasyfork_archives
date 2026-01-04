// ==UserScript==
// @name         Keyboard shortcuts for question navigation
// @version      1.2
// @description  Navigate UWorld using z,x,m keys
// @author       akavi
// @match        https://apps.uworld.com/*
// @namespace https://greasyfork.org/users/1303229
// @downloadURL https://update.greasyfork.org/scripts/495296/Keyboard%20shortcuts%20for%20question%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/495296/Keyboard%20shortcuts%20for%20question%20navigation.meta.js
// ==/UserScript==

(function() {
    document.addEventListener('keydown', function(event) {
        if (event.key === 'z') {
            // Query the specific element based on the provided selector
            var element = document.querySelector('body > app-root > usmle-test-interface > testinterface-usmle-mainlayout > div > nbme-layout > div > div.nbme-body > nbme-header > div > div:nth-child(2) > a.step2.medium-screen-icon.ng-star-inserted');

            // Check if the element exists and is visible
            if (element && window.getComputedStyle(element).display !== 'none') {
                // Simulate a click on the element
                element.click();
            }
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'x') {
            // Query the specific element based on the provided selector
            var element = document.querySelector('body > app-root > usmle-test-interface > testinterface-usmle-mainlayout > div > nbme-layout > div > div.nbme-body > nbme-header > div > div:nth-child(2) > a.step3.medium-screen-icon');

            // Check if the element exists and is visible
            if (element && window.getComputedStyle(element).display !== 'none') {
                // Simulate a click on the element
                element.click();
            }
        }
    });
    window.addEventListener('keydown', function(e) {
        // Check if the pressed key is 'm'
        if (e.key === 'm') {
            // Check if Shift and Option keys are pressed simultaneously
            if (e.shiftKey && e.altKey) {
                // Prevent the default 'm' key behavior
                e.preventDefault();

                // Simulate a new keydown event for Shift+Option+M
                var simulatedEvent = new KeyboardEvent('keydown', {
                    key: 'M',
                    code: 'KeyM',
                    keyCode: 77,
                    shiftKey: true,
                    altKey: true,
                });

                // Dispatch the simulated event
                document.dispatchEvent(simulatedEvent);
            } else{
                var element = document.querySelector("body > app-root > usmle-test-interface > testinterface-usmle-mainlayout > div > nbme-layout > div > div.nbme-body > nbme-header > div > div:nth-child(1) > a.step1.d-none.d-md-flex.bookmark-question.ng-star-inserted")

                // Check if the element exists and is visible
                if (element && window.getComputedStyle(element).display !== 'none') {
                    // Simulate a click on the element
                    element.click();
                }
           }
        }
    });
})();
