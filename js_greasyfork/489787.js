// ==UserScript==
// @name         ClassMarker Tastiera Risposte
// @namespace    http://violetmonkey.net/
// @version      0.1
// @description  Utilizza i tasti della tastiera "1, 2, 3, 4" per selezionare le risposte "A", "B", "C", "D" su ClassMarker
// @match        https://www.classmarker.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489787/ClassMarker%20Tastiera%20Risposte.user.js
// @updateURL https://update.greasyfork.org/scripts/489787/ClassMarker%20Tastiera%20Risposte.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        const answerKeyMappings = {
            '1': 'A',
            '2': 'B',
            '3': 'C',
            '4': 'D'
        };

        if (answerKeyMappings[key]) {
            const answerElement = document.querySelector(`input[value="${answerKeyMappings[key]}"]`);
            if (answerElement) {
                answerElement.checked = true;
            }
        }
    });
})();
