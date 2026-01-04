// ==UserScript==
// @name         [Homemade] Chrome Shortcuts for Search and Translate
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Alt+S to Search selected, Alt+T to Translate selected.
// @author       Liam
// @match        *://*/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/521190/%5BHomemade%5D%20Chrome%20Shortcuts%20for%20Search%20and%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/521190/%5BHomemade%5D%20Chrome%20Shortcuts%20for%20Search%20and%20Translate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
/*         console.log(`Key pressed: ${event.key}, Ctrl: ${event.ctrlKey}, Alt: ${event.altKey}`); */

        var selection = window.getSelection().toString();

        if (event.altKey && event.key.toLowerCase() === 's' && !event.shiftKey && !event.ctrlKey) {
/*             console.log(`Selection for search: ${selection}`); */
            if (selection) {
                window.open('https://www.google.com/search?q=' + encodeURIComponent(selection));
            }
        }

        if (event.altKey && event.key.toLowerCase() === 't' && !event.shiftKey && !event.ctrlKey) {
/*             console.log(`Selection for translation: ${selection}`); */
            if (selection) {
                window.open('https://translate.google.com/?sl=auto&tl=zh-CN&text=' + encodeURIComponent(selection) + '&op=translate');
            }
        }

        if (event.shiftKey && event.altKey && event.key.toLowerCase() === 't' && !event.ctrlKey) {
/*             console.log(`Selection for translation: ${selection}`); */
            if (selection) {
                window.open('https://translate.google.com/?sl=auto&tl=en&text=' + encodeURIComponent(selection) + '&op=translate');
            }
        }
    });
})();
