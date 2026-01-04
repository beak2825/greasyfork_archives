// ==UserScript==
// @name         Auto Translate to English
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically translate any language to English
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489503/Auto%20Translate%20to%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/489503/Auto%20Translate%20to%20English.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function translatePage() {
        var targetLanguage = 'en';
        var googleTranslateScript = document.createElement('script');
        googleTranslateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(googleTranslateScript);

        window.googleTranslateElementInit = function() {
            new google.translate.TranslateElement({pageLanguage: 'auto', includedLanguages: targetLanguage, layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element');
        }

        var elements = document.getElementsByClassName('goog-te-banner-frame');
        if (elements.length > 0) {
            elements[0].contentWindow.document.getElementsByTagName('button')[0].click();
        }
    }

    setTimeout(translatePage, 5000); // Wait for 5 seconds before translating the page
})();