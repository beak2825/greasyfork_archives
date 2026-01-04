// ==UserScript==
// @name         Acellus Content Extractor
// @namespace    https://greasyfork.org/users/your-user-id
// @version      1.0
// @description  Extracts content from Acellus questions and stories.
// @author       Your Name
// @match        *://*/  // Change this to match Acellus URLs
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530123/Acellus%20Content%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/530123/Acellus%20Content%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const contentDetector = () => {
        const hasStory = document.querySelector('div[data-scrolling="true"] span.font-palatino');
        const standaloneQuestions = document.querySelectorAll('div[data-scrolling="true"] div[data-grid="true"]');
        const semicolonQuestion = Array.from(standaloneQuestions).find(questionGrid => {
            const questionText = questionGrid.previousElementSibling?.querySelector('span.font-lato')?.innerText.trim();
            return questionText && questionText.includes('semicolon');
        });
        return { hasStory, standaloneQuestions, semicolonQuestion };
    };

    const extractContent = (setStatus, displayResponse, updateExtractedQuestionsArea) => {
        setStatus('Extracting...');
        const { hasStory, standaloneQuestions } = contentDetector();
        let output = '';

        if (hasStory) {
            const storyContent = Array.from(hasStory.parentElement.querySelectorAll('span.font-palatino'))
                .map(span => span.innerText.trim())
                .filter(text => text && !text.startsWith('_'))
                .join('\n\n');

            output += `STORY CONTENT:\n\n${storyContent}\n\n`;
        }

        const seenQuestions = new Set();
        const questions = Array.from(standaloneQuestions).map((questionGrid, index) => {
            const questionText = questionGrid.previousElementSibling?.querySelector('span.font-lato')?.innerText.trim() || `Question ${index + 1}`;

            if (seenQuestions.has(questionText)) return null;
            seenQuestions.add(questionText);

            const answers = Array.from(questionGrid.querySelectorAll('button[data-answer]'))
                .map(button => {
                    const label = button.getAttribute('data-answer').toUpperCase();
                    const answerText = button.querySelector('span.font-lato')?.innerText.trim();
                    return `${label}: ${answerText}`;
                })
                .filter(Boolean);

            return `QUESTION ${seenQuestions.size}:\n${questionText}\nANSWERS:\n${answers.join('\n')}\n`;
        }).filter(Boolean).join('\n');

        extractedContent = output + `${hasStory ? 'STORY' : 'STANDALONE'} QUESTIONS:\n\n${questions}`;
        extractedQuestions = questions; // Store extracted questions
        displayResponse(extractedContent);
        updateExtractedQuestionsArea(); // Update the extracted questions area
        setStatus('Idle');
    };

    // Expose functions globally so they can be imported with `@require`
    window.contentDetector = contentDetector;
    window.extractContent = extractContent;
})();
