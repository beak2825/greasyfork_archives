// ==UserScript==
// @name         IDP - Start Auto Approve Process
// @namespace    http://tampermonkey.net/
// @version      2025-06-19
// @description  Adds an input for environment and a button to start auto-approving by opening the self-service iframe in a new tab.
// @match        https://idp.cmh.platform-cicd.evinternal.net/**
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517192/IDP%20-%20Start%20Auto%20Approve%20Process.user.js
// @updateURL https://update.greasyfork.org/scripts/517192/IDP%20-%20Start%20Auto%20Approve%20Process.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Script to open self-service iframe in a new tab is running.");

    let checkInterval;

    /**
     * Function to check for the iframe and open it in a new tab if found.
     */
    function checkForIframe() {
        const iframe = document.querySelector('iframe[title="IDP Orchestrator"]');
        const environment = document.getElementById('envInput').value.trim(); // Get environment from input

        if (iframe && iframe.src) {
            // Parse the iframe's src URL and add the "environment" parameter
            let url = new URL(iframe.src);
            url.searchParams.set("environment", environment); // Set the environment parameter to input value

            console.log("Iframe with class 'self-service-frame' found. Opening in a new tab:", url.toString());

            // Open the modified URL in a new tab
            window.open(url.toString(), '_blank');
            clearInterval(checkInterval); // Stop further checks
        } else {
            console.log("Iframe not found yet, continuing to check...");
        }
    }

    /**
     * Function to start the interval for auto-approve.
     */
    /**function startAutoApprove() {
        console.log("Auto-approve started.");
        checkInterval = setInterval(checkForIframe, 1000); // Check every second
    }*/

    /**
     * Function to create and add the input field and "Start Auto Approve" button to the page.
     */
    function addAutoApproveUI() {
        // Create the input field for environment
        const input = document.createElement('input');
        input.id = 'envInput';
        input.type = 'text';
        input.value = 'test'; // Default value
        input.placeholder = 'Enter environment';
        input.style.position = 'fixed';
        input.style.top = '10px';
        input.style.right = '120px';
        input.style.zIndex = '1000';
        input.style.padding = '10px';
        input.style.borderRadius = '5px';
        input.style.border = '1px solid #ccc';

        // Create the "Start Auto Approve" button
        const button = document.createElement('button');
        button.innerText = 'Start Auto Approve';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '10px 20px';
        button.style.backgroundColor = 'black';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // Add click event to start auto-approve when button is clicked
        button.addEventListener('click', checkForIframe);

        // Append elements to the document body
        document.body.appendChild(input);
        document.body.appendChild(button);
    }

    // Add the input and button to the page
    addAutoApproveUI();

})();