// ==UserScript==
// @license MIT
// @name         Google Translate Page
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically translates pages to Spanish using Google Translate
// @author       Emilio Cardozo
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501611/Google%20Translate%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/501611/Google%20Translate%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addTranslateWidget() {
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        var h = document.getElementsByTagName('head')[0];
        h.appendChild(s);

        var t = document.createElement('div');
        t.id = 'google_translate_element';
        document.body.insertBefore(t, document.body.firstChild);
    }

    function googleTranslateElementInit() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'es',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    }

    window.googleTranslateElementInit = googleTranslateElementInit;
    addTranslateWidget();
})();