// ==UserScript==
// @name         SAP AI Playground | Select GPT-4-32k Option
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically select the gpt-4-32k option for the select element with ID model
// @author       ChatGPT
// @match        https://ai-playground.cfapps.sap.hana.ondemand.com/index.html
// @grant        none
// @author       tddschn
// @downloadURL https://update.greasyfork.org/scripts/463986/SAP%20AI%20Playground%20%7C%20Select%20GPT-4-32k%20Option.user.js
// @updateURL https://update.greasyfork.org/scripts/463986/SAP%20AI%20Playground%20%7C%20Select%20GPT-4-32k%20Option.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function selectGPT4Option() {
        const selectElement = document.getElementById("model");
        if (selectElement) {
            selectElement.value = "gpt-4-32k";
            selectElement.dispatchEvent(new Event('change'));
        }
    }

    // Use a MutationObserver to handle dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
                selectGPT4Option();
            }
        });
    });

    // Set up the observer configuration
    const observerConfig = {
        childList: true,
        subtree: true,
    };

    // Start observing the document body
    observer.observe(document.body, observerConfig);

    // Call the function to select the gpt-4-32k option if the element is already in the DOM
    selectGPT4Option();
})();
