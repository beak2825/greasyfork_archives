// ==UserScript==
// @name         Better Change Request Format for Spark NZ ServiceNow
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Improve the format of change request descriptions on Spark NZ ServiceNow page
// @author       chaoscreater
// @match        https://sparknz.service-now.com/sp?id=approval*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486307/Better%20Change%20Request%20Format%20for%20Spark%20NZ%20ServiceNow.user.js
// @updateURL https://update.greasyfork.org/scripts/486307/Better%20Change%20Request%20Format%20for%20Spark%20NZ%20ServiceNow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Keywords to be bolded
    const keywordsToBold = [
        "Summary Description of  Change:",
        "Business and technical impact if change rejected:",
        "Business and technical impact if change fails:",
        "Business Impact during change (What services will not be available to users?)",
        "Technical Risk: Describe any risks associated with the Change and mitigation steps",
        "Reason for Change:",
        "Change Background:",
        "Risk and Impact Analysis :",
        "Planned Start Date :",
        "Planned End Date :",
        "Business Impact during change",
        "Short Description",
        "Customer Impact:",
        "Justification :",
        "Technical Risk:",
        "Description :",
        "Company :",
        "Risk :",
        "Impact :"
    ];

    // Function to bold keywords
    function boldKeywords() {
        const elements = document.querySelectorAll('.panel-body'); // Selecting the panel-body elements
        elements.forEach(element => {
            keywordsToBold.forEach(keyword => {
                const regex = new RegExp(`(${keyword})`, 'g');
                element.innerHTML = element.innerHTML.replace(regex, '<br><strong>$1</strong>');
            });
        });
    }

    // Run the function to bold keywords after a slight delay
    setTimeout(boldKeywords, 600); // Adjust the delay time as needed

    // Function to add line breaks around specific keywords
    function addLineBreaks() {
        const elements = document.querySelectorAll('.panel-body'); // Selecting the panel-body elements
        elements.forEach(element => {
            const htmlContent = element.innerHTML;
            const updatedContent = htmlContent.replace(/==============================================|____________________________________________________________________________|---------------------------------------------------------------------/g, '<br>$&<br>');
            element.innerHTML = updatedContent;
        });
    }

    // Run the function to add line breaks after a slight delay
    setTimeout(addLineBreaks, 600); // Adjust the delay time as needed


})();
