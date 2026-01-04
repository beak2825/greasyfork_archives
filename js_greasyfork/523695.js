// ==UserScript==
// @name         Job Navigation Script
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Navigate application sites with arrow keys and submit application with Enter key
// @author       Your Name
// @match        *://*.wd1.myworkdayjobs.com/*
// @match        *://*.myworkdayjobs.com/*
// @match        *://*.myworkday.com/*
// @match        *://*.myworkdayjobs.com/*
// @match        *://*.wd1.myworkdayjobs.com/*
// @match        *://*.glassdoor.com/*
// @match        *://*.avature.net/*
// @match        *://*.greenhouse.io/*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523695/Job%20Navigation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/523695/Job%20Navigation%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // Check if the focus is on an input field or textarea to avoid interrupting typing
        if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
            return;
        }

        switch(e.key) {
            case 'ArrowRight':
                // Attempt to click a next button, if present
                var nextButton = document.querySelector(
                    'button[data-automation-id="bottom-navigation-next-button"], ' +
                    'button[data-automation-id="pageFooterNextButton"], ' +
                    '.next'
                );
                if (nextButton) {
                    nextButton.click();
                }
                break;
            case 'ArrowLeft':
                // Attempt to click a previous button, if present, or go back in history
                var previousButton = document.querySelector('.previous');
                if (previousButton) {
                    previousButton.click();
                } else {
                    window.history.back();
                }
                break;
            case 'Enter':
                // Attempt to click a submit button with specific class, if present
                var submitButton = document.querySelector('button[type="submit"].btn.btn--pill');
                if (submitButton) {
                    submitButton.click();
                }
                break;
            case '`':
                // Autofill fields with placeholder values that include 'No'
                var inputFields = document.querySelectorAll('input, textarea');
                inputFields.forEach(function(field) {
                    if (field.value.trim() === '' && (field.placeholder.toLowerCase().includes('no'))) {
                        field.value = field.placeholder; // Autofill with placeholder value
                    }
                });
                break;
        }
    });
})();
