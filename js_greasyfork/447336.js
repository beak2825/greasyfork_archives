/* jshint esversion: 6 */

// ==UserScript==
// @name         IDF lomdot solver.
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Shows you the correct answers for the lomdot.
// @author       You
// @match        https://www.prat.idf.il/lomdot/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=co.il
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447336/IDF%20lomdot%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/447336/IDF%20lomdot%20solver.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

(function() {
    'use strict';

    console.log('[*] Waiting for questions.')
    waitForElm('.questionList').then((questionList) => {
        console.log('[*] Loaded questions.');
        for (const answerWrapper of questionList.getElementsByClassName('labelWrapper') ) {
            const answer = answerWrapper.children[0];
            const answerInput = answer.querySelector('[data-is-correct]');
            const answerText = answer.querySelector('.rateText');

            if(answerInput.getAttribute('data-is-correct') === 'True') {
                console.log(`[*] Found correct answer: ${answerText.textContent}`);
                answerText.style.color = 'green';
                //  answerInput.click();  // Disabled clicking on the correct answer, enable it with caution!
                answerText.textContent += ': התשובה הנכונה';
            } else {
                answerText.style.color = 'red';
            }
        }
    });
})();