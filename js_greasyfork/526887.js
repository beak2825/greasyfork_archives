// ==UserScript==
// @name         Test Translator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AI Translation using Gemini
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526887/Test%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/526887/Test%20Translator.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    
    let gemini;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #translate-prompt {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
        }
        button {
            margin: 5px;
            padding: 5px 10px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Add prompt HTML
    const promptDiv = document.createElement('div');
    promptDiv.id = 'translate-prompt';
    promptDiv.innerHTML = `
        
Translate?


        Yes
        No
    `;
    document.body.appendChild(promptDiv);

    // Load Gemini API dynamically
    try {
        const module = await import('https://api.websim.ai/blobs/0194e43b-7e45-75e7-ad7e-5848f3b43828.js');
        gemini = module.gemini;
        
        // Function to detect non-English text
        function hasNonEnglishText(text) {
            const nonEnglishPattern = /[^\x00-\x7F]+/;
            return nonEnglishPattern.test(text);
        }

        // Function to translate text using Gemini
        async function translateText(text) {
            try {
                const prompt = `Translate this text to English: ${text}`;
                const response = await gemini.generate(prompt);
                return response;
            } catch (error) {
                console.error('Translation error:', error);
                return text;
            }
        }

        // Function to replace text in the DOM
        function replaceText(element, translatedText) {
            element.textContent = translatedText;
        }

        // Main function to check page content
        function checkPageContent() {
            const textNodes = document.evaluate(
                '//text()', 
                document, 
                null, 
                XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, 
                null
            );

            let hasNonEnglish = false;
            
            for (let i = 0; i < textNodes.snapshotLength; i++) {
                const node = textNodes.snapshotItem(i);
                if (hasNonEnglishText(node.textContent)) {
                    hasNonEnglish = true;
                    break;
                }
            }

            if (hasNonEnglish) {
                showTranslatePrompt();
            }
        }

        function showTranslatePrompt() {
            const prompt = document.getElementById('translate-prompt');
            prompt.style.display = 'block';
            
            document.getElementById('yes').addEventListener('click', async () => {
                const textNodes = document.evaluate(
                    '//text()', 
                    document, 
                    null, 
                    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, 
                    null
                );
                
                for (let i = 0; i < textNodes.snapshotLength; i++) {
                    const node = textNodes.snapshotItem(i);
                    if (hasNonEnglishText(node.textContent)) {
                        const translatedText = await translateText(node.textContent);
                        replaceText(node, translatedText);
                    }
                }
                
                prompt.style.display = 'none';
            });
            
            document.getElementById('no').addEventListener('click', () => {
                prompt.style.display = 'none';
            });
        }
        
        // Run the check
        checkPageContent();
        
    } catch (err) {
        console.error('Failed to load Gemini:', err);
    }
})();
    