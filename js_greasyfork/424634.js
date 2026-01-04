// ==UserScript==
// @name        Study.com Quiz Answers
// @namespace   https://greasyfork.org/en/users/668659-denvercoder1
// @match       *://*.study.com/*
// @include     https://study.com/*
// @grant       none
// @version     1.4.0
// @author      Jonah Lawrence
// @description Highlights correct answers with a green background on Study.com quizes and exams
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/424634/Studycom%20Quiz%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/424634/Studycom%20Quiz%20Answers.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
    // add styling for highlighting correct answers
    // quiz answers will at this point already be highlighted since they have this attribute
    const styles = '[data-correct="true"] { background: #c5ff81; box-shadow: 0 0 0 14px #c5ff81; border-radius: 2px; }';
    document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", `<style>${styles}</style>`);
    // get exam container
    const container = document.querySelector("#practice-exam-container");
    // check if the element exists (only on exam pages)
    if (!container) {
        // exit function since this is not an exam
        return;
    }
    const interval = setInterval(function () {
        // if this is an exam, get the Controller
        const controller = angular.element(container).controller();
        // wait for the controller to be loaded
        if (controller) {
            // get the questions list
            const questions = controller.questionByQuestionInstanceId;
            // highlight the correct answer to each question
            Object.values(questions).forEach(function (x) {
                const correctAnswer =
                    document.querySelector(`li[ng-class*="${x.correctQuizQuestionOptionId}"]`) ||
                    document.querySelector(`input[id$="${x.correctQuizQuestionOptionId}"]`).closest("li");
                // check that element for the correct answer exists on the page
                if (correctAnswer) {
                    // mark answer as correct so it can be highlighted
                    correctAnswer.dataset.correct = true;
                    // no need to keep checking
                    clearInterval(interval);
                }
            });
        }
    }, 500);
})();
