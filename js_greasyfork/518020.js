// ==UserScript==
// @name         SurferSEO Colon to Dash (Direct Formatting)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Formats selected text by replacing colons with dashes directly in place
// @author       Your Name
// @match        https://app.surferseo.com/drafts/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518020/SurferSEO%20Colon%20to%20Dash%20%28Direct%20Formatting%29.user.js
// @updateURL https://update.greasyfork.org/scripts/518020/SurferSEO%20Colon%20to%20Dash%20%28Direct%20Formatting%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to format and replace the selected text directly
    function formatSelectedText() {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const selectedText = range.toString();
            if (selectedText) {
                // Format the selected text
                const formattedText = selectedText
                    .split('\n')
                    .map(para => para.trim().replace(/:\s*/g, ' - ').replace(/\s*—\s*/g, ' — '))
                    .join('\n');

                // Replace the selected text in place
                range.deleteContents();
                range.insertNode(document.createTextNode(formattedText));

                showAlert('Text formatted successfully!');
            } else {
                showAlert('Please select text to format.');
            }
        }
    }

    // Function to show alert
    function showAlert(message) {
        const alertDiv = document.createElement('div');
        alertDiv.innerText = message;
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '5px';
        alertDiv.style.left = '60px';
        alertDiv.style.background = 'lightgreen';
        alertDiv.style.color = 'green';
        alertDiv.style.padding = '10px 20px';
        alertDiv.style.borderRadius = '5px';
        alertDiv.style.zIndex = 1000;
        alertDiv.style.transition = 'opacity 0.5s ease';

        document.body.appendChild(alertDiv);

        setTimeout(function () {
            alertDiv.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(alertDiv);
            }, 500);
        }, 2000);
    }

    // Add button to trigger formatting
    if (window.location.href.startsWith('https://app.surferseo.com/drafts/s/')) {
        const button = document.createElement('button');
        button.innerText = 'Colon to Dash';
        button.style.position = 'fixed';
        button.style.top = '450px';
        button.style.left = '60px';
        button.style.height = '40px';
        button.style.width = '150px';
        button.style.background = 'Black';
        button.style.color = 'white';
        button.style.fontWeight = '600';
        button.style.zIndex = 1000;
        button.style.borderRadius = '8px';
        button.style.padding = '5px 10px';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.transition = 'background 0.3s ease, transform 0.3s ease';

        button.addEventListener('mouseover', function () {
            button.style.background = '#3CCF4E';
            button.style.transform = 'scale(1.05)';
        });

        button.addEventListener('mouseout', function () {
            button.style.background = 'Black';
            button.style.transform = 'scale(1)';
        });

        button.addEventListener('click', formatSelectedText);

        document.body.appendChild(button);
    }
})();