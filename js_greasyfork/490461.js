// ==UserScript==
// @name         Orbio Tests Solver
// @namespace    http://tampermonkey.net/
// @version      2025-12-02
// @description  Orbio World script for testing digital products
// @author       Orbio World
// @match        https://hypnozio.com/test/hypnozio-quiz*
// @match        https://hypnozio.com/quiz/hypnozio-quiz*
// @match        http://hypnozio.localhost/test/*
// @match        http://hypnozio.localhost/quiz/*
// @match        http://get-hypnozio.localhost/test/*
// @match        https://get-hypnozio.localhost/test/*
// @match        https://staging.hypnozio.com/test/*
// @match        https://gethappyo.co/test/*
// @match        http://gethappyo.localhost/test/*
// @match        https://staging.gethappyo.co/test/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490461/Orbio%20Tests%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/490461/Orbio%20Tests%20Solver.meta.js
// ==/UserScript==

(function () {
    'use strict';
    createButtons();
})();



function createButtons() {
    let div = document.createElement('button');
    div.style.cssText = 'position: absolute; right: 10px; top: 10px; z-index: 1000000; width: 200px; height: 24px;';
    div.classList.add('btn-primary');
    div.classList.add('btn');
    div.classList.add('quiz-skip-btn');
    div.innerHTML = 'Skip Test';
    div.setAttribute('onclick', 'skipTest();');
    document.body.appendChild(div);
}

window.skipTest = async function () {
    patchSpinner();
    for (let i = 0; i < 50; i++) {
        let emailInput = document.getElementById("email");
        if (!emailInput) {
            let emailInput = document.querySelector('input[name="email"]');
        }

        if (isVisible(emailInput)) {
            return;
        }

        let imperialInput = document.getElementById("imperial_height_feet");
        if (isVisible(imperialInput)) {
            let feetInput = document.querySelector('input[name="metrics[imperial_height_feet]"]');
            feetInput.value = '5';
            dispatchEvents(feetInput);

            let inchesInput = document.querySelector('input[name="metrics[imperial_height_inches]"]');
            inchesInput.value = '10';
            dispatchEvents(inchesInput);

            let weightInput = document.querySelector('input[name="metrics[imperial_weight]"]');
            weightInput.value = '250';
            dispatchEvents(weightInput);

            let desiredWeightInput = document.querySelector('input[name="metrics[imperial_desired_weight]"]');
            desiredWeightInput.value = '200';
            dispatchEvents(desiredWeightInput);
        }

        let metricInput = document.getElementById("metric_height");
        if(isVisible(metricInput)){
            let heightInput = document.querySelector('input[name="metrics[metric_height]"]');
            heightInput.value = '180';
            dispatchEvents(heightInput);

            let weightInput = document.querySelector('input[name="metrics[metric_weight]"]');
            weightInput.value = '250';
            dispatchEvents(weightInput);

            let desiredWeightInput = document.querySelector('input[name="metrics[metric_desired_weight]"]');
            desiredWeightInput.value = '200';
            dispatchEvents(desiredWeightInput);
        }

        let visibleQuestion = getQuizQuestion();
        let labels = visibleQuestion.querySelectorAll('label');
        if (!labels.length) {
            labels = visibleQuestion.querySelectorAll('[data-quiz-question-answer]');
        }

        let lastQuizQuestionOption = labels[labels.length-1];
        let button = visibleQuestion.querySelector("button:not([role='tab'])");
        if (!button) {
            button = document.querySelector('[x-on\\:click^="deferNextQuestion()"]');
        }

        let happyoPopups = visibleQuestion.querySelector("#modal");

        if (happyoPopups !== null) {
            window.dispatchEvent(new CustomEvent('next'));
            return;
        }

        if (!lastQuizQuestionOption && button) {
            button.dispatchEvent(new Event('click', { bubbles: true }));
        } else if (!button && lastQuizQuestionOption) {
            lastQuizQuestionOption.click();
        } else if (lastQuizQuestionOption && button) {
            lastQuizQuestionOption.click();
            button.dispatchEvent(new Event('click', { bubbles: true }));
        } else {
            return;
        }

        if (window.Alpine && lastQuizQuestionOption) {
            lastQuizQuestionOption.dispatchEvent(new Event('alpine:update', { bubbles: true }));
        }


        await sleep(50);
    }
}

function getQuizQuestion() {
    let questionsWithXShow = document.querySelectorAll('[x-show^="question.type"]');

    if (!questionsWithXShow.length) {
        questionsWithXShow = document.querySelectorAll('[data-quiz-question-element]');
    }

    return Array.from(questionsWithXShow).find(isVisible);
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function dispatchEvents(input) {
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.dispatchEvent(new Event('keyup', { bubbles: true }));
}

function isVisible(el) {
    if (!el) return false;
    const style = getComputedStyle(el);
    return (
        !el.classList.contains('hidden') &&
        style.display !== 'none' &&
        style.visibility !== 'hidden' &&
        style.opacity !== '0' &&
        el.offsetWidth > 0 &&
        el.offsetHeight > 0
    );
}

function patchSpinner() {
    if (window.__spinnerPatched) return;
    window.__spinnerPatched = true;

    const _st = window.setTimeout;
    window.setTimeout = (fn, ms, ...a) => _st(fn, typeof ms === 'number' && ms > 1000 ? 1 : ms, ...a);

    (function hook() {
        const $ = window.jQuery || window.$;
        if ($ && $.fn && $.fn.circleProgress && !$.fn.circleProgress.__forced) {
            const orig = $.fn.circleProgress;
            $.fn.circleProgress = function (opts) {
                opts = opts || {};
                opts.animation = Object.assign({}, opts.animation, { duration: 1 });
                return orig.call(this, opts);
            };
            $.fn.circleProgress.__forced = true;
        } else {
            _st(hook, 50);
        }
    })();
}
