// ==UserScript==
// @name         J2download.com Video Link Injector
// @namespace    https://violentmonkey.github.io/
// @version      1.0
// @description  Get the video link from q parameter in the URL, autofill the input field and click download button automatically
// @author       Streampunk
// @icon         data:image/png;base64,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
// @match        https://j2download.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538014/J2downloadcom%20Video%20Link%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/538014/J2downloadcom%20Video%20Link%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get URL parameter by name
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\\[\\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // Retrieve the 'q' parameter from URL
    const qValue = getParameterByName('q');

    if (qValue) {
        // Function to attempt filling the input and clicking the button
        const tryFillAndClick = () => {
            const inputField = document.querySelector("#url"); // Replace with correct selector if needed
            const button = document.querySelector("#hero > div > form > button"); // Your button selector

            if (inputField && button) {
                // Fill the input field with the link
                inputField.value = qValue;

                // Trigger input and change events to notify any listeners
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.dispatchEvent(new Event('change', { bubbles: true }));

                // Wait a moment to ensure the page processes the input
                setTimeout(() => {
                    // Click the button
                    button.click();
                }, 300); // Adjust delay if needed
            } else {
                // If elements are not yet available, retry after a short delay
                setTimeout(tryFillAndClick, 200);
            }
        };

        // Start the process with a delay
        setTimeout(tryFillAndClick, 500);
    }
})();