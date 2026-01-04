// ==UserScript==
// @name         PreF hot keys
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Для упрощения посыла в дф и модерацию
// @author       ZV
// @match        *://*/Admin/PrefilterPictures*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498033/PreF%20hot%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/498033/PreF%20hot%20keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        const key = event.key;

        switch (key) {
            case '`': // ` на английской раскладке
            case 'ё': // ё на русской раскладке
                document.querySelector('#btnDoubtfulModeration').click();
                break;
            case 'q':
            case 'Q': // Q на английской раскладке (не важно, заглавная или нет)
            case 'й': // й на русской раскладке
            case 'Й': // Й на русской раскладке
                document.querySelector('#btnModeration').click();
                break;
        }
    });
})();