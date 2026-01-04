// ==UserScript==
// @name         Arxiv no math translate
// @namespace    http://tampermonkey.net/
// @version      2023-12-23
// @description  Mark math formula to no translate
// @author       Guorui Quan
// @match        https://browse.arxiv.org/html/*
// @match        https://ar5iv.labs.arxiv.org/html/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arxiv.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482923/Arxiv%20no%20math%20translate.user.js
// @updateURL https://update.greasyfork.org/scripts/482923/Arxiv%20no%20math%20translate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to wrap content inside <math> tags with <div class="notranslate">
    function modifyMathElements() {
        var mathElements = document.querySelectorAll('math');

        mathElements.forEach(function(mathElement) {
            mathElement.setAttribute('translate', 'no');
        });
    }

    // Call the wrapMathContent function
    modifyMathElements();

})();
