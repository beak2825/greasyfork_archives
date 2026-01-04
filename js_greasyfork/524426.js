// ==UserScript==
// @name         Invisible Google Translate Widget
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes the Google Translate widget vanish without a trace.
// @author       UniverseDev
// @license      GPL-3.0-or-later
// @icon         https://ssl.gstatic.com/translate/favicon.ico
// @match        *://*/*
// @grant        unsafeWindow
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/524426/Invisible%20Google%20Translate%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/524426/Invisible%20Google%20Translate%20Widget.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function injectHideCSS() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = `
            #google_translate_element,
            .goog-te-banner-frame,
            .goog-te-balloon-frame,
            .goog-te-spinner-pos,
            .goog-gt-vt,
            #goog-gt-original-text,
            .skiptranslate > iframe,
            .VIpgJd-ZVi9od-aZ2wEe-wOHMyf,
            .VIpgJd-ZVi9od-aZ2wEe {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                border: none !important;
                box-shadow: none !important;
            }
            body {
                top: auto !important;
                position: static !important;
            }
        `;
        document.head.appendChild(style);
    }

    function initializeTranslateWidget() {
        const translateDiv = document.createElement('div');
        translateDiv.id = 'google_translate_element';
        translateDiv.style.display = 'none';
        document.body.prepend(translateDiv);

        const initScript = document.createElement('script');
        initScript.type = 'text/javascript';
        initScript.text = `
            function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                    pageLanguage: 'auto',
                    autoDisplay: false,
                    multilanguagePage: true,
                    layout: google.translate.TranslateElement.FloatPosition.TOP_LEFT
                }, 'google_translate_element');
            }
        `;
        document.body.appendChild(initScript);

        const translateScript = document.createElement('script');
        translateScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(translateScript);
    }

    function addPassiveEventListener(eventName, callback) {
        window.addEventListener(eventName, callback, { passive: true });
    }

    addPassiveEventListener('load', () => {
        initializeTranslateWidget();
        injectHideCSS();
    });

    window.addEventListener('goog-gt-popupShown', () => {
        injectHideCSS();
    });
})();
