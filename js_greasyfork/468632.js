// ==UserScript==
// @name            ZEIT Akademie Quiz Solver
// @author          Tosox
// @namespace       https://github.com/Tosox/ZEIT-Akademie-Quiz-Solver
// @homepage        https://github.com/Tosox/ZEIT-Akademie-Quiz-Solver
// @supportURL      https://github.com/Tosox/ZEIT-Akademie-Quiz-Solver/issues
// @icon            https://github.com/Tosox/ZEIT-Akademie-Quiz-Solver/blob/master/assets/icon.png?raw=true
// @description     Shows the solutions to the current quiz questions
// @version         1.0.3
// @license         MIT
// @copyright       Copyright (c) 2025 Tosox
// @match           https://www.zeitakademie.de/*
// @grant           GM_registerMenuCommand
// @grant           GM_notification
// @grant           unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/468632/ZEIT%20Akademie%20Quiz%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/468632/ZEIT%20Akademie%20Quiz%20Solver.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function getCurrentSolution() {
        const oQuiz = unsafeWindow.oQuiz;
        if (!oQuiz) {
            return null;
        }

        const currentIndex = oQuiz.quizSession.activeQuestionIndex;
        if (!oQuiz.quizValues.questions[currentIndex]) {
            return null;
        }

        const answers = oQuiz.quizValues.questions[currentIndex].answers;
        return answers.find(a => a.correctAnswer);
    }

    GM_registerMenuCommand("Show Solution (S)", function() {
        const solution = getCurrentSolution()
        if (!solution) {
            GM_notification({
                text: "There is no active quiz at the moment",
                timeout: 3000
            });
            return;
        }

        GM_notification({
            text: `Answer ${Number(solution.id) + 1}: ${solution.answer}`,
            timeout: 3000
        });
    }, 's');

    GM_registerMenuCommand("Solve Quiz (Q)", function() {
        const solution = getCurrentSolution();
        if (!solution) {
            GM_notification({
                text: "There is no active quiz at the moment",
                timeout: 3000
            });
            return;
        }

        function clickAnswers() {
            setTimeout(function() {
                const solution = getCurrentSolution();
                if (!solution) {
                    return;
                }

                const btnAnswer = document.getElementById(`button${solution.id}`);
                if (btnAnswer) {
                    btnAnswer.click();
                }

                const btnNext = document.getElementById("buttonNextCard");
                if (btnNext) {
                    btnNext.click();
                    clickAnswers();
                }
            }, 1500);
        }

        clickAnswers();
    }, 'q');
})()
