// ==UserScript==
// @name         自动完成 Muilti Options
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动完成 Muilti Option
// @author       You
// @license      MIT
// @match        https://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/464370/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20Muilti%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/464370/%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%20Muilti%20Options.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    const QUIZ_START_BUTTON = document.querySelector('#rqStartQuiz');

    const clickChoiceButton = () => {
        for(const button of document.querySelectorAll('.rq_button')) {
            const input = button.querySelector('input');
            if (input) input.click();
        }
    }

    setTimeout(() => {
        if (QUIZ_START_BUTTON) {
            QUIZ_START_BUTTON.click();
        }

        setTimeout(() => {
            if (Array.from(document.querySelectorAll('.rq_button')).length >= 4) {
                clickChoiceButton();
            }
        }, 3000);
    }, 1000);
})();