// ==UserScript==
// @name         Udemy Article Copy Button
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  Add a copy button to Udemy article elements for easy copying of SQL statements and other content.
// @author       lundeen-bryan
// @match        *://*.udemy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499961/Udemy%20Article%20Copy%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/499961/Udemy%20Article%20Copy%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS styling for the copy button
    const buttonStyle = `
        .copy-button {
            background-color: limegreen;
            color: black;
            border: 1px solid black;
            padding: 10px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.1s;
        }
        .copy-button:hover {
            background-color: lightgreen;
        }
        .copy-button:active {
            background-color: green;
            transform: scale(0.95);
        }
    `;

    // Inject the CSS into the document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = buttonStyle;
    document.head.appendChild(styleSheet);

    // Function to add copy buttons to headings
    function addHeadingCopyButtons() {
        document.querySelectorAll('.ud-heading-xxl.text-viewer--main-heading--pPafb').forEach((headingElement) => {
            // Check if the button already exists to avoid duplicates
            if (!headingElement.querySelector('.copy-button')) {
                // Create a line break element
                const lineBreak = document.createElement('br');

                // Create a copy button
                const copyButton = document.createElement('button');
                copyButton.innerText = 'Copy Article';
                copyButton.className = 'copy-button';
                copyButton.style.marginTop = '10px';
                copyButton.style.display = 'block';

                // Add click event listener to the button
                copyButton.addEventListener('click', () => {
                    // Find the corresponding article content element
                    const articleContent = headingElement.nextElementSibling.querySelector('div[class*="article-asset--content--"]');

                    if (articleContent) {
                        // Create a temporary textarea to hold the article content text
                        const tempTextarea = document.createElement('textarea');
                        tempTextarea.value = cleanText(articleContent.innerText); // Clean the text and use innerText to get all the text content

                        // Append the textarea to the body and select the text
                        document.body.appendChild(tempTextarea);
                        tempTextarea.select();

                        // Execute the copy command
                        document.execCommand('copy');

                        // Remove the textarea from the body
                        document.body.removeChild(tempTextarea);

                        // Notify the user
                        alert('Text copied to clipboard!');
                    } else {
                        alert('Article content not found!');
                    }
                });

                // Insert the line break and the copy button at the bottom of the heading element
                headingElement.appendChild(lineBreak);
                headingElement.appendChild(copyButton);
            }
        });
    }

    // Helper function to clean up the text by removing double spaces or extra line breaks
    function cleanText(text) {
        // Replace double line breaks with a single line break
        return text.replace(/\n\s*\n/g, '\n');
    }

    // Run the function to add copy buttons to headings
    addHeadingCopyButtons();

    // Optionally, you can set an interval to re-run the function in case of dynamic content
    setInterval(addHeadingCopyButtons, 3000);
})();
