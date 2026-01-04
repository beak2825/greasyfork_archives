// ==UserScript==
// @name         Web Interaction Automation
// @namespace    tampermonkey.org
// @version      0.1
// @description  Automate web interactions with error handling
// @author       You
// @match        https://www.ailyze.com/ailyze/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486275/Web%20Interaction%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/486275/Web%20Interaction%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickElement(selector, errorMessage) {
        try {
            document.querySelector(selector).click();
        } catch (error) {
            console.error(errorMessage, error);
        }
    }

    function selectValue(selector, value, errorMessage) {
        try {
            document.querySelector(selector).value = value;
        } catch (error) {
            console.error(errorMessage, error);
        }
    }

    // Click on the upload file button
    clickElement("#upload_file", "Error clicking on upload file:");

    // Click on the Summarize button
    clickElement("button[value='Summarize']", "Error clicking on Summarize button:");

    // Scroll down
    try {
        window.scrollTo(0, document.body.scrollHeight);
    } catch (error) {
        console.error("Error scrolling down:", error);
    }

    // Select "Bullet points" from the dropdown
    selectValue("#id_summary", "Bullet points", "Error selecting Bullet points:");

    // Click on "Optional Instructions"
    clickElement(".fa.fa-caret-down.px-1", "Error clicking on Optional Instructions:");

    // Select "Portuguese" from the language options dropdown
    selectValue("#id_language_options", "Portuguese", "Error selecting Portuguese language:");

    // Select "Long" from the response size dropdown
    selectValue("#id_response_size", "Long", "Error selecting Long response size:");

    // Click on the Submit button
    clickElement("#submitButton", "Error clicking on Submit button:");
})();
