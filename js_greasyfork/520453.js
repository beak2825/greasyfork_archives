// ==UserScript==
// @license        GNU GPL
// @name        Quizly Personality Annotation
// @namespace   http://quizly.co/
// @match       https://quizly.co/*/2/
// @grant       none
// @version     1.0
// @description Annotate quiz answers with the personality type they most contribute to.
// @downloadURL https://update.greasyfork.org/scripts/520453/Quizly%20Personality%20Annotation.user.js
// @updateURL https://update.greasyfork.org/scripts/520453/Quizly%20Personality%20Annotation.meta.js
// ==/UserScript==

(function() {
    const maxAttempts = 50;
    let attemptCount = 0;

    function waitForElements() {
        if (attemptCount >= maxAttempts) return;
        const questions = document.querySelectorAll('.wpvq-question');
        if (questions.length === 0) {
            attemptCount++;
            setTimeout(waitForElements, 500);
            return;
        }
        processQuiz(questions);
    }

    function processQuiz(questions) {
        const appreciationIdsSet = new Set();
        questions.forEach(question => {
            question.querySelectorAll('.wpvq-answer').forEach(answer => {
                answer.querySelectorAll('input.wpvq-appreciation').forEach(appreciation => {
                    appreciationIdsSet.add(appreciation.dataset.appreciationid);
                });
            });
        });

        const appreciationIds = Array.from(appreciationIdsSet);
        const personalityMap = {};

        const resultPromises = appreciationIds.map(id =>
            getPersonalityResult(location.href, id, questions).then(personality => {
                personalityMap[id] = personality.replace("You got","Points added to");
            })
        );

        Promise.all(resultPromises).then(() => {
            questions.forEach(question => {
                question.querySelectorAll('.wpvq-answer').forEach(answer => {
                    const answerLabelElement = answer.querySelector('label');
                    if (answerLabelElement) {
                        let bestAppreciationId = null;
                        let highestValue = -1;
                        answer.querySelectorAll('input.wpvq-appreciation').forEach(appreciation => {
                            const value = parseInt(appreciation.value, 10);
                            if (value > highestValue) {
                                highestValue = value;
                                bestAppreciationId = appreciation.dataset.appreciationid;
                            }
                        });
                        if (personalityMap[bestAppreciationId]) {
                            const originalText = answerLabelElement.innerText;
                            answerLabelElement.innerText = `${originalText} (${personalityMap[bestAppreciationId]})`;
                        }
                    }
                });
            });
        });
    }

    function getPersonalityResult(url, appreciationId, questions) {
        return new Promise((resolve, reject) => {
            const answersForAppreciation = Array.from(questions).map(question => {
                let bestAnswer = null;
                let highestValue = -1;
                question.querySelectorAll('.wpvq-answer').forEach(answer => {
                    const appreciation = Array.from(answer.querySelectorAll('input.wpvq-appreciation')).find(a => a.dataset.appreciationid === appreciationId);
                    const value = appreciation ? parseInt(appreciation.value, 10) : 0;
                    if (value > highestValue) {
                        highestValue = value;
                        bestAnswer = answer.querySelector('input').name;
                    }
                });
                return bestAnswer || '';
            });

            const wpvqas = btoa(`wpvqas=${answersForAppreciation.join(',')}&wpvqn=20&wpvqcq=21`);
            fetch('https://quizly.co/wp-admin/admin-ajax.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': navigator.userAgent,
                },
                body: `action=choose_personality&weight=${appreciationId}&wpvqas=${wpvqas}`
            })
            .then(response => response.json())
            .then(data => resolve(data.label))
            .catch(err => reject(err));
        });
    }

    waitForElements();
})();