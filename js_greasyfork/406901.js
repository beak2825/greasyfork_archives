// ==UserScript==
// @name         Canvas Lightspeed Grader
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  THE REAL SPEED GRADER BRUH
// @author       You
// @match        https://umd.instructure.com/courses/*/gradebook/speed_grader?assignment_id=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/406901/Canvas%20Lightspeed%20Grader.user.js
// @updateURL https://update.greasyfork.org/scripts/406901/Canvas%20Lightspeed%20Grader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const startButton = document.createElement('button');
    startButton.textContent = 'start lightspeed grader';
    startButton.addEventListener('click', main);
    startButton.style = 'position:fixed;top:10px;left:350px;width:200px';
    document.body.append(startButton);
})();

function main() {
    const contentWindow = window.document.querySelector('#speedgrader_iframe').contentWindow;
    const document = contentWindow.document;
    const questions = document.querySelectorAll('#questions > div');
    const form = document.querySelector('#update_history_form');
    form.onsubmit = () => false;

    const submitButton = document.querySelector('button.update-scores');

    let currentQuestion = 1;

    function gradeNext() {
        currentQuestion += 1;
        setTimeout(gradeQuestion, 0);
    }

    function gradeQuestion() {
        const questionElem = questions[currentQuestion - 1];

        if (!questionElem) {
            // grading done
            submitButton.textContent = 'Grading done! submit?';
            submitButton.scrollIntoView();
            submitButton.style.outline='2px solid green';
            submitButton.focus();
            form.onsubmit = () => true;
        }

        const gradeInputBox = questionElem.querySelector('.question_input');
        const currentScore = parseFloat(gradeInputBox.value);
        if (gradeInputBox.value === '' || Number.isNaN(currentScore)) {
            gradeInputBox.value = '';
            const fullScore = parseFloat(questionElem.querySelector('.question_points').textContent.trim().replace('/', ''));
            console.log(`[Q${currentQuestion}] fullScore = ${fullScore}`);
            // start grading this
            gradeInputBox.style.outline='2px solid green';
            questionElem.style.outline='2px solid red';
            questionElem.scrollIntoView();
            gradeInputBox.focus();
            gradeInputBox.onkeydown = (e) => {
                // e.preventDefault();
                e.stopPropagation();
                if (e.code === 'Enter' && gradeInputBox.value !== '') {
                    gradeInputBox.style.outline='';
                    questionElem.style.outline='';
                    gradeNext();
                    gradeInputBox.onkeydown = undefined;
                }
            };
        } else {
            // already graded
            gradeNext();
        }
    }

    gradeQuestion();
}
