// ==UserScript==
// @name         Better CodeHS
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  Enable autocomplete, set Vim mode, and apply Gruvbox theme the CodeHS editor + Keybindings for submit and check code.
// @author       Qyoh
// @icon         https://static1.codehs.com/img/logo.png
// @match        https://codehs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525103/Better%20CodeHS.user.js
// @updateURL https://update.greasyfork.org/scripts/525103/Better%20CodeHS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Function to simulate a button click using the class or ID
    function clickButton(buttonSelector) {
        const button = document.querySelector(buttonSelector);
        if (button) {
            button.click();
        } else {
            console.error(`Button with selector "${buttonSelector}" not found.`);
        }
    }

    function switchToTestCasesTab() {
        const testCasesTab = document.querySelector('.r.c');  // Replace with actual selector
        if (testCasesTab) {
            testCasesTab.click();
        } else {
            console.error('Test Cases tab not found.');
        }
    }

    // Add event listener for keydown events
    document.addEventListener('keydown', (event) => {
        // Custom keybind for "Submit and Continue" (e.g., Ctrl + Enter)
        if (event.ctrlKey && event.key === 'Enter') {
            event.preventDefault();
            // Target the "Submit and Continue" button by class (adjust if necessary)
            clickButton('.StyledButtonKind-sc-1vhfpnt-0.fSozsy.sc-bkbkJK.eraKfR');
            console.log('"Submit and Continue" triggered.');
        }

        // Custom keybind for "Check Code" (e.g., Alt + C)
        if (event.altKey && event.key === 'c') {
            event.preventDefault();
            // Target the "Check Code" button by ID and class
            switchToTestCasesTab();
            clickButton('#grading-unit-test-run.btn.btn-main.spinner');
            console.log('"Check Code" triggered.');
        }
    });

    console.log('CodeHS keybinds loaded.');

    // Wait for the Ace Editor to be available
    function waitForAceEditor() {
        const editorElement = document.getElementById("ace-editor"); // Change ID if necessary
        if (editorElement) {
            initializeAceEditor();
        } else {
            setTimeout(waitForAceEditor, 500); // Retry after 500ms
        }
    }

    // Initialize Ace Editor with custom settings
    function initializeAceEditor() {
        const editor = ace.edit("ace-editor");
        ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.9.6/");

        // Load language tools for autocomplete
        ace.config.loadModule("ace/ext/language_tools", function(languageTools) {
            editor.setOptions({
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true
            });
        });

        // Set Vim keyboard mode
        editor.setKeyboardHandler("ace/keyboard/vim");

        // Set theme to Gruvbox
        editor.setTheme("ace/theme/gruvbox");

        console.log("Vim mode, Gruvbox theme, and autocomplete enabled.");
    }

    // Start the script
    waitForAceEditor();
})();