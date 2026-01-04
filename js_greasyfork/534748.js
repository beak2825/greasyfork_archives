// ==UserScript==
// @name         Stealth Canvas Answer Highlighter V7.0
// @namespace    http://tampermonkey.net/
// @version      7.0
// @description  Silently highlights correct Canvas quiz answers on hover with improved OCR accuracy and dynamic content handling.
// @author       Blake
// @match        *://*.instructure.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534748/Stealth%20Canvas%20Answer%20Highlighter%20V70.user.js
// @updateURL https://update.greasyfork.org/scripts/534748/Stealth%20Canvas%20Answer%20Highlighter%20V70.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * The most reliable version of Stealth Canvas Answer Highlighter.
     * Improvements include better OCR accuracy, dynamic content handling, and more robust matching logic.
     */

    // OCR setup
    const OCR_ENGINE = Tesseract.create({
        langPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@2.0.0/dist/tesseract.min.js',
        workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@2.0.0/dist/worker.min.js'
    });

    // Helper function to handle OCR extraction
    async function extractAnswersFromOCR() {
        try {
            // OCR extraction logic: Extract text from the quiz page image (if needed)
            const images = document.querySelectorAll('img'); // Grab all images (including background images if any)
            let textResults = [];

            for (let img of images) {
                if (img.complete && img.naturalHeight > 0) {
                    const result = await OCR_ENGINE.recognize(img);
                    textResults.push(result.text.trim());
                }
            }

            return textResults;
        } catch (error) {
            console.error('OCR extraction failed:', error);
            return [];
        }
    }

    // Helper function to get answers using the API (if possible)
    async function getAnswersFromAPI() {
        try {
            const response = await fetch('https://api.clevergoose.ai/canvas/answers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    html: document.documentElement.outerHTML,
                    url: window.location.href
                })
            });

            if (!response.ok) return [];

            const data = await response.json();
            return data.answers || [];
        } catch (error) {
            console.error('API request failed:', error);
            return [];
        }
    }

    // Normalize text for comparison
    function normalize(text) {
        return text.trim().toLowerCase().replace(/\s+/g, '');
    }

    // Match the correct answers to the DOM elements
    function matchAnswersToElements(correctAnswers) {
        const answerElements = document.querySelectorAll('label, div, span, input');
        const matchedElements = [];

        correctAnswers.forEach(answer => {
            const normalizedCorrect = normalize(answer);
            answerElements.forEach(el => {
                if (el.innerText && normalize(el.innerText).includes(normalizedCorrect)) {
                    matchedElements.push(el);
                }
            });
        });

        return matchedElements;
    }

    // Apply styles for stealth highlighting
    function applyStealthHighlight(elements) {
        elements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.outline = '2px solid black';
                el.style.fontWeight = 'bold';
                el.style.textDecoration = 'underline';
            });
            el.addEventListener('mouseleave', () => {
                el.style.outline = '';
                el.style.fontWeight = '';
                el.style.textDecoration = '';
            });
        });
    }

    // Wait for content to load dynamically before applying highlighting
    async function waitForContentToLoad() {
        // Wait up to 5 seconds for the content to load properly before proceeding with highlighting
        const maxWaitTime = 5000;
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            const contentLoaded = document.querySelectorAll('label, div, span').length > 0;
            if (contentLoaded) {
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, 200)); // Check every 200ms
        }
        return false;
    }

    // Core function to initialize stealth highlight
    async function initStealthHighlight() {
        const answersFromAPI = await getAnswersFromAPI();
        const answersFromOCR = await extractAnswersFromOCR();

        // Combine answers from both API and OCR
        const combinedAnswers = [...new Set([...answersFromAPI, ...answersFromOCR])];

        if (!combinedAnswers.length) {
            console.log('No answers detected.');
            return;
        }

        const matchedElements = matchAnswersToElements(combinedAnswers);
        applyStealthHighlight(matchedElements);
    }

    // Trigger after page load with a slight delay for Canvas DOM to be ready
    window.addEventListener('load', async () => {
        const contentLoaded = await waitForContentToLoad();
        if (contentLoaded) {
            setTimeout(initStealthHighlight, 1000); // Delay the function execution for 1 second to ensure DOM is stable
        } else {
            console.error('Timed out waiting for content to load.');
        }
    });
})();
