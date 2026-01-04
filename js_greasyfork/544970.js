// ==UserScript==
// @name         Education Perfect ESL Answer Automator
// @namespace    http://tampermonkey.net/
// @version      2.1 // Updated textbox selector to target ProseMirror div
// @description  Fills ESL answer questions with specific text, marks 4 stars, and clicks "Got It" ONLY when the manual trigger button is clicked.
// @author       Gemini
// @match        *://*.educationperfect.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544970/Education%20Perfect%20ESL%20Answer%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/544970/Education%20Perfect%20ESL%20Answer%20Automator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration Variables ---
    // Adjust these values if needed
    const MIN_WORD_COUNT = 10; // Minimum words to write (script will ensure this is met)
    const ANSWER_TEXT_CONTENT = "The Sky Tower rises high above the city, its sleek design glinting in the sunlight and serving as a beacon visible for miles in every direction. From its observation deck, visitors can take in a breathtaking 360-degree panorama, spotting landmarks, harbors, and distant mountains in stunning detail. At night, the tower transforms into a glowing pillar of light, with colorful illuminations that shift and change for special occasions and celebrations. Thrill-seekers are drawn to the adrenaline-pumping activities, such as walking along the narrow outer ledge or leaping off in a controlled base jump. Beyond being a tourist attraction, the Sky Tower also serves as a vital communications hub, hosting antennas and transmitting signals across the entire region.";
    const FINAL_PHRASE = "Done."; // Phrase to append at the end
    const DESIRED_STARS = 4; // Number of stars to select (1-5)

    // --- Helper Functions ---

    /**
     * Waits for an element to appear in the DOM.
     * @param {string} selector - The CSS selector of the element to wait for.
     * @param {number} timeout - Maximum time to wait in milliseconds.
     * @returns {Promise<HTMLElement|null>} - A promise that resolves with the element or null if timeout.
     */
    function waitForElement(selector, timeout = 5000) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    console.warn(`[EP Script] Timed out waiting for element: ${selector}`);
                    resolve(null);
                }
            }, 200); // Check every 200ms
        });
    }

    /**
     * Simulates typing into an input field.
     * @param {HTMLInputElement|HTMLTextAreaElement|HTMLElement} element - The input, textarea, or contenteditable element.
     * @param {string} text - The text to type.
     */
    function typeText(element, text) {
        if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
            element.value = text;
        } else if (element.contentEditable === 'true') {
            element.textContent = text; // For contenteditable divs
        } else {
            console.warn("[EP Script] Element is not a recognized input type for typing.", element);
            return;
        }
        // Dispatch input and change events to trigger any React/Vue listeners
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        console.log(`[EP Script] Typed "${text}" into element.`, element);
    }

    /**
     * Clicks an element.
     * @param {HTMLElement} element - The element to click.
     */
    function clickElement(element) {
        if (element) {
            element.click();
            console.log(`[EP Script] Clicked element.`, element);
        }
    }

    // --- Main Automation Logic ---

    // Define answer field selectors globally for consistency
    const answerFieldSelectors = [
        // NEW: Prioritizing selectors based on the provided HTML for the ProseMirror rich editor
        'div.ProseMirror[contenteditable="true"]', // Most specific based on screenshot
        '.rich-editor-container .rich-editor-content[contenteditable="true"]',
        '.long-answer-input .rich-editor-content[contenteditable="true"]',
        'div.rich-editor-content[contenteditable="true"]', // More generic if the above don't work

        // Existing fallbacks (keep these in case other question types use them)
        'input[type="text"][placeholder="Write your answer here"]',
        '.InlineTextBox',
        'div[contenteditable="true"]',
        'textarea[data-testid*="answer-input"]',
        'textarea[name*="answer"]',
        'textarea[id*="answer"]',
        'textarea.answer-input',
        'input[type="text"][data-testid*="answer-input"]',
        'input[type="text"][name*="answer"]',
        'input[type="text"][id*="answer"]',
        'input[type="text"].answer-input',
        '.question-response-area textarea',
        '.question-input textarea'
    ];

    async function automateESLQuestion() {
        console.log("[EP Script] Running ESL automation script...");

        // 1. Find and fill the answer text area/input
        let answerField = null;
        for (const selector of answerFieldSelectors) {
            answerField = await waitForElement(selector, 3000);
            if (answerField) {
                // Ensure the field is empty before typing, to avoid re-typing
                if (answerField.value === '' || answerField.textContent === '') {
                    console.log(`[EP Script] Found empty answer field using selector: ${selector}`);
                    break;
                } else {
                    console.log(`[EP Script] Answer field found but not empty using selector: ${selector}. Skipping typing.`);
                    answerField = null; // Reset to null if not empty, so loop continues or skips
                }
            }
        }

        if (answerField) {
            // Ensure the generated answer meets the minimum word count
            let generatedAnswer = ANSWER_TEXT_CONTENT;
            const currentWords = ANSWER_TEXT_CONTENT.split(' ').length;
            if (currentWords < MIN_WORD_COUNT) {
                const wordsToAdd = MIN_WORD_COUNT - currentWords;
                const fillerText = Array(wordsToAdd).fill("word").join(" ") + " ";
                generatedAnswer += fillerText;
            }
            generatedAnswer += FINAL_PHRASE;

            typeText(answerField, generatedAnswer);
        } else {
            console.log("[EP Script] No empty answer input field found. Skipping text input.");
        }

        // Add a small delay before trying to submit/rate
        await new Promise(resolve => setTimeout(resolve, 500));

        // 2. Find and click the submit/next button (including "Self-Mark Answer")
        const submitButtonSelectors = [
            'button', // Generic button selector, relies on .find() below for text match
            'button[data-testid*="submit"]',
            'button[type="submit"]',
            'button.submit-button',
            'button.next-button',
            'button[aria-label*="submit"]',
            'button[aria-label*="next"]'
        ];

        let submitButton = null;
        for (const selector of submitButtonSelectors) {
            const buttons = Array.from(document.querySelectorAll(selector));
            submitButton = buttons.find(btn =>
                btn.textContent.toLowerCase().includes("submit") ||
                btn.textContent.toLowerCase().includes("next") ||
                btn.textContent.toLowerCase().includes("self-mark answer") ||
                btn.getAttribute('aria-label')?.toLowerCase().includes("submit") ||
                btn.getAttribute('aria-label')?.toLowerCase().includes("next")
            );
            if (submitButton) {
                console.log(`[EP Script] Found submit/next button using selector: ${selector}`);
                break;
            }
        }

        if (submitButton) {
            clickElement(submitButton);
            await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
            console.log("[EP Script] No submit/next button found. Attempting to proceed without explicit submission.");
        }

        // 3. Find and set the star rating
        const starRatingSelectors = [
            'div.self-rating-stars',
            'div[ng-show="self.showStarRating"]',
            '.star-rating-component',
            '.star-rating-input',
            '[data-testid*="star-rating"]',
        ];

        let starContainer = null;
        for (const selector of starRatingSelectors) {
            starContainer = await waitForElement(selector, 2000);
            if (starContainer) {
                console.log(`[EP Script] Found star rating container using selector: ${selector}`);
                break;
            }
        }

        if (starContainer) {
            const stars = starContainer.querySelectorAll('div.star-item, div[ng-click*="onStarClick"]');
            if (stars.length >= DESIRED_STARS) {
                const targetStar = stars[DESIRED_STARS - 1];
                if (targetStar) {
                    clickElement(targetStar);
                    console.log(`[EP Script] Set rating to ${DESIRED_STARS} stars.`);
                } else {
                    console.log(`[EP Script] Could not find the ${DESIRED_STARS}th star element.`);
                }
            } else {
                console.log(`[EP Script] Not enough stars found in the rating component (${stars.length} found, ${DESIRED_STARS} desired).`);
            }
        } else {
            console.log("[EP Script] No star rating component found.");
        }

        console.log("[EP Script] Automation attempt finished.");

        // 4. Find and click the "Got It" or "OK" button
        const gotItButtonSelectors = [
            'button.sidebar[ng-click*="self.action()"]',
            'button',
            'button[aria-label*="got it"]',
            'button[aria-label*="ok"]'
        ];

        let gotItButton = null;
        for (const selector of gotItButtonSelectors) {
            const buttons = Array.from(document.querySelectorAll(selector));
            gotItButton = buttons.find(btn =>
                btn.textContent.toLowerCase().includes("got it") ||
                btn.textContent.toLowerCase().includes("ok") ||
                btn.getAttribute('aria-label')?.toLowerCase().includes("got it") ||
                btn.getAttribute('aria-label')?.toLowerCase().includes("ok")
            );
            if (gotItButton) {
                console.log(`[EP Script] Found "Got It" or "OK" button using selector: ${selector}`);
                break;
            }
        }

        if (gotItButton) {
            clickElement(gotItButton);
            console.log(`[EP Script] Clicked "Got It" button.`);
        } else {
            console.log("[EP Script] No 'Got It' or 'OK' button found. Automation may require manual intervention.");
        }
    }

    // --- Manual Trigger Button ---
    function addAutomateButton() {
        if (document.getElementById('ep-automate-button')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'ep-automate-button';
        button.textContent = 'Automate/Skip Question';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 99999;
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.3s ease;
        `;

        button.onmouseover = () => button.style.backgroundColor = '#45a049';
        button.onmouseout = () => button.style.backgroundColor = '#4CAF50';
        button.onclick = automateESLQuestion;

        document.body.appendChild(button);
        console.log("[EP Script] 'Automate/Skip Question' button added to the page.");
    }

    // Only add the manual button. The automation will only run when this button is clicked.
    setTimeout(addAutomateButton, 1000);

    // Removed the initial automateESLQuestion() call and MutationObserver
    // as per your request to only fill on button click.

})();
