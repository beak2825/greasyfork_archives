// ==UserScript==
// @name         Auto Translate to English (LibreTranslate)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically translate selected text to English using LibreTranslate API.
// @author       Da cat
// @match        *://*/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/511711/Auto%20Translate%20to%20English%20%28LibreTranslate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511711/Auto%20Translate%20to%20English%20%28LibreTranslate%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const LIBRETRANSLATE_API_URL = 'https://libretranslate.com/translate'; // LibreTranslate API endpoint

    // Function to translate the selected text
    function translateText(text) {
        const data = {
            q: text,
            source: 'auto', // Auto-detect language
            target: 'en', // Translate to English
            format: 'text'
        };

        const xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener('readystatechange', function () {
            if (this.readyState === this.DONE) {
                const response = JSON.parse(this.responseText);
                console.log('Translation Response:', response);

                // Check if the response has a translation
                if (response && response.translatedText) {
                    const translatedText = response.translatedText;
                    alert(`Translated Text: ${translatedText}`);

                    // Optionally, copy the translated text to the clipboard
                    GM_setClipboard(translatedText);
                    console.log('Translated text copied to clipboard');
                } else {
                    alert('Translation failed. Please check the console for details.');
                }
            }
        });

        xhr.open('POST', LIBRETRANSLATE_API_URL);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.send(JSON.stringify(data));
    }

    // Function to handle context menu click
    function handleContextMenu(event) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            translateText(selectedText);
        } else {
            alert('Please select some text to translate.');
        }
    }

    // Add context menu command
    document.addEventListener('contextmenu', function(event) {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            event.preventDefault(); // Prevent default context menu
            handleContextMenu(event); // Call the translate function
        }
    });
})();
