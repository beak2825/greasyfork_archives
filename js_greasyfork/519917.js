// ==UserScript==
// @name         Kahoot Cheat (Beta) (Working Dec 2024)
// @namespace    http://tampermonkey.net/
// @version      0.02.1
// @description  Skibidi Toilet approved, made by floidAI
// @author       You
// @match        https://kahoot.it/*
// @grant        GM.xmlHttpRequest
// @run-at       document-idle
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/519917/Kahoot%20Cheat%20%28Beta%29%20%28Working%20Dec%202024%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519917/Kahoot%20Cheat%20%28Beta%29%20%28Working%20Dec%202024%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const selectors = [
        'answer-0',
        'answer-1',
        'answer-2',
        'answer-3'
    ];
    const questionSelector = '.question-title__Title-sc-12qj0yr-1';
    const imageAnswerSelector = '[data-functional-selector="image-answer"]';

    let quizData = null;
    let currentUrl = location.href;

    const observeUrlChange = () => {
        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                if (currentUrl === 'https://kahoot.it/gameblock') {
                    extractAndSendData();
                }
            }
        }, 500);
    };

    const extractAndSendData = () => {
        try {
            const questionElement = document.querySelector(questionSelector);
            const answerElements = selectors
                .map(selector => document.querySelector(`[data-functional-selector="${selector}"]`))
                .filter(el => el);

            if (!questionElement || answerElements.length === 0) {
                throw new Error('Required elements not found or no answers available.');
            }

            const question = questionElement.innerText.trim();
            const answers = answerElements.map(el => el.innerText.trim());

            if (quizData) {
                processQuestionData(question, answers);
            } else {
                const query = question;
                const apiUrl = `https://create.kahoot.it/rest/kahoots/?query=${encodeURIComponent(query)}&limit=20&orderBy=relevance&cursor=0&searchCluster=1&includeExtendedCounters=false&inventoryItemId=ANY`;

                GM.xmlHttpRequest({
                    method: 'GET',
                    url: apiUrl,
                    onload: function (response) {
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            if (jsonResponse.entities && jsonResponse.entities.length > 0) {
                                const quizId = jsonResponse.entities[0].card.uuid;
                                const quizDetailsUrl = `https://create.kahoot.it/rest/kahoots/${quizId}/card/?includeKahoot=true`;

                                GM.xmlHttpRequest({
                                    method: 'GET',
                                    url: quizDetailsUrl,
                                    onload: function (response) {
                                        try {
                                            quizData = JSON.parse(response.responseText);
                                            processQuestionData(question, answers);
                                        } catch (err) {
                                            console.error('Error parsing quiz details response:', err);
                                        }
                                    },
                                    onerror: function (error) {
                                        console.error('Error fetching quiz details:', error);
                                    }
                                });
                            } else {
                                console.error('No matching quizzes found.');
                            }
                        } catch (err) {
                            console.error('Error parsing API response:', err);
                        }
                    },
                    onerror: function (error) {
                        console.error('Error making API request:', error);
                    }
                });
            }
        } catch (error) {
            console.error('An error occurred in extractAndSendData:', error.message);
        }
    };

    const processQuestionData = (question, answers) => {
        try {
            let matchedQuestion = quizData.kahoot.questions.find(questionInData => {
                if (!questionInData || !questionInData.question || typeof questionInData.question.trim !== 'function') {
                    throw new Error('Invalid question data encountered in quizData.kahoot.questions.');
                }
                return questionInData.question.trim() === question;
            });

            if (!matchedQuestion) {
                console.warn('Exact match failed. Attempting fuzzy matching...');
                matchedQuestion = fuzzyMatchQuestion(question);

                if (!matchedQuestion) {
                    console.error('No match found after fuzzy matching.');
                    throw new Error('Unable to find a matching question.');
                }
            }

            const correctChoice = matchedQuestion.choices.find(choice => choice.correct);

            if (correctChoice) {
                if (correctChoice.image) {
                    highlightCorrectImageAnswer(correctChoice.image.id);
                } else {
                    const correctAnswerText = correctChoice.answer.trim();
                    answers.forEach((answerText, index) => {
                        if (answerText === correctAnswerText) {
                            const answerElement = document.querySelector(`[data-functional-selector="answer-${index}"]`);
                            if (answerElement) {
                                answerElement.innerText = answerText + '.';
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.error('An error occurred while processing question data:', error.message);
        }
    };

    const highlightCorrectImageAnswer = (imageId) => {
        try {
            const imageElements = document.querySelectorAll(imageAnswerSelector);
            imageElements.forEach(imgElement => {
                const ariaLabel = imgElement.getAttribute('aria-label');
                if (ariaLabel && ariaLabel.includes(imageId)) {
                    imgElement.style.border = '5px solid green';
                }
            });
        } catch (error) {
            console.error('An error occurred while highlighting the correct image answer:', error.message);
        }
    };

    const fuzzyMatchQuestion = (inputQuestion) => {
        try {
            const threshold = 0.8; // Similarity threshold
            const similarity = (str1, str2) => {
                const normalize = s => s.toLowerCase().replace(/\s+/g, '');
                str1 = normalize(str1);
                str2 = normalize(str2);
                const length = Math.max(str1.length, str2.length);
                if (!length) return 1;
                const editDistance = levenshtein(str1, str2);
                return 1 - editDistance / length;
            };

            const levenshtein = (a, b) => {
                const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array(b.length + 1).fill(0));
                for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
                for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
                for (let i = 1; i <= a.length; i++) {
                    for (let j = 1; j <= b.length; j++) {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
                        );
                    }
                }
                return matrix[a.length][b.length];
            };

            let bestMatch = null;
            let bestScore = 0;

            quizData.kahoot.questions.forEach(questionInData => {
                const score = similarity(inputQuestion, questionInData.question);
                if (score >= threshold && score > bestScore) {
                    bestMatch = questionInData;
                    bestScore = score;
                }
            });

            return bestMatch;
        } catch (error) {
            console.error('An error occurred during fuzzy matching:', error.message);
            return null;
        }
    };

    observeUrlChange();
})();
