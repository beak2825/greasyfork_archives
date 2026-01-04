// ==UserScript==
// @name         Novel AI Prompt Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Generate NOVEL AI prompts based on user input
// @author       YourName
// @match        https://novelai.net/
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/487840/Novel%20AI%20Prompt%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/487840/Novel%20AI%20Prompt%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to translate Korean words to English using Google Translate API
    const translateToEnglish = (word, callback) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ko&tl=en&dt=t&q=${encodeURIComponent(word)}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const translatedWord = data[0][0][0];
                    callback(translatedWord);
                } else {
                    console.error('Failed to translate word:', response.statusText);
                }
            }
        });
    };

    // Function to generate NOVEL AI prompt
    const generatePrompt = (keywords) => {
        // Customize your prompt generation logic here
        return `Write a story about ${keywords}.`;
    };

    // Create input element
    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.placeholder = 'Enter keywords for prompt (comma-separated)';
    inputElement.style.margin = '10px';
    inputElement.style.padding = '5px';

    // Create button element
    const generateButton = document.createElement('button');
    generateButton.textContent = 'Generate Prompt';
    generateButton.style.padding = '5px';
    generateButton.style.cursor = 'pointer';

    // Add event listener to button
    generateButton.addEventListener('click', () => {
        const keywords = inputElement.value.trim().split(',').map(keyword => keyword.trim());
        if (keywords) {
            const translatedKeywordsPromises = keywords.map(keyword => new Promise(resolve => {
                translateToEnglish(keyword, translatedWord => resolve(translatedWord));
            }));
            Promise.all(translatedKeywordsPromises).then(translatedKeywords => {
                const promptKeywords = translatedKeywords.join(', ');
                const prompt = generatePrompt(promptKeywords);
                // Simulate typing the prompt into NOVEL AI's input
                document.querySelector('textarea[placeholder="Start writing your story..."]').value = prompt;
            });
        } else {
            alert('Please enter keywords.');
        }
    });

    // Add input and button elements to the page
    document.body.appendChild(inputElement);
    document.body.appendChild(generateButton);
})();
