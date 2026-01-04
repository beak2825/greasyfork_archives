// ==UserScript==
// @name         Bitbucket remove non reviewers
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  remove non reviewers
// @license      MIT
// @author       IgnaV
// @match        https://bitbucket.org/rexmas_cl/rexmas/pull-requests/new*
// @icon         http://bitbucket.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441365/Bitbucket%20remove%20non%20reviewers.user.js
// @updateURL https://update.greasyfork.org/scripts/441365/Bitbucket%20remove%20non%20reviewers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const exetuteWithCondition = (condition, callback, time=500, maxTime=10000) => {
        let totalTime = 0;
        const intervalId = setInterval(() => {
            if (condition()) {
                callback();
                clearInterval(intervalId);
            } else {
                totalTime += time;
                if (totalTime >= maxTime) {
                    clearInterval(intervalId);
                }
            }
        }, time);
    }

    const NON_REVIEWERS = [
        // 'Juan Castro',
        // 'Nicolas Fuchs',
        'Christopher Gutierrez',
        'David Salvatierra',
        // 'Jose Miguel Roman',
        'Ignacio Valenzuela',
    ];

    exetuteWithCondition(() => document.querySelector('.css-gu1tlv-multiValue.fabric-user-picker__multi-value'), () => {
        const reviewers = [...document.querySelectorAll('.css-gu1tlv-multiValue.fabric-user-picker__multi-value')].reverse();

        reviewers.forEach((e) => {
            if (NON_REVIEWERS.includes(e.innerText)) {
                e.lastChild.click();
            }
        });

        document.querySelector('input[name="deleteSourceBranch"]').click();
        scroll(0,0);
    });
})();