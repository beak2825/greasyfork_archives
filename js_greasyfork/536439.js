// ==UserScript==
// @name         SBAuto Randomized (2025 Update)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Automatically answers Swagbucks surveys with randomized dropdown options and submits them until no questions remain. Now more compatible with current site structure (2025). 🌀
// @author       Thaswasupbreh
// @match        *://www.swagbucks.com/surveys*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536439/SBAuto%20Randomized%20%282025%20Update%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536439/SBAuto%20Randomized%20%282025%20Update%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const interval = 1000; // Time interval in milliseconds

    function clickRandomDropdownOption() {
        // Find a visible dropdown
        const dropdown = document.querySelector("div[class*='DropdownContainer'], div[class*='questionDropdown']");
        if (dropdown) dropdown.click();

        // Find options inside an open dropdown
        const options = document.querySelectorAll("div[class*='DropdownOptions'] span, div[class*='questionDropdownOptions'] span");
        if (options.length > 0) {
            const randomIndex = Math.floor(Math.random() * options.length);
            options[randomIndex].click();
        }
    }

    function clickSubmitButton() {
        // Looks for button that continues to next question
        const button = document.querySelector("button[class*='CTA'], button[class*='continue'], button[class*='Next']");
        if (button) button.click();
    }

    function autoAnswer() {
        try {
            clickRandomDropdownOption();
            clickSubmitButton();
        } catch (e) {
            console.error("SBAuto Error:", e);
        }
    }

    window.addEventListener('load', () => {
        setInterval(autoAnswer, interval);
    });
})();
