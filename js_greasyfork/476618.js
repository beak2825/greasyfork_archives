// ==UserScript==
// @name         Set Max Width for Elements ChatGpt
// @namespace    https://chat.openai.com/
// @version      0.2
// @description  Set max-width for elements with specific classes
// @author       Sagar Yadav
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/476618/Set%20Max%20Width%20for%20Elements%20ChatGpt.user.js
// @updateURL https://update.greasyfork.org/scripts/476618/Set%20Max%20Width%20for%20Elements%20ChatGpt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const applyMaxWidth = (className, maxWidth) => {
        const elements = document.querySelectorAll(className);
        if (elements.length === 0) return;

        // Check if the last element already has the target max-width
        const lastElement = elements[elements.length - 1];
        const currentMaxWidth = window.getComputedStyle(lastElement).maxWidth;

        if (currentMaxWidth === maxWidth) {
            return;
        }

        elements.forEach(element => {
            element.style.setProperty('max-width', maxWidth, 'important');
        });
    };

    // Run the function every 5 seconds
    setInterval(() => {
        applyMaxWidth('.Lg\\:max-w-\\[38rem\\]', '78rem');
        applyMaxWidth('.xl\\:max-w-3xl', '98rem');
    }, 5000);
})();
