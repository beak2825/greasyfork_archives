// ==UserScript==
// @name         GPT3.5 Translator
// @namespace    http://your.namespace.com
// @version      0.1
// @description  Translate text using GPT-3.5 model
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498640/GPT35%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/498640/GPT35%20Translator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your GPT-3.5 API Key
    const apiKey = 'YOUR_API_KEY';

    // Function to translate text using GPT-3.5 model
    function translateText(text, sourceLanguage, targetLanguage) {
        const apiUrl = 'https://api.openai.com/v1/translate';

        // Construct request data
        const requestData = {
            text: text,
            source_language: sourceLanguage,
            target_language: targetLanguage,
            model: 'text-davinci-003' // GPT-3.5 model
        };

        // Make API request to translate text
        GM_xmlhttpRequest({
            method: 'POST',
            url: apiUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: JSON.stringify(requestData),
            onload: function(response) {
                const translatedText = JSON.parse(response.responseText).translations[0].translation;
                // Do something with translated text (e.g., display it on the page)
                console.log(translatedText);
            },
            onerror: function(error) {
                console.error('Translation error:', error);
            }
        });
    }

    // Example usage: translate text on the page
    const textToTranslate = 'Hello, how are you?';
    const sourceLanguage = 'en';
    const targetLanguage = 'fr'; // Translate to French

    translateText(textToTranslate, sourceLanguage, targetLanguage);
})();
