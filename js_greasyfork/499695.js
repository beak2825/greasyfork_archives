// ==UserScript==
// @name         Amazon Music Dashboard URL Generator
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @author       Ci
// @description  Extract info from JSON and generate dashboard URL
// @match        https://us-west-2.console.aws.amazon.com/states/home*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499695/Amazon%20Music%20Dashboard%20URL%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/499695/Amazon%20Music%20Dashboard%20URL%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!(window.location.href.includes('809131571469:execution:TestRunExcutionStateMachine'))) {
        console.log('disable script when not in "TestRunExcutionStateMachine"')
        return;
    }

    function extractAndProcessJSON() {

        (function clickButtonByText() {
            const spanText = "Execution input and output";
            const spanElements = document.querySelectorAll('span');

            for (const span of spanElements) {
                if (span.textContent.trim() === spanText) {
                    const button = span.closest('button');
                    if (button) {
                        button.click();
                        console.log('Button clicked');
                        return;
                    }
                }
            }
            console.log('Button not found');
        })()

        // Get all elements with the class 'CodeMirror-code'
        const elements = document.querySelectorAll('.CodeMirror-code');

        // Check if we have at least two elements
        if (elements.length < 2) {
            console.error('You need to click the tab "Execution input and output" and output must be available')
            return;
        }

        // Get the second .CodeMirror-code element
        const element = elements[1];

        // Clone the element to avoid modifying the original DOM
        const clonedElement = element.cloneNode(true);

        // Remove line number elements
        const lineNumbers = clonedElement.querySelectorAll('.CodeMirror-linenumber');
        lineNumbers.forEach(el => el.remove());

        // Extract text content, excluding line numbers
        let jsonText = clonedElement.textContent;

        // Remove any leading/trailing whitespace and newlines
        jsonText = jsonText.trim();

        try {
            // Parse the JSON
            const jsonData = JSON.parse(jsonText);

            // Extract the required fields
            const testRunRequest = jsonData.testRunRequest || {};
            const uuid = testRunRequest.uuid || 'N/A';
            const appBuildVersion = testRunRequest.appBuildVersion || 'N/A';
            const deviceType = testRunRequest.deviceType || 'N/A';

            // Extract DtestType from the first device in deviceInfoList
            let dtestType = 'N/A';
            if (testRunRequest.deviceInfoList && testRunRequest.deviceInfoList.length > 0) {
                dtestType = testRunRequest.deviceInfoList[0].DtestType || 'N/A';
            }

            // Construct the URL
            const baseUrl = 'https://dashboard-qa.music.amazon.dev/pages/suiteresult';
            const params = new URLSearchParams({
                platform: deviceType,
                testname: dtestType,
                appversion: appBuildVersion,
                testrunid: uuid
            });
            const fullUrl = `${baseUrl}?${params.toString()}`;

            // Open the URL in a new tab
            window.open(fullUrl, '_blank');

        } catch (error) {
            console.error('Error parsing JSON:', error);
            console.log('Attempting to extract information without parsing...');

            // Fallback extraction method
            const uuidMatch = jsonText.match(/"uuid":\s*"([^"]+)"/);
            const appBuildVersionMatch = jsonText.match(/"appBuildVersion":\s*"([^"]+)"/);
            const deviceTypeMatch = jsonText.match(/"deviceType":\s*"([^"]+)"/);
            const dtestTypeMatch = jsonText.match(/"DtestType":\s*"([^"]+)"/);

            const uuid = uuidMatch ? uuidMatch[1] : 'N/A';
            const appBuildVersion = appBuildVersionMatch ? appBuildVersionMatch[1] : 'N/A';
            const deviceType = deviceTypeMatch ? deviceTypeMatch[1] : 'N/A';
            const dtestType = dtestTypeMatch ? dtestTypeMatch[1] : 'N/A';

            // Construct the URL
            const baseUrl = 'https://dashboard-qa.music.amazon.dev/pages/suiteresult';
            const params = new URLSearchParams({
                platform: deviceType,
                testname: dtestType,
                appversion: appBuildVersion,
                testrunid: uuid
            });
            const fullUrl = `${baseUrl}?${params.toString()}`;

            // Open the URL in a new tab
            window.open(fullUrl, '_blank');
        }
    }

    function createNavigationButton() {
        const button = document.createElement('button');
        button.textContent = 'Navigate to Dashboard';
        button.style.position = 'fixed';
        button.style.bottom = '40px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.fontSize = '16px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = extractAndProcessJSON;
        document.body.appendChild(button);
    }

    // Add an event listener for Ctrl+I or Cmd+I
    window.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'i') {
            extractAndProcessJSON();
            event.preventDefault();
        }
    });

    // Run the function to create the button when the page is fully loaded
    window.addEventListener('load', createNavigationButton);
})();
