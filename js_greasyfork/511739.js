// ==UserScript==
// @name         Auto Refill Canvas Quizzes
// @namespace    http://tampermonkey.net/
// @version      v1.0.0
// @description  Auto refill quizzes in canvas
// @author       AdoreJc
// @match        https://*.instructure.com/courses/*/quizzes/*/take
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instructure.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511739/Auto%20Refill%20Canvas%20Quizzes.user.js
// @updateURL https://update.greasyfork.org/scripts/511739/Auto%20Refill%20Canvas%20Quizzes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function fetchHighestScoreAttemptLink() {
        try {
            console.log("Getting attempts from " + window.location.pathname.replace('/take','/submission_versions'));
            let response = await fetch(window.location.pathname.replace('/take','/submission_versions'), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch quiz attempt data');
            }
            let text = await response.text();
            //console.log(text);
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');

            let attempts = doc.querySelectorAll('table.ic-Table tbody tr');
            if(!attempts){
                throw new Error('No attempts found');
            }
            console.log("Attempts: " + attempts);
            let maxScore = -1;
            let highestAttemptLink = '';

            attempts.forEach((attempt) => {
                let scoreText = attempt.querySelector('td:nth-child(3)').innerText.trim();
                let score = parseInt(scoreText.split(' ')[0]);
                console.log("Score: " + score);
                if (score > maxScore) {
                    maxScore = score;
                    let link = attempt.querySelector('a').getAttribute('href');
                    highestAttemptLink = link;
                }
            });

            if (highestAttemptLink) {
                console.log(`Found highest score attempt link: ${highestAttemptLink}`);
                return highestAttemptLink;
            } else {
                throw new Error('No attempt link found');
            }

        } catch (error) {
            console.error('Error fetching highest score attempt link:', error);
            return null;
        }
    }

    async function fetchPreviousQuizAnswers(attemptLink) {
        try {
            let response = await fetch(attemptLink, {
                method: 'Get',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch previous quiz data');
            }

            let text = await response.text();
            let parser = new DOMParser();
            let doc = parser.parseFromString(text, 'text/html');

            let answers = {};
            let questions = doc.querySelectorAll('.question_holder');
            questions.forEach((question) => {
                let questionId = question.querySelector('.question').id;
                let selectedAnswer = question.querySelector('input[type="radio"][checked]');
                if (selectedAnswer) {
                    let answerId = selectedAnswer.id.replace('-', '_');
                    let isIncorrect = question.querySelector('.answer_arrow.incorrect');
                    answers[questionId] = { answerId, isIncorrect};
                }
            });

            console.log('Fetched answers:', answers);
            return answers;

        } catch (error) {
            console.error('Error fetching quiz answers:', error);
            return {};
        }
    }

    async function fillQuizWithAnswers() {
        let attemptLink = await fetchHighestScoreAttemptLink();
        if (!attemptLink) return;

        let answers = await fetchPreviousQuizAnswers(attemptLink);

        Object.keys(answers).forEach((questionId) => {
            let correctAnswerId = answers[questionId].answerId;
            console.log(`Processing question: ${questionId} with correct answer ID: ${correctAnswerId}`);

            let questionNode = document.getElementById(questionId);
            if (questionNode) {
                console.log(`Found question node for ${questionId}`);

                let correctAnswerInput = questionNode.querySelector(`#${questionId}_${correctAnswerId}`); // question_123_answer_456
                if (correctAnswerInput) {
                    if (answers[questionId].isIncorrect) {
                        correctAnswerInput.checked = true;
                        // console.log(`Marked correct answer with checked for ${questionId}_${correctAnswerId}`);
                    } else {
                        correctAnswerInput.click();
                    // console.log(`Selected correct answer ${questionId}_${correctAnswerId}`);
                    }
                } else {
                    console.log(`Correct answer input not found ${questionId}_${correctAnswerId}`);
                }
            } else {
                console.log(`Question node not found for ${questionId}`);
            }
        });
    }

    window.addEventListener('load', fillQuizWithAnswers);

})();
