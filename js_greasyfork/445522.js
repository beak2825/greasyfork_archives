// ==UserScript==
// @name         Learning Bot for "Microsoft build cloud skills challenge"
// @namespace    https://www.microsoft.com/cloudskillschallenge/build/registration/2022
// @version      0.1
// @description  Automatically complete each learning module for "Microsoft build cloud skills challenge"
// @author       You
// @match        https://docs.microsoft.com/*/learn/modules/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445522/Learning%20Bot%20for%20%22Microsoft%20build%20cloud%20skills%20challenge%22.user.js
// @updateURL https://update.greasyfork.org/scripts/445522/Learning%20Bot%20for%20%22Microsoft%20build%20cloud%20skills%20challenge%22.meta.js
// ==/UserScript==
(function() {
    'use strict';

    window.setInterval(() => {
        window.scrollTo(0, document.body.scrollHeight);
        let startBtn = document.querySelectorAll('[data-bi-name="start"]');
        if (startBtn.length) {
            startBtn[0].click();
        }

        let nextBtn = document.querySelectorAll('[data-bi-name="continue"]');
        if (nextBtn.length) {
            nextBtn[0].click();
        }

        let modalNextBtn = document.querySelectorAll('.modal-card [data-bi-name="continue"]');
        if (modalNextBtn.length) {
            modalNextBtn[0].click();
        }

        let questions = document.getElementsByClassName('quiz-question');
        for (let q of questions) {
            q.querySelector('label').click();
        }

        let checkBtn = document.querySelectorAll('[data-bi-name="check-answers"]')
        if (checkBtn.length) {
            checkBtn[0].click()
        }

        let achievementBtn = document.querySelectorAll('[data-bi-name="unlock-achievement"]');
        if (achievementBtn.length) {
            achievementBtn[0].click();
        }

        let completedBtn = document.querySelectorAll('[data-bi-name="learn-completion-continue"]');
        if (completedBtn.length) {
            completedBtn[0].click();
        }

        return
    }, 1000);

})();