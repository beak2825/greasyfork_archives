// ==UserScript==
// @name         Expandable Text Area for SDQL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Increase the killersports.com query text box to multiple rows and make it expandable by the user
// @author       Swain Scheps
// @match        https://killersports.com/nfl/query*
// @match        https://killersports.com/mlb/query*
// @match        https://killersports.com/nba/query*
// @match        https://killersports.com/nhl/query*
// @match        https://killersports.com/ncaabb/query*
// @match        https://killersports.com/ncaafb/query*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470560/Expandable%20Text%20Area%20for%20SDQL.user.js
// @updateURL https://update.greasyfork.org/scripts/470560/Expandable%20Text%20Area%20for%20SDQL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
        // We select the form by its action attribute
        var formElement = document.querySelector('form[action="query"]');
        if(formElement){
            // Within that form, find the input element
            var inputElement = formElement.querySelector('input[name="sdql"]');
            if(inputElement){
                // Create a new textarea element
                var textareaElement = document.createElement('textarea');

                // Copy attributes from the input to the textarea
                textareaElement.id = inputElement.id;
                textareaElement.name = inputElement.name;
                textareaElement.style = inputElement.style.cssText;

                // Set rows and cols attributes for textarea
                textareaElement.rows = 3;
                textareaElement.cols = inputElement.size;

                // Set the textarea to be resizable
                textareaElement.style.resize = "both";
                textareaElement.style.overflow = "auto";

                // Set the value of the textarea
                textareaElement.value = inputElement.value;

                // Insert the new textarea just before the input
                inputElement.parentNode.insertBefore(textareaElement, inputElement);

                // Remove the original input
                inputElement.parentNode.removeChild(inputElement);

                // Add keydown event listener to the textarea
                textareaElement.addEventListener('keydown', function(e) {
                    // If the Enter key is pressed without the Alt key
                    if (e.key === 'Enter' && !e.altKey) {
                        // Prevent the default action
                        e.preventDefault();

                        // Find the submit button and simulate a click
                        var submitButton = formElement.querySelector('input[type="submit"]');
                        if (submitButton) {
                            submitButton.click();
                        }
                    }

                    // If the Alt+Enter keys are pressed
                    if (e.key === 'Enter' && e.altKey) {
                        // Prevent the default action
                        e.preventDefault();

                        // Insert a newline at the cursor position
                        const start = this.selectionStart;
                        const end = this.selectionEnd;
                        this.value = this.value.substring(0, start) + "\n" + this.value.substring(end);

                                         // Put the cursor back in the right place
                        this.selectionStart = this.selectionEnd = start + 1;
                    }
                });

                // Set focus on the new textarea and place the cursor at the end
                textareaElement.focus();
                textareaElement.selectionStart = textareaElement.selectionEnd = textareaElement.value.length;
            }
        }
    };
})();