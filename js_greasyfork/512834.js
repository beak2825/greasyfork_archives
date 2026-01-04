// ==UserScript==
// @name         JIRA Copy
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  Copy Copy Copy!
// @author       alex4814
// @match        http://jira.sanguosha.com:8080/browse/PX*
// @match        http://jira.sanguosha.com:8080/secure/RapidBoard.jspa*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sanguosha.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512834/JIRA%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/512834/JIRA%20Copy.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Get the current page URL
    const currentURL = window.location.href;

    // If the URL matches address A
    if (currentURL.includes('browse/PX')) {
        addSingle();
    }

    // If the URL matches address B
    if (currentURL.includes('secure/RapidBoard.jspa')) {
        addMultiple();
    }

    // Function to run for Address A
    function addSingle() {
        // Wait until the DOM is fully loaded
        window.addEventListener('load', function () {
            // Find the div with class "aui-toolbar2-inner" within the element with id "stalker"
            const toolbarInnerDiv = document.querySelector('#stalker .aui-toolbar2-primary');

            // Check if the div exists
            if (toolbarInnerDiv) {
                // Create a new div to wrap the button
                const wrapperDiv = document.createElement('div');
                wrapperDiv.classList.add('aui-buttons', 'pluggable-ops'); // Apply the required classes

                // Create a new button element
                const button = document.createElement('button');
                button.innerText = '复制单号标题';

                // Style the button (optional)
                button.style.marginRight = '10px'; // Adds some spacing from other elements
                button.classList.add('aui-button'); // Add any existing button styling class if needed

                // Append the button to the wrapper div
                wrapperDiv.appendChild(button);

                // Insert the button at the first position in the toolbarInnerDiv
                toolbarInnerDiv.insertBefore(wrapperDiv, toolbarInnerDiv.firstChild);

                // Add event listener to the button
                button.addEventListener('click', function () {
                    // Get the text content from the two divs
                    const issueKeyText = document.getElementById('key-val')?.textContent.trim();
                    const summaryText = document.getElementById('summary-val')?.textContent.trim();

                    // Check if both divs exist and have content
                    if (issueKeyText && summaryText) {
                        const combinedText = `#${issueKeyText} ${summaryText}`;

                        // Copy the combined text to the clipboard
                        copyToClipboard(combinedText);
                    } else {
                        alert('Could not find both issue key and summary elements!');
                    }
                });
            } else {
                console.error('Could not find the div with class "aui-toolbar2-inner" inside #stalker.');
            }
        });
    }

    function addMultiple() {
        // Wait until the DOM is fully loaded
        window.addEventListener('load', function () {
            // Find all li elements under #ghx-pool that contain the .ghx-issue-content div
            const listItems = document.querySelectorAll('#ghx-pool li .ghx-issue-content');

            // Iterate over each .ghx-issue-content div
            listItems.forEach(function (ghxContentDiv) {
                // Get all the child divs inside the .ghx-issue-content div
                const childDivs = ghxContentDiv.children;

                // Check if there are exactly 2 child divs
                if (childDivs.length === 2) {
                    // Create a new button element
                    const button = document.createElement('button');
                    button.innerText = '复制单号标题';

                    // Style the button (optional)
                    //button.classList.add('aui-button'); // Add button styling class if needed

                    // Insert the button between the two child divs
                    ghxContentDiv.insertBefore(button, childDivs[1]);

                    // Add event listener to the button
                    button.addEventListener('click', function () {
                        // Find the ghx-issue-fields div
                        const issueFieldsDiv = ghxContentDiv.closest('li').querySelector('.ghx-issue-fields');

                        if (issueFieldsDiv) {
                            // Get the title from the a tag under the ghx-key div
                            const issueKey = issueFieldsDiv.querySelector('.ghx-key a')?.getAttribute('title');
                            // Get the title from the ghx-summary div
                            const issueSummary = issueFieldsDiv.querySelector('.ghx-summary')?.getAttribute('title');

                            // Check if both elements exist
                            if (issueKey && issueSummary) {
                                // Combine the text
                                const combinedText = `#${issueKey} ${issueSummary}`;

                                // Copy the combined text to the clipboard
                                copyToClipboard(combinedText);
                            } else {
                                alert('Could not find issue key or summary!');
                            }
                        } else {
                            alert('Could not find ghx-issue-fields div!');
                        }
                    });
                }
            });
        });
    }

    // Helper function to copy text to clipboard
    function copyToClipboard(text) {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    }
})();