// ==UserScript==
// @name         Grade Randomizer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  grade good ads gone 😉
// @author       M1noa
// @match        *://campus.ccsd.net/*
// @license MIT 
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508724/Grade%20Randomizer.user.js
// @updateURL https://update.greasyfork.org/scripts/508724/Grade%20Randomizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to generate a random percentage between 71.62 and 100.00
    function getRandomPercent() {
        const min = 71.62;
        const max = 100.00;
        return (Math.random() * (max - min) + min).toFixed(2); // Limit to 2 decimal places
    }

    // Function to determine the letter grade based on the percent
    function getLetterGrade(percent) {
        if (percent >= 90) return 'A';
        if (percent >= 80) return 'B';
        if (percent >= 70) return 'C';
        if (percent >= 60) return 'D';
        return 'F';
    }

    // Function to modify the text within the grading-score divs
    function modifyGrades() {
        const gradeDivs = document.querySelectorAll('.grading-score');

        gradeDivs.forEach(gradeDiv => {
            const percentDiv = gradeDiv.querySelector('.grading-score__row-spacing b');
            const letterDiv = gradeDiv.querySelector('b:first-child');

            if (percentDiv && letterDiv) {
                // Extract the percentage from the text like "(67.08%)"
                const percentMatch = percentDiv.innerText.match(/\((\d+\.?\d*)%\)/);
                if (percentMatch && percentMatch[1]) {
                    const originalPercent = parseFloat(percentMatch[1]);

                    // Generate a new random percentage
                    const newPercent = getRandomPercent();

                    // Get the corresponding letter grade
                    const newLetterGrade = getLetterGrade(newPercent);

                    // Update the div with the new values
                    percentDiv.innerText = `(${newPercent}%)`;
                    letterDiv.innerText = newLetterGrade;
                }
            }
        });
    }

    // Function to remove all divs with the class 'ng-star-inserted'
    function removeNgStarInsertedDivs() {
        const ngStarDivs = document.querySelectorAll('.router-link-reset');
        ngStarDivs.forEach(div => div.remove());
    }

    // Function to clear the page if URL contains 'classroom/grades'
    function clearPageOnSpecificURLs() {
        if (window.location.href.includes('classroom/grades')) {
            document.body.innerHTML = '';
        }
    }

    // Observe changes to the DOM and modify grades accordingly
    const observer = new MutationObserver(() => {
        modifyGrades();
        removeNgStarInsertedDivs();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run to modify grades and clean up on page load
    modifyGrades();
    removeNgStarInsertedDivs();
    clearPageOnSpecificURLs();

    // Listen for URL changes (in case of SPA navigation)
    window.addEventListener('popstate', clearPageOnSpecificURLs);
})();
