// ==UserScript==
// @name         Placeholder to Value
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Setzt den Placeholder als Value für das aktuelle Eingabefeld oder Textarea bei Drücken von Alt+P
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523539/Placeholder%20to%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/523539/Placeholder%20to%20Value.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function setPlaceholderAsValue() {
        const activeElement = document.activeElement;
        if ((activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') && activeElement.placeholder) {
            activeElement.value = activeElement.placeholder;
        }
    }

    document.addEventListener('keydown', function(event) {
        // Überprüft, ob Alt+P gedrückt wurde
        if (event.altKey && event.keyCode === 80) {
            setPlaceholderAsValue();
            event.preventDefault();
        }
    });
})();
