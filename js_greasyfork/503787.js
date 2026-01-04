// ==UserScript==
// @name         Letterboxd Ratings Shield
// @namespace    https://letterboxd.com/emreca/
// @version      1.1
// @description  Hide ratings if a movie is not yet watched on Letterboxd
// @author       MostlyEmre
// @license      MIT
// @match        https://letterboxd.com/film/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503787/Letterboxd%20Ratings%20Shield.user.js
// @updateURL https://update.greasyfork.org/scripts/503787/Letterboxd%20Ratings%20Shield.meta.js
// ==/UserScript==
/*!
 * MIT License
 * 
 * Copyright (c) 2024 MostlyEmre
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function() {
    'use strict';

    let isHidden = true; // Default state is hidden

    // Initially hide the ratings section with CSS
    const style = document.createElement('style');
    style.innerHTML = `
        .ratings-histogram-chart {
            display: none;
        }
    `;
    document.head.appendChild(style);

    function updateRatingsVisibility() {
        const ratingsSection = document.querySelector('.ratings-histogram-chart');
        if (ratingsSection) {
            ratingsSection.style.display = isHidden ? 'none' : 'block';
        }
    }

    function checkStatus() {
        const actionsRow = document.querySelector('.actions-row1');
        if (actionsRow) {
            const actionsArray = actionsRow.innerText.toLowerCase().split("\n");

            if (actionsArray[0] === "watched" || actionsArray[0] === "reviewed" || actionsArray[0] === "logged") {
                isHidden = false; // Set state to show ratings
            } else if (actionsArray[0] === "watch") {
                isHidden = true; // Set state to hide ratings
            } else {
                return; // Do nothing if "remove" or other text is detected
            }

            updateRatingsVisibility();
        }
    }

    // Initial check on page load
    checkStatus();

    // Observe the entire document for changes
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                checkStatus(); // Re-check the status on any change
            }
        }
    });

    // Start observing the document
    observer.observe(document.body, { childList: true, subtree: true });

})();
