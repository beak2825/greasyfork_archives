// ==UserScript==
// @name         Modify Email Domain and Save
// @namespace    ESM Autotask Contact
// @version      1.1
// @description  Modify the domain part of the email address and click the Save button
// @author       KLElisa
// @match        https://ww19.autotask.net/Mvc/CRM/ContactEdit.mvc*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527612/Modify%20Email%20Domain%20and%20Save.user.js
// @updateURL https://update.greasyfork.org/scripts/527612/Modify%20Email%20Domain%20and%20Save.meta.js
// ==/UserScript==
// Makes the changes and waits 10 sec so you have enough time to open multiple edit contact pages before it starts saving and refreshing the contact page.

(function() {
    'use strict';

    // Define the new email domain you want to use
    var newEmailDomain = "@newemail.com"; /////////////////////////// >>>>>>>>>>>>>>>>>>>>>>>>> HERE ADD THE NEW EMAIL YOU WANT TO CHANGE IT TO

    // Function to modify the email address and trigger the save
    function modifyEmailAndSave() {
        // Find the Email Address input field
        var emailInput = document.querySelector('input[value*="@oldemail.com"]'); /////////////////////////// >>>>>>>>>>>>>>>>>>>>>>>>> HERE ADD THE OLD EMAIL YOU WANT TO CHANGE IT FROM

        if (emailInput) {
            // Get the current value of the input
            var currentValue = emailInput.value;

            // Replace the domain part with the new domain
            var newValue = currentValue.replace(/@oldemail\.com$/, newEmailDomain); /////////////////////////// >>>>>>>>>>>>>>>>>>>>>>>>> HERE ADD THE OLD EMAIL YOU WANT TO CHANGE IT FROM

            // Set the focus on the input field
            emailInput.focus();

            // Select the existing content in the input field
            emailInput.select();

            // Simulate keyboard input to delete the selected content
            document.execCommand('delete');

            // Simulate keyboard input to type the new value
            for (var i = 0; i < newValue.length; i++) {
                var char = newValue.charAt(i);
                emailInput.dispatchEvent(new KeyboardEvent('keydown', { key: char, keyCode: char.charCodeAt(0) }));
                emailInput.dispatchEvent(new KeyboardEvent('keypress', { key: char, keyCode: char.charCodeAt(0) }));
                emailInput.value += char;
                emailInput.dispatchEvent(new Event('input', { bubbles: true }));
                emailInput.dispatchEvent(new KeyboardEvent('keyup', { key: char, keyCode: char.charCodeAt(0) }));
            }

            // Trigger a change event on the input field
            var changeEvent = new Event('change', { bubbles: true });
            emailInput.dispatchEvent(changeEvent);

                        // Add a 10-second delay
            setTimeout(function() {
                // Find the Save button
                var saveButton = document.querySelector('div.Icon2 > div.StandardButtonIcon.Save');

                if (saveButton) {
                    // Trigger a click event on the Save button
                    saveButton.click();
                }
            }, 10000);
        }
    }

    // Add a delay to ensure all page contents are loaded
    setTimeout(modifyEmailAndSave, 10000);
})();