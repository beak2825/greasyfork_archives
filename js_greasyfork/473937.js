// ==UserScript==
// @name         Next or Previous Page Navigation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Press Alt+N to click the "Next" button and Alt+P to click the "Previous" or "Last" button, redirecting to their links if available.
// @author       Sakib Shahariar
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473937/Next%20or%20Previous%20Page%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/473937/Next%20or%20Previous%20Page%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.altKey) {
            if (event.key === 'n') {
                clickNextButton();
            } else if (event.key === 'p') {
                clickPreviousButton();
            }
        }
    });

    function clickNextButton() {
        const anchorElements = document.querySelectorAll('a');
        for (const anchor of anchorElements) {
            const buttonText = anchor.textContent.toLowerCase();
            if (buttonText.includes('next')) {
                const anchorHref = anchor.getAttribute('href');
                if (anchorHref) {
                    window.location.href = anchorHref;
                }
                return; 
            }
        }
    }

    function clickPreviousButton() {
        const anchorElements = document.querySelectorAll('a');
        for (const anchor of anchorElements) {
            const buttonText = anchor.textContent.toLowerCase();
            if (buttonText.includes('previous') || buttonText.includes('prev')) {
                const anchorHref = anchor.getAttribute('href');
                if (anchorHref) {
                    window.location.href = anchorHref;
                }
                return;
            }
        }
    }
})();
