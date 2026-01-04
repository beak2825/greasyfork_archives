// ==UserScript==
// @name         SBAuto Randomized
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Automates Swagbucks surveys with randomized answers until no questions remain
// @author       Thaswasupbreh
// @match        http://www.swagbucks.com/surveys?t=1&m=17&a=1&s=44834408&ls=7
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536438/SBAuto%20Randomized.user.js
// @updateURL https://update.greasyfork.org/scripts/536438/SBAuto%20Randomized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const autoClickInterval = 1000; // Interval in ms

    setInterval(() => {
        try {
            const dropdownContainer = document.querySelector(".questionDropdownContainer");
            if (dropdownContainer) dropdownContainer.click();

            const optionsContainer = document.querySelector(".questionDropdownOptions");
            const options = optionsContainer ? optionsContainer.querySelectorAll("span") : [];

            if (options.length > 0) {
                const randomIndex = Math.floor(Math.random() * options.length);
                options[randomIndex].click();
            }

            const submitButton = document.querySelector(".surveyQuestionCTA button");
            if (submitButton) submitButton.click();
        } catch (err) {
            console.error("SBAuto Error:", err);
        }
    }, autoClickInterval);
})();
