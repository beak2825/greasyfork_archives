// ==UserScript==
// @name         SurferSEO Trigger Share & copy links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to trigger the "Share" action on SurferSEO drafts and automatically copies the link text, with a popup notification when copied.
// @match        https://app.surferseo.com/drafts/*
// @grant        none
// @author       mhshan
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517827/SurferSEO%20Trigger%20Share%20%20copy%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/517827/SurferSEO%20Trigger%20Share%20%20copy%20links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to create the custom button
    function createCustomButton() {
        const button = document.createElement('button');
        button.textContent = 'Trigger Share & copy link';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '800px';
        button.style.padding = '10px';
        button.style.backgroundColor = '#FA4032';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.zIndex = '1000';

        // Append button to body
        document.body.appendChild(button);

        // Add click event to the button
        button.addEventListener('click', function () {
            // Find and click the "Share" button
            const shareButton = document.querySelector('button[data-tour="share-content-editor"]');
            if (shareButton) {
                shareButton.click();
                console.log("Share button clicked.");
                setTimeout(copyLinkText, 100); // Wait for 1 seconds before attempting to copy the link
            } else {
                alert('Share button not found.');
            }
        });
    }

    // Function to copy the text content of the link element
    function copyLinkText() {
        // Wait for the link element to be present
        const linkElement = document.querySelector("span.block.truncate");

        if (linkElement) {
            // Get the text content of the link element
            let textContent = linkElement.textContent;

            // Create a temporary textarea to copy the text content to the clipboard
            const textArea = document.createElement('textarea');
            textArea.value = textContent;
            document.body.appendChild(textArea);

            // Select the text in the textarea
            textArea.select();
            textArea.setSelectionRange(0, 99999); // For mobile devices

            // Copy the selected text to the clipboard
            document.execCommand('copy');

            // Clean up by removing the temporary textarea
            document.body.removeChild(textArea);

            console.log("Link text copied:", textContent);

            // Show the popup notification
            showCopiedNotification();
        } else {
            console.log("Link element not found.");
        }
    }

    // Function to show a popup notification with animation
    function showCopiedNotification() {
        const notification = document.createElement('div');
        notification.textContent = 'Link copied!';
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '400px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = '#99FF74';
        notification.style.color = '#00681C';
        notification.style.borderRadius = '5px';
        notification.style.fontSize = '14px';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease-out';
        document.body.appendChild(notification);

        // Trigger the fade-in animation
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // After 2 seconds, fade out and remove the notification
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500); // After the fade-out animation finishes
        }, 2000);
    }

    // Wait until the page has fully loaded
    window.addEventListener('load', function () {
        // Create the custom button
        createCustomButton();
    });
})();
