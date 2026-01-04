// ==UserScript==
// @name         Jira New Tab Flow: Open Tickets in a New Tab, Not in Popup
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Enhance your Jira experience open any clicked issue in a new tab
// @icon         https://static-00.iconduck.com/assets.00/jira-icon-512x512-kkop6eik.png
// @author       Ameer Jamal
// @match        https://*.atlassian.net/jira/*
// @match        https://*.atlassian.com/jira/*
// @grant        none
// @require      https://unpkg.com/sweetalert@2/dist/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/472454/Jira%20New%20Tab%20Flow%3A%20Open%20Tickets%20in%20a%20New%20Tab%2C%20Not%20in%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/472454/Jira%20New%20Tab%20Flow%3A%20Open%20Tickets%20in%20a%20New%20Tab%2C%20Not%20in%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Variables to store state information
    let lastSelectedIssue = null; // The last issue that was selected
    let isActive = true; // Whether the script is currently active
    let escapeHitCounter = 0; // Count of consecutive "Ctrl" key presses
    let justActivated = true; // Flag to indicate that the script was just activated
    let button = null; // Button for toggling script activation
    let buttonActiveText = 'Tickets Currently Open  in New Tab'; // Text for when the script is enabled
    let buttonInactiveText ='Tickets Currently Open in SideBar' ; // Text for when script is disabled
    let Red = "#DE350B"
    let Green = "#1F875A"
    // Function to toggle the active state of the script
    const toggleActiveState = () => {
        isActive = !isActive; // Toggle active state
        if (isActive) {
            justActivated = true;
            swal({ // Show a success alert when activated
                title: "Clicking on a ticket now opens it in a new tab",
                icon: "success",
                buttons: false,
                timer: 1500,
                allowEscapeKey: false
            });
        } else {
            lastSelectedIssue = null;
            swal({ // Show an error alert when deactivated
                title: "Clicking on a ticket opens in the sidebar as default",
                icon: "error",
                buttons: false,
                timer: 1500,
                allowEscapeKey: false
            });
        }

        // Update the button text and color based on the current state
        if (button) {
    button.textContent = !isActive ? buttonInactiveText : buttonActiveText; // Set the button text content
    button.style.color = 'white'; // Set the button text color
    button.style.backgroundColor = !isActive ? Red : Green; // Set the button background color
        }

        // Reset the control key press counter
        escapeHitCounter = 0;
    };

    // Function to check if a new issue is selected
    const checkForSelectedIssue = () => {
        if (!isActive) { // Skip if the script is not active
            return;
        }

        // Get the currently selected issue
        const urlParams = new URLSearchParams(window.location.search);
        const urlDomain = window.location.hostname;
        const selectedIssue = urlParams.get('selectedIssue');

        // Open the selected issue in a new tab if it's different from the last one
        if (selectedIssue && selectedIssue !== lastSelectedIssue && !justActivated) {
            window.open(`https://${urlDomain}/browse/${selectedIssue}`, '_blank');
        }

        lastSelectedIssue = selectedIssue;
        justActivated = false;
    };

    // Create a mutation observer to detect DOM changes
    const observer = new MutationObserver(checkForSelectedIssue);

    // Start observing the body of the page for changes in the child list and the subtree
    observer.observe(document.querySelector('body'), {
        childList: true,
        subtree: true
    });

    // Add an event listener for the keyup event
    window.addEventListener('keyup', (event) => {
        // Check if the "Ctrl" key was pressed
        if (event.key === 'Control') {
            escapeHitCounter += 1;

            // Toggle active state if the "Ctrl" key was pressed twice in a row
            if (escapeHitCounter === 2) {
                toggleActiveState();
            }

            // Reset the control key press counter after a short delay
            setTimeout(() => {
                escapeHitCounter = 0;
            }, 300);
        }
    });

    // Function to create the button for toggling script activation
    const createButton = () => {
    button = document.createElement('span'); // Create a new span element
    button.setAttribute('class', 'css-1gd7hga'); // Set the class attribute
    button.textContent = !isActive ? buttonInactiveText : buttonActiveText; // Set the button text content
    button.style.color = 'white'; // Set the button text color
    button.style.backgroundColor = !isActive ? Red : Green; // Set the button background color
    button.style.borderRadius = '10px'; // Round the corners of the button
    button.style.cursor = 'pointer'; // Change the cursor when hovering over the button
     // Add styles to make it look more like a button
    button.style.padding = "20px 15px"; // 20px top-bottom, 15px left-right
    button.style.margin = "20px 0"; // 20px top-bottom, 0 left-right
    button.style.cursor = "pointer"; // Change cursor to pointer on hover to indicate clickability

    button.style.textDecoration = 'none'; // Remove underline from text
    button.addEventListener('click', toggleActiveState); // Add an event listener for the click event

    return button;
    };

    // Function to replace the "Learn more" button with our custom button
    const replaceButton = () => {
        const learnMoreButton = document.querySelector('[data-item-description=true] .css-8nt2sa'); // Get the "Learn more" button

        if (learnMoreButton && learnMoreButton.textContent.includes('Learn more')) { // Check if the "Learn more" button exists
            const newButton = createButton(); // Create our custom button
            learnMoreButton.parentNode.replaceChild(newButton, learnMoreButton); // Replace the "Learn more" button with our custom button
        }
    };

    replaceButton(); // Replace the "Learn more" button immediately when the script is loaded

    // Create another mutation observer to detect when the "Learn more" button is added to the page
    const buttonObserver = new MutationObserver(replaceButton);

    // Start observing the body of the page for changes in the child list and the subtree
    buttonObserver.observe(document.querySelector('body'), {
        childList: true,
        subtree: true
    });
})();