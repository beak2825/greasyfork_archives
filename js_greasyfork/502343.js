// ==UserScript==
// @name         Shadertoy copy code
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  copy code from Shadertoy
// @author       You
// @match        https://www.shadertoy.com/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shadertoy.com
// @grant        none
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/502343/Shadertoy%20copy%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/502343/Shadertoy%20copy%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the button
    function createButton() {
        var button = document.createElement('button');
        button.textContent = 'Select and Copy Text';
        button.style.position = 'fixed';
        button.style.top = '30px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        // Append the button to the body
        document.body.appendChild(button);

        // Add click event listener to the button
        button.addEventListener('click', function() {
            // Function to copy selected text to clipboard
            function copyToClipboard(text) {
                navigator.clipboard.writeText(text).then(function() {
                    alert('Text copied to clipboard!');
                }).catch(function(err) {
                    alert('Failed to copy text: ' + err);
                });
            }

            // Find the CodeMirror editor elements
            var codeMirrorElements = document.querySelectorAll('div.CodeMirror');

            if (codeMirrorElements.length > 0) {
                // Iterate over the CodeMirror elements
                codeMirrorElements.forEach(function(element) {
                    var codeMirrorInstance = element.CodeMirror;
                    if (codeMirrorInstance) {
                        codeMirrorInstance.focus();
                        codeMirrorInstance.execCommand('selectAll');

                        // Get selected text and copy it
                        var selectedText = codeMirrorInstance.getSelection();
                        copyToClipboard(selectedText);
                    }
                });
            } else {
                alert('No CodeMirror elements found.');
            }
        });
    }

    // Create the MutationObserver
    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Recreate the button if it gets removed
                if (!document.querySelector('button')) {
                    createButton();
                }
            }
        });
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the function after the page is loaded
    window.addEventListener('load', function() {
        createButton();
    });
})();