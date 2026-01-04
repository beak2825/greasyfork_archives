// ==UserScript==
// @name         ChatGPT Focus Prompt Textarea
// @namespace    http://jakelevirne.com/
// @version      0.2
// @description  Automatically focus the prompt input box on chat.openai.com when tabbing back to the browser window.
// @author       jakelevirne
// @match        *://chat.openai.com/*
// @match        *://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493492/ChatGPT%20Focus%20Prompt%20Textarea.user.js
// @updateURL https://update.greasyfork.org/scripts/493492/ChatGPT%20Focus%20Prompt%20Textarea.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to focus the input box
    function focusPromptInput() {
        // Updated selector for the textarea with the specific id
        const inputSelector = 'textarea#prompt-textarea';
        const inputBox = document.querySelector(inputSelector);

        if (inputBox && document.activeElement !== inputBox) {
            inputBox.focus();
        }
    }


    // Listen for the window to gain focus
    window.addEventListener('focus', focusPromptInput);

})();
