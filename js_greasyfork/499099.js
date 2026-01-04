// ==UserScript==
// @name         Test Select Answers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Select answers from a given list of questions and answers automatically!
// @author       AnonAnom
// @match        https://founders.edtell.com/samigo-app/jsf/delivery/deliverAssessment.faces
// @match        https://founders.edtell.com/samigo-app/jsf/delivery/beginTakingAssessment.faces
// @icon         https://founders.edtell.com/favicon.ico
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_download
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/499099/Test%20Select%20Answers.user.js
// @updateURL https://update.greasyfork.org/scripts/499099/Test%20Select%20Answers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectOption = function(selector, value) {
        const selectOpts = document.querySelector(selector);
        if (selectOpts?.matches('select')) {
            selectOpts.value = value;
            selectOpts.dispatchEvent(new Event('change'));
        }
    };

    const clickNextButton = function() {
        const nextButton = document.getElementById('takeAssessmentForm:next');
        if (nextButton) {
            nextButton.click();
        } else {
            console.log('Next button not found.');
        }
    };

    const waitForLoad = function() {
        if (document.readyState === 'complete') {
            let answers = localStorage.getItem('answers');
            if (!answers) {
                answers = prompt('Please enter the list of answers separated by commas and question numbers separated by colons:');
                localStorage.setItem('answers', answers);
            }
            answers = answers.split(',');
            let i = 0;

            window.addEventListener('load', function() {
                selectOption('span.samigo-answer-label.strong', answers[i].split(':')[1]);
                clickNextButton();
            });

            setTimeout(function() {
                var options = document.querySelectorAll('span.samigo-answer-label.strong');
                options.forEach(function(option) {
                    if (option.textContent.trim() === answers[i].split(':')[1] + '.') {
                        option.click();
                    }
                });
                i++;
                setTimeout(function() {
                    clickNextButton();
                    answers.shift();
                    localStorage.setItem('answers', answers.join(','));
                    if (answers.length === 0) {
                        localStorage.removeItem('answers');
                    }
                }, 500);
            }, 400);
        } else {
            setTimeout(waitForLoad, 100);
        }
    };

    waitForLoad();
})();