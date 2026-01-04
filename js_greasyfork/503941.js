// ==UserScript==
// @name         Oxford Dictionary Inline Definition
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  Displays Oxford dictionary definitions inline in the webpage and allows text copying by clicking the box, ensuring pasted text remains in the textarea.
// @author       Your Name
// @match        https://vocab.nbnb.bio/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503941/Oxford%20Dictionary%20Inline%20Definition.user.js
// @updateURL https://update.greasyfork.org/scripts/503941/Oxford%20Dictionary%20Inline%20Definition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastWord = '';
    let copiedText = ''; // Store copied text

    // Function to fetch definition
    function fetchDefinition(word) {
        const url = `https://www.oxfordlearnersdictionaries.com/definition/english/${word}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');

                    const definitions = doc.querySelectorAll('.def'); // Adjust selector if necessary
                    const ipaPronunciation = doc.querySelector('.phon'); // IPA selector

                    const resultElement = document.querySelector('.search-result-definition.rounded.pr-2');
                    resultElement.innerHTML = ''; // Clear previous content

                    // Create IPA box if available
                    if (ipaPronunciation) {
                        const ipaText = ipaPronunciation.innerText.trim(); // Add semicolon
                        const ipaBox = createBox(`<strong>IPA Pronunciation:</strong> [${ipaText}]`, ipaText);
                        resultElement.appendChild(ipaBox); // Append IPA box to the target element
                    }

                    // Create definition boxes
                    if (definitions.length > 0) {
                        definitions.forEach(def => {
                            const defText = def.innerText.trim(); // Add semicolon
                            const defBox = createBox(def.innerHTML, defText);
                            resultElement.appendChild(defBox); // Append definition box to the target element
                        });
                    } else {
                        resultElement.innerHTML += `<p>No definitions found for ${word}</p>`;
                    }
                } else {
                    const resultElement = document.querySelector('.search-result-definition.rounded.pr-2');
                    resultElement.innerHTML = `<h2>Error fetching definition</h2>`;
                }
            }
        });
    }

    // Function to create a definition or IPA box
    function createBox(content, text) {
        const box = document.createElement('div');
        box.style.border = '1px solid #ccc';
        box.style.padding = '10px';
        box.style.marginBottom = '10px';
        box.style.borderRadius = '5px';
        box.style.backgroundColor = '#f5f5f5'; // Match background color
        box.style.color = '#333'; // Match font color
        box.style.textAlign = 'left'; // Left align text
        box.style.cursor = 'pointer'; // Change cursor to pointer
        box.style.lineHeight = '1.2'; // Decrease line height
        box.innerHTML = content; // Add content

        // Add click event to copy text and focus textarea
        box.onclick = () => {
            copiedText = text; // Store copied text
            navigator.clipboard.writeText(text).then(() => {
                box.style.backgroundColor = '#d4edda'; // Change color to indicate success
                setTimeout(() => {
                    box.style.backgroundColor = '#f5f5f5'; // Reset color after 1 second
                }, 1000);
            });

            // Focus on the textarea and insert text
            const textarea = document.querySelector('.v-text-field__slot textarea[placeholder="Translation"]');
            if (textarea) {
                insertText(textarea, copiedText); // Insert copied text
                textarea.focus(); // Focus the textarea
            }
        };

        return box;
    }


    // Function to insert text into textarea
    function insertText(textarea, text) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newText = `${text};\n`;

        // Insert the copied text at the cursor position
        textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
        textarea.setSelectionRange(start + newText.length, start + newText.length); // Move cursor to the end of inserted text
        textarea.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
    }

    // Observe changes in the page to find the word
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const titleElement = document.querySelector('.search-result-title.default-font');
            if (titleElement) {
                const word = titleElement.innerText.trim();
                if (word !== lastWord) {
                    lastWord = word; // Update lastWord
                    fetchDefinition(word);
                }
            }
        });
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
