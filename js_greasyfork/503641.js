// ==UserScript==
// @name         SAT tailored practice viewer
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description  Enhance SAT practice viewer functionality
// @author       You
// @match        https://mypractice.collegeboard.org/questionbank/tailored
// @icon         https://www.google.com/s2/favicons?sz=64&domain=collegeboard.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503641/SAT%20tailored%20practice%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/503641/SAT%20tailored%20practice%20viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add custom styles
    function GM_addStyle(css) {
        const style = document.getElementById("GM_addStyleBy8626") || (function() {
            const style = document.createElement('style');
            style.type = 'text/css';
            style.id = "GM_addStyleBy8626";
            document.head.appendChild(style);
            return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    // Apply custom styles
    GM_addStyle("#questionbank-header {display:none}");
    GM_addStyle("#tailored-review {padding-top: 0px !important; height: 700px !important;}");
    GM_addStyle(".review-window {margin: 0 !important; max-width: 100vw !important; height: 700px !important;}");
    GM_addStyle("cbw-footer {display:none !important;}");
    GM_addStyle("#header {display:none !important;}");
    GM_addStyle(".assessment-title {display: flex; flex-direction: row !important;}");
    GM_addStyle(".header {height:3vh !important;}");
    GM_addStyle(".footer {z-index:999999999 !important; position: absolute !important; width: 100vw !important; justify-content:center !important; background-color: rgba(255, 255, 255, 1); bottom:0 !important; height: 7vh !important;}");
    GM_addStyle(".tailored-question-content {height: 85vh !important; padding:20px !important;}");
    GM_addStyle(".body {overflow:clip !important; height: 90vh !important}");
    GM_addStyle(".cb-checkbox {display:none !important;}");

    // Fix the position of the tailored-answer-content
    GM_addStyle(".tailored-answer-content { position: fixed; right: 0; width: 400px; height: 85vh !important; background-color: white; padding: 20px; box-shadow: none;}");

    // Remove outermost scroll bar
    GM_addStyle("html, body { overflow: hidden !important; }");

    // Function to check the "Show me the correct answer and explanation" checkbox
    function checkAnswerCheckbox() {
        const checkbox = document.getElementById('apricot_check_11');
        if (checkbox && !checkbox.checked) {
            checkbox.click(); // Simulate a user click to check the checkbox
        }
    }

    // Function to uncheck the "Show me the correct answer and explanation" checkbox
    function uncheckAnswerCheckbox() {
        const checkbox = document.getElementById('apricot_check_11');
        if (checkbox && checkbox.checked) {
            checkbox.click(); // Simulate a user click to uncheck the checkbox
        }
    }

    // Function to handle answer choice selection
    function handleAnswerSelection(event) {
        event.target.click(); // Simulate the click to select the answer choice
        setTimeout(checkAnswerCheckbox, 50); // Display the correct answer shortly after
    }

    // Function to attach event listeners to answer choices
    function attachAnswerListeners() {
        const answerChoices = document.querySelectorAll('.cb-radio input[type="radio"]');
        answerChoices.forEach(choice => {
            choice.addEventListener('click', handleAnswerSelection);
        });
    }

    // Function to attach event listener to the "Next" button
    function attachNextButtonListener() {
        const nextButton = document.querySelector('div.skip-next button.cb-btn.cb-btn-primary[data-cbtrack-comp="apricot-react:button"]');
        if (nextButton) {
            nextButton.addEventListener('click', uncheckAnswerCheckbox);
        }
    }

    // Continuously check for the presence of elements and attach listeners
    function continuousCheck() {
        attachAnswerListeners();
        attachNextButtonListener();
        setTimeout(continuousCheck, 500); // Re-run the check every 500ms
    }

    // Run the initial setup when the page loads
    window.addEventListener('load', continuousCheck);

})();
