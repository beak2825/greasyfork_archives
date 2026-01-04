// ==UserScript==
// @name         Remove border from quiz input elements
// @namespace    https://www.wanikani.com
// @version      1.1
// @description  Removes the border from input elements
// @author       Jesse
// @match        https://www.wanikani.com/subjects/review
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462767/Remove%20border%20from%20quiz%20input%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/462767/Remove%20border%20from%20quiz%20input%20elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to remove the border from an input element
    const removeOutline = inputElement => {
        inputElement.style.border = 'none'
        inputElement.style.outline = 'none';
    };

    // Select all input elements on the page
    const inputElements = document.querySelectorAll('input');

    // Loop through each input element and remove the border
    for(let i = 0; i < inputElements.length; i++) {
        removeOutline(inputElements[i]);
    }


})();
