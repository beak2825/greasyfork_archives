// ==UserScript==
// @name         LEGL1000 Terminator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A quiz Autofiller for HKUST LEGL1000 based on question database
// @author       ShiratsuYudachi
// @match        https://canvas.ust.hk/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474356/LEGL1000%20Terminator.user.js
// @updateURL https://update.greasyfork.org/scripts/474356/LEGL1000%20Terminator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function() {
    // Check if we have started autofilling
    let started = localStorage.getItem('started') === 'true';

    // Function to fill in the answers
    let fill = () => {
        // Fetch and execute the JavaScript script
        fetch('https://raw.githubusercontent.com/ShiratsuYudachi/LEGL1000-SB/master/autofill.js')
            .then(response => response.text())
            .then(script => {
                setTimeout(() => {
                    eval(script);
                    setTimeout(goToNextQuestion, 300);
                }, 300);
            });

    };

    // Function to go to the next question
    let goToNextQuestion = () => {
        // Get the list of questions
        let questionList = document.querySelectorAll('#question_list .list_question');
        // Get the current question index
        let questionIndex = parseInt(document.querySelector('.header .question_name').textContent.replace('Question ', '')) - 1;

        if (questionIndex < questionList.length - 1) {
            // Go to the next question
            let nextButton = document.querySelector('button.submit_button.next-question.btn-primary');
            if (nextButton == null) {
                nextButton = document.querySelector('button.submit_button.next-question.btn-secondary');
            }

            nextButton.click();

        } else {
            // We have finished all questions, stop autofilling
            localStorage.setItem('started', 'false');
        }
    };

    // Check if the current page contains a question
    let questionHeader = document.querySelector('.quiz-header');
    if (questionHeader) {
        // Create a button and add it next to the question title
        let button = document.createElement('button');
        button.textContent = 'Start AutoFill';
        questionHeader.parentElement.appendChild(button);

        // When the button is clicked, start the autofill process
        button.addEventListener('click', () => {
            // Start autofilling
            localStorage.setItem('started', 'true');
            location.reload();
        });

        let button2 = document.createElement('button');
        button2.textContent = 'Fill';
        questionHeader.parentElement.appendChild(button2);

        // When the button is clicked, start the autofill process
        button2.addEventListener('click', () => {
            // Start autofilling
            fetch('https://raw.githubusercontent.com/ShiratsuYudachi/LEGL1000-SB/master/autofill.js')
            .then(response => response.text())
            .then(script => {
                setTimeout(() => {
                    eval(script);
                });
            });
        });

        
        let button3 = document.createElement('button');

        button3.textContent = 'Stop now';
        questionHeader.parentElement.appendChild(button3);
        button3.addEventListener('click', () => {
            localStorage.setItem('started', 'false');
        });


        // If we have started autofilling, automatically fill in the answers and go to the next question
        if (started) {
            fill();
        }
    }
    }
})();