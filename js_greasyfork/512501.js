// ==UserScript==
// @name         Ctrl+L Markdown Link Wrapper with Parentheses Auto-Completion
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Wrap selected text in markdown link format [text]() and place cursor between parentheses. Auto-completes parentheses and surrounds selected text with parentheses.
// @author       minnie
// @match        https://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512501/Ctrl%2BL%20Markdown%20Link%20Wrapper%20with%20Parentheses%20Auto-Completion.user.js
// @updateURL https://update.greasyfork.org/scripts/512501/Ctrl%2BL%20Markdown%20Link%20Wrapper%20with%20Parentheses%20Auto-Completion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Listen for Ctrl+L keypress
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault();

            // Get the focused element (typically the textarea)
            let activeElement = document.activeElement;

            // Check if the focused element is a textarea within a .usertext-edit container
            if (activeElement && activeElement.tagName.toLowerCase() === 'textarea' && activeElement.closest('.usertext-edit')) {
                let textarea = activeElement;
                let selectionStart = textarea.selectionStart;
                let selectionEnd = textarea.selectionEnd;

                // Get the selected text
                let selectedText = textarea.value.substring(selectionStart, selectionEnd);

                // Wrap the selected text in markdown link format
                let markdownText = `[${selectedText}]()`;

                // Replace the selected text with the markdown link
                textarea.setRangeText(markdownText, selectionStart, selectionEnd, 'end');

                // Set the cursor inside the parentheses
                textarea.selectionStart = selectionStart + markdownText.length - 1;
                textarea.selectionEnd = textarea.selectionStart;

                // Focus back on the textarea
                textarea.focus();
            }
        }
    });

    // Listen for parentheses keypresses
    document.addEventListener('keydown', function(e) {
        let activeElement = document.activeElement;

        // Check if the focused element is a textarea within a .usertext-edit container
        if (activeElement && activeElement.tagName.toLowerCase() === 'textarea' && activeElement.closest('.usertext-edit')) {
            let textarea = activeElement;

            if (e.key === '(' || e.key === ')') {
                e.preventDefault(); // Prevent default behavior of typing the character

                let selectionStart = textarea.selectionStart;
                let selectionEnd = textarea.selectionEnd;

                if (e.key === '(') {
                    if (selectionStart !== selectionEnd) {
                        // If there is selected text, wrap it in parentheses
                        let selectedText = textarea.value.substring(selectionStart, selectionEnd);
                        textarea.setRangeText(`(${selectedText})`, selectionStart, selectionEnd, 'end');

                        // Move the cursor between the parentheses
                        textarea.selectionStart = selectionStart + 1;
                        textarea.selectionEnd = textarea.selectionStart;
                    } else {
                        // Insert opening parenthesis and closing parenthesis with cursor in the middle
                        textarea.setRangeText('()', selectionStart, selectionEnd, 'end');

                        // Move the cursor between the parentheses
                        textarea.selectionStart = selectionStart + 1; // Move to the middle
                        textarea.selectionEnd = textarea.selectionStart; // Set selectionEnd to the same position
                    }
                } else if (e.key === ')') {
                    // Get the previous character to check if we need to add an opening parenthesis
                    if (textarea.value[selectionStart - 1] !== '(') {
                        if (selectionStart !== selectionEnd) {
                            // If there is selected text, wrap it in parentheses
                            let selectedText = textarea.value.substring(selectionStart, selectionEnd);
                            textarea.setRangeText(`(${selectedText})`, selectionStart, selectionEnd, 'end');

                            // Move the cursor after the closing parenthesis
                            textarea.selectionStart = selectionStart + selectedText.length + 1;
                            textarea.selectionEnd = textarea.selectionStart;
                        } else {
                            textarea.setRangeText(')', selectionStart, selectionEnd, 'end');

                            // Move the cursor back to where it was
                            textarea.selectionStart = selectionStart;
                            textarea.selectionEnd = selectionStart; // Keep the cursor at the same place
                        }
                    }
                }

                // Focus back on the textarea
                textarea.focus();
            }
        }
    });
})();
