// ==UserScript==
// @name         sf busy work reducer
// @namespace    https://astrobase9.net
// @version      0.1
// @description  adds buttons to the SF case view to reduce busy work
// @author       Eric S
// @match        https://richmondprolab.lightning.force.com/lightning/r/Case*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/487862/sf%20busy%20work%20reducer.user.js
// @updateURL https://update.greasyfork.org/scripts/487862/sf%20busy%20work%20reducer.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Define your predefined functions here
function predefinedFunction1() {
    // Find the "Edit Case Reason" button
    var editButton = document.querySelector("button[title='Edit Case Reason']");

    // Check if the button is found
    if (editButton) {
        // Simulate a click on the button
        editButton.click();
        console.log("Clicked on Edit Case Reason button");

        // Wait for a brief moment before setting the dropdown value
        setTimeout(function() {
            // Click to open the first dropdown
            var dropdownOpener = document.querySelector('a.select[role="button"]');
            if (dropdownOpener) {
                dropdownOpener.click();
                console.log("Clicked to open first dropdown");

                // After a brief moment, select "Software Support"
                setTimeout(function() {
                    var dropdownItem = document.querySelector('li.uiMenuItem.uiRadioMenuItem a[title="Software Support"]');
                    if (dropdownItem) {
                        dropdownItem.click();
                        console.log("Clicked on dropdown item: Software Support");

                        // Wait for a brief moment before clicking the second dropdown
                        setTimeout(function() {
                            // Click to open the second dropdown
                            var secondDropdownOpener = document.querySelector('a.select[data-interactive-lib-uid="5"]');
                            if (secondDropdownOpener) {
                                secondDropdownOpener.click();
                                console.log("Clicked to open second dropdown");

                                // After a brief moment, select an item from the second dropdown
                                setTimeout(function() {
                                    // Find and click the desired item in the second dropdown
                                    var secondDropdownItem = document.querySelector('li.uiMenuItem.uiRadioMenuItem a[title="ImageQuix"]');
                                    if (secondDropdownItem) {
                                        secondDropdownItem.click();
                                        console.log("Clicked on item in second dropdown: Desired Item");
                                    } else {
                                        console.log("Item in second dropdown not found");
                                    }
                                }, 500); // Adjust the delay as needed
                            } else {
                                console.log("Second dropdown opener button not found");
                            }
                        }, 500); // Adjust the delay as needed
                    } else {
                        console.log("Dropdown item 'Software Support' not found");
                    }
                }, 500); // Adjust the delay as needed
            } else {
                console.log("First dropdown opener button not found");
            }
        }, 500); // Adjust the delay as needed
    } else {
        console.log("Edit Case Reason button not found");
    }
}








// Function to simulate keyboard events
function simulateKeyEvent(element, eventType, keyCode) {
    var event = new Event(eventType);
    event.keyCode = keyCode;
    element.dispatchEvent(event);
}




    function predefinedFunction2() {
        // Your code for function 2
        console.log("Function 2 executed!");
    }

    // Create buttons and attach predefined functions to their click events
    function createButtons() {
        // Create button 1
        var button1 = document.createElement("button");
        button1.innerHTML = "Blueprint";
        button1.addEventListener("click", predefinedFunction1);
        button1.style.backgroundColor = "blue"; // Set button color to red
        button1.style.zIndex = "100";
        button1.style.position = "absolute"; // Position the button absolutely
        button1.style.left = "1150px";
        button1.style.top = "200px";

        // Create button 2
        var button2 = document.createElement("button");
        button2.innerHTML = "Button 2";
        button2.addEventListener("click", predefinedFunction2);
        button2.style.backgroundColor = "red"; // Set button color to red
        button2.style.zIndex = "100";

        // Add buttons to the page
        document.body.appendChild(button1);
        document.body.appendChild(button2);
    }

    // Call the function to create buttons when the page is loaded
    window.addEventListener("load", createButtons);
})();