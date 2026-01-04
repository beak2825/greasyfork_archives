// ==UserScript==
// @name         LaTeX Question Itemizer with vspace
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Open a text box with CMD u or CTRL u and paste a HW question you have to automatically get it in \item format
// @author       Andrew Lakkis
// @match        https://www.overleaf.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491918/LaTeX%20Question%20Itemizer%20with%20vspace.user.js
// @updateURL https://update.greasyfork.org/scripts/491918/LaTeX%20Question%20Itemizer%20with%20vspace.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Create UI elements
    const containerDiv = document.createElement('div');
    const inputDiv = document.createElement('div');
    const outputDiv = document.createElement('div');
    const inputTextArea = document.createElement('textarea');
    const outputTextArea = document.createElement('textarea');
    const submitButton = document.createElement('button');
    const closeButton = document.createElement('button');
    const clearButton = document.createElement('button'); // New clear button
    const copyButton = document.createElement('button');
    const copyAndCloseButton = document.createElement('button');

    // UI setup
    inputTextArea.setAttribute('placeholder', 'Enter your text here...');
    submitButton.textContent = 'Transform';
    closeButton.textContent = 'Close';
    clearButton.textContent = 'Clear'; // Set text for clear button
    copyButton.textContent = 'Copy';
    copyAndCloseButton.textContent = 'Copy and Close';
    outputTextArea.setAttribute('readonly', true);

    inputDiv.appendChild(inputTextArea);
    inputDiv.appendChild(submitButton);
    inputDiv.appendChild(clearButton); // Append clear button to inputDiv
    inputDiv.appendChild(closeButton);
    outputDiv.appendChild(outputTextArea);
    outputDiv.appendChild(copyButton);
    outputDiv.appendChild(copyAndCloseButton);
    containerDiv.appendChild(inputDiv);
    containerDiv.style.transform = 'translateX(50px) translateY(100px)'; // shift the clear button 8px to the left in the search box
    containerDiv.appendChild(outputDiv);
    document.body.appendChild(containerDiv);

    // Styling
    containerDiv.style.position = 'fixed';
    containerDiv.style.top = '10px';
    containerDiv.style.left = '10px';
    containerDiv.style.backgroundColor = '#f0f0f0';
    containerDiv.style.border = '1px solid #ddd';
    containerDiv.style.padding = '10px';
    inputTextArea.style.width = '300px';
    inputTextArea.style.height = '150px';
    outputTextArea.style.width = '300px';
    outputTextArea.style.height = '150px';
    containerDiv.style.display = 'none';



    // Transform text function
    const transformText = (text) => {
        const lines = text.split('\n');
        let transformedText = '';
        let hasEnumerateStarted = false;
        let isFirstItem = true; // Flag to track the first item

        // this block will determine if there is already an itemized question, and fills it with vspace in between each pair of items if necessary
        if (text.includes('\\begin{enumerate}') && text.includes('\\item')) {
            return text.split('\n').reduce((acc, line, index, arr) => {
                // Check for item lines and not the last line of the array
                if (line.trim().startsWith('\\item') && index !== arr.length - 1) {
                    // Check the next line; if not another item, insert \vspace
                    return acc + line + '\n  \\vspace{0.1in}  \n\n\n\n\n\n \\vspace{0.2in} \n';
                }
                return acc + line + '\n';
            }, '');
        }


        for (let line of lines) {
            // Attempt to match the specific cases, including those ending with a period
            const match = line.match(/^(\((?:[a-e]|[1-9])\)|[a-e]\)|\d\.\s|\d\))\s*(.*)/i) ||
                  line.match(/^([a-e]|\d)\.\s*(.*)/i); // Directly match letters or digits followed by a period

            if (match) {
                let prefix = match[1];
                // Adjust prefix to ensure correct LaTeX format
                // This includes adding a closing parenthesis for letters or digits without any
                if (prefix.match(/^[a-e]$/) || prefix.match(/^\d$/)) {
                    prefix += '.'; // Append period for single letters or digits without any punctuation for consistency
                }

                if (!hasEnumerateStarted) {
                    transformedText += '\\begin{enumerate}';
                    hasEnumerateStarted = true;
                }
                // Check if it's the first item to skip \vspace
                if (isFirstItem) {
                    transformedText += `\n\n \\item[${prefix}] ${match[2]}\n`;
                    isFirstItem = false;
                } else {
                    transformedText += `\n  \\vspace{0.1in}  \n\n\n\n\n\n \\vspace{0.2in} \n\n \\item[${prefix}] ${match[2]}\n`;
                }
            } else {
                transformedText += line + '\n';
            }
        }

        if (hasEnumerateStarted) {
            transformedText += '\n \\vspace{0.1in} \n\n\n\n\n \\end{enumerate}\n  \\vspace{0.4in}';
        }

        return transformedText;
    };




    // Event listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'u' && (e.ctrlKey || e.metaKey)) {
            containerDiv.style.display = 'block';
            inputTextArea.focus();
        }
    });

    submitButton.addEventListener('click', () => {
        const inputText = inputTextArea.value;
        const outputText = transformText(inputText);
        outputTextArea.value = outputText;
    });

    closeButton.addEventListener('click', () => {
        containerDiv.style.display = 'none';
    });


    clearButton.addEventListener('click', () => {
        inputTextArea.value = ''; // Clear the input text area
        inputTextArea.focus();
    });


    copyButton.addEventListener('click', () => {
        outputTextArea.select();
        document.execCommand('copy');
    });


    /* get this to work for paste event
    inputTextArea.addEventListener('keydown', () => {
        const inputText = inputTextArea.value;
        const outputText = transformText(inputText);
        outputTextArea.value = outputText;
    });
    */

    copyAndCloseButton.addEventListener('click', () => {
        outputTextArea.select();
        document.execCommand('copy');
        containerDiv.style.display = 'none';
    });
})();
