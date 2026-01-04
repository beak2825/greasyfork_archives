// ==UserScript==
// @name         Math Space Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically reads Mathspace questions, answers them, and provides explanations.
// @author       PrimeMinisteModiji1111111111
// @match        *://*.mathspace.co/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546470/Math%20Space%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/546470/Math%20Space%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to get question text
    function getQuestionText() {
        // Mathspace presents questions in various formats.
        // Try to grab the main question text.
        let question = document.querySelector('.question-text, .ms-question-text, .ms-question__content');
        return question ? question.innerText.trim() : null;
    }

    // Very basic math parsing: supports simple arithmetic only
    function solveQuestion(question) {
        // Remove any unnecessary characters
        question = question.replace(/[^\d\+\-\*\/\(\)\.\^ ]/g, '');
        let answer = null, explanation = '';

        try {
            // Replace "^" with "**" for exponentiation
            question = question.replace(/\^/g, '**');
            // Evaluate the math expression
            answer = eval(question);

            explanation = `To solve: ${question.replace(/\*\*/g, '^')}\n` +
                `We simply evaluate the expression step by step.\n` +
                `The answer is ${answer}.`;
        } catch (e) {
            explanation = "Sorry, couldn't parse or solve this question automatically.";
        }

        return { answer, explanation };
    }

    // Function to input the answer into Mathspace
    function inputAnswer(answer) {
        // Mathspace input fields may vary. Try common selectors.
        let input = document.querySelector('input.ms-input, input[type="text"], .ms-step-input input');
        if (input && answer !== null) {
            input.value = answer;
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    // Function to show explanation on page
    function showExplanation(explanation) {
        let expDiv = document.getElementById('mathspace-helper-explanation');
        if (!expDiv) {
            expDiv = document.createElement('div');
            expDiv.id = 'mathspace-helper-explanation';
            expDiv.style.position = 'fixed';
            expDiv.style.bottom = '10px';
            expDiv.style.right = '10px';
            expDiv.style.background = '#f8f9fa';
            expDiv.style.border = '2px solid #007bff';
            expDiv.style.padding = '12px';
            expDiv.style.zIndex = '9999';
            expDiv.style.maxWidth = '350px';
            expDiv.style.fontFamily = 'monospace';
            document.body.appendChild(expDiv);
        }
        expDiv.innerText = explanation;
    }

    // Main function to run every few seconds
    function main() {
        let question = getQuestionText();
        if (question) {
            let { answer, explanation } = solveQuestion(question);
            if (answer !== null) {
                inputAnswer(answer);
            }
            showExplanation(explanation);
        }
    }

    // Run main every 3 seconds
    setInterval(main, 3000);

    // Initial run in case content is already loaded
    main();
})();