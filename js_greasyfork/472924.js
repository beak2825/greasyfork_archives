// ==UserScript==
// @name        Text Expander
// @namespace   text-expander
// @match       *://*/*
// @grant       none
// @version     1.3
// @author      SirGryphin
// @description Replace predefined keywords with corresponding text templates.
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/472924/Text%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/472924/Text%20Expander.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultMappings = {
        '/hello': 'Hello! Welcome to our website.',
        '/address': 'Our office address is 123 Main St, City.',
        '/large-paragraph': `
            This is a large paragraph with multiple lines. You can add as much text as you want here.
            It won't mess up the code structure, thanks to template literals.
            
            You can even add line breaks and formatting without any issues.
            Just make sure to maintain the backticks (\`) at the beginning and end.
        `,
    };

    let keywordMappings = GM_getValue('customMappings', defaultMappings);

    function replaceKeywords(text) {
        for (const keyword in keywordMappings) {
            if (text.includes(keyword)) {
                text = text.replace(new RegExp(keyword, 'g'), keywordMappings[keyword]);
            }
        }
        return text;
    }

    function handleInput(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            const originalText = e.target.value;
            const modifiedText = replaceKeywords(originalText);

            if (originalText !== modifiedText) {
                e.target.value = modifiedText;
            }
        }
    }

    document.addEventListener('input', handleInput);

    // Register a menu command for settings
    GM_registerMenuCommand('Custom Templates', openSettings);

    // Open the enhanced settings dialog
    function openSettings() {
        const settingsDialog = document.createElement('div');
        settingsDialog.style.position = 'fixed';
        settingsDialog.style.top = '50%';
        settingsDialog.style.left = '50%';
        settingsDialog.style.transform = 'translate(-50%, -50%)';
        settingsDialog.style.backgroundColor = 'white';
        settingsDialog.style.padding = '20px';
        settingsDialog.style.border = '1px solid #ccc';
        settingsDialog.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
        settingsDialog.style.zIndex = '9999';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(settingsDialog);
        });
        settingsDialog.appendChild(closeButton);

        const titleLabel = document.createElement('h2');
        titleLabel.textContent = 'Custom Templates';
        settingsDialog.appendChild(titleLabel);

        const instructionsLabel = document.createElement('p');
        instructionsLabel.textContent = 'Enter your custom keyword mappings in JSON format:';
        settingsDialog.appendChild(instructionsLabel);

        const inputTextArea = document.createElement('textarea');
        inputTextArea.style.width = '100%';
        inputTextArea.style.height = '200px';
        inputTextArea.value = JSON.stringify(keywordMappings, null, 2);
        settingsDialog.appendChild(inputTextArea);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Settings';
        saveButton.style.marginTop = '10px';
        saveButton.addEventListener('click', () => {
            try {
                const customMappings = JSON.parse(inputTextArea.value);
                keywordMappings = customMappings;
                GM_setValue('customMappings', keywordMappings);
                document.body.removeChild(settingsDialog);
            } catch (error) {
                alert('Invalid JSON format. Custom mappings not updated.');
            }
        });
        settingsDialog.appendChild(saveButton);

        document.body.appendChild(settingsDialog);
    }
})();