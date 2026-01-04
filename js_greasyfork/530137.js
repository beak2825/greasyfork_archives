// ==UserScript==
// @name         kgc
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.0
// @description  grade change script
// @author       Minoa
// @match        https://login-learn.k12.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530137/kgc.user.js
// @updateURL https://update.greasyfork.org/scripts/530137/kgc.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get letter grade based on percentage
    function getLetterGrade(percent) {
        if (percent >= 90) return 'A';
        if (percent >= 80) return 'B';
        if (percent >= 70) return 'C';
        if (percent >= 60) return 'D';
        return 'F';
    }

    // Function to modify grade percentage and letter
    function modifyGrade(gradeElement) {
        const percentElement = gradeElement.querySelector('.grade-percent');
        const letterElement = gradeElement.querySelector('.grade-letter');
        if (!percentElement) return;

        // extract current percentage (remove % symbol if present)
        const currentPercent = parseFloat(percentElement.textContent.replace('%', ''));
        if (isNaN(currentPercent)) return;

        let newPercent = currentPercent;

        // handle grades above 90%
        if (currentPercent > 90) {
            const firstDigit = Math.floor(currentPercent / 10);
            const secondDigit = currentPercent % 10;
            newPercent = currentPercent - (firstDigit + secondDigit / 10);
        }
        // handle grades below 72%
        else if (currentPercent < 72) {
            newPercent = currentPercent + 3;
        }

        // ensure grade never exceeds 100%
        newPercent = Math.min(100, newPercent).toFixed(1);
        percentElement.textContent = newPercent + '%';

        // update letter grade if element exists
        if (letterElement) {
            letterElement.textContent = getLetterGrade(parseFloat(newPercent));
        }
    }

    // Function to process all grade elements
    function processGrades() {
        const gradeElements = document.querySelectorAll('div.grade');
        gradeElements.forEach(modifyGrade);
    }

    // Create MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                processGrades();
            }
        });
    });

    // Initial processing
    processGrades();

    // Start observing document for dynamic changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();