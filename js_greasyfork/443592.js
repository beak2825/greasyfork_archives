// ==UserScript==
// @name         Disable Enter on Wrong Answer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Blocks proceeding with the enter key when getting an answer wrong.
// @author       panda-byte
// @license      MIT
// @match        https://www.kaniwani.com/*
// @icon         https://www.google.com/s2/favicons?domain=kaniwani.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443592/Disable%20Enter%20on%20Wrong%20Answer.user.js
// @updateURL https://update.greasyfork.org/scripts/443592/Disable%20Enter%20on%20Wrong%20Answer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // set cooldown time in ms for blocking enter on wrong answer
    const cooldownTime = 1000;

    let inReviewSession = false;
    let box = null;
    let answerIncorrect = false;
    let cooldown = false;
    const red = 'rgb(226, 50, 91)';

    window.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            submitAnswer();

            console.log

            if (answerIncorrect && cooldown) {
                event.stopPropagation();
            }
        }
    }, true);



    const submitAnswer = () => {
        if (!(inReviewSession && box !== null)) {
            answerIncorrect = false;
            return;
        }

        // check with small delay
        setTimeout(() => {
            const isIncorrect
            = window.getComputedStyle(box).backgroundColor === red;

            // start cooldown if it changed to incorrect
            if (isIncorrect && !answerIncorrect) {
                cooldown = true;
                setTimeout(() => {
                    cooldown = false;
                }, cooldownTime);
            }

            answerIncorrect = isIncorrect;
        }, 10);
    };

    //  update state of answer inbetween
    // accounts for ignoring wrong answers etc. to reset state
    // regardless
    setInterval(() => {
        if (!(inReviewSession && box !== null)) {
            answerIncorrect = false;
            return;
        }

        answerIncorrect = window.getComputedStyle(box).backgroundColor === red;
    }, 200);

    // check if user entered review session
    setInterval(() => {
        const hasSessionStarted = document.URL.endsWith('/reviews/session');

        if (hasSessionStarted === inReviewSession) return;

        if (hasSessionStarted) {
            // try to find answer element
            const findAnswerElementInterval = setInterval(() => {
                const answer = document.getElementById('answer');

                if (answer === null) return;

                clearInterval(findAnswerElementInterval);
                box = answer.parentElement;
            }, 100);

            const findSubmitButton = setInterval(() => {
                const submitButton = document.querySelector('button[aria-label="Submit answer"]');

                if (submitButton === null) return;

                clearInterval(findSubmitButton);
                submitButton.addEventListener('click', () => {
                    submitAnswer();
                }, true);
            }, 100);
        } else {
            box = null;
        }

        inReviewSession = hasSessionStarted;
    }, 200);
})();
