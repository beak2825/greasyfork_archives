// ==UserScript==
// @name         Auto Translate to English
// @namespace    https://discord.gg/VnxvMFbKbu
// @version      0.2
// @description  Automatically translate web pages to English
// @author       Pixel.Pilot
// @match        http://*/*
// @match        https://*/*
// @grant        GM_xmlhttpRequest
// @license You are not allowed to reuse this script for any purpose.
// @downloadURL https://update.greasyfork.org/scripts/487481/Auto%20Translate%20to%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/487481/Auto%20Translate%20to%20English.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function translateText(text, onSuccess, onError) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const jsonResponse = JSON.parse(response.responseText);
                const translatedText = jsonResponse[0][0][0];
                if (translatedText) {
                    onSuccess(translatedText);
                } else {
                    onError();
                }
            },
            onerror: function(error) {
                onError(error);
            }
        });
    }

    function translateAllVisibleElements() {
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.nodeType === Node.TEXT_NODE && element.parentElement.tagName !== 'SCRIPT') {
                translateText(element.textContent.trim(), 
                              translatedText => {
                                  element.textContent = translatedText;
                              },
                              () => {
                                  console.log(`Translation failed for: ${element.textContent}`);
                              });
            } else if (element.hasChildNodes() && element.tagName !== 'SCRIPT') {
                translateAllVisibleElementsRecursive(element);
            }
        });
    }

    function translateAllVisibleElementsRecursive(element) {
        element.childNodes.forEach(childNode => {
            if (childNode.nodeType === Node.TEXT_NODE && childNode.parentElement.tagName !== 'SCRIPT') {
                translateText(childNode.textContent.trim(), 
                              translatedText => {
                                  childNode.textContent = translatedText;
                              },
                              () => {
                                  console.log(`Translation failed for: ${childNode.textContent}`);
                              });
            } else if (childNode.hasChildNodes() && childNode.tagName !== 'SCRIPT') {
                translateAllVisibleElementsRecursive(childNode);
            }
        });
    }

    translateAllVisibleElements();

    // Update Ideas:
    // 1. Language Detection
    // 2. User Interaction (Button/Menu)
    // 3. Customization (Select Target Language)
    // 4. Error Handling (Display Messages)
    // 5. Performance Optimization
    // 6. Exclude Elements
    // 7. Translation Cache
    // 8. Settings Panel

})();