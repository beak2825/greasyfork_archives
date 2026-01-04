// ==UserScript==
// @name         AMA Jimin 
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Auto vote 25x for Jimin on AMA
// @author       JBT
// @license      JBT
// @match        https://ama.votenow.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534378/AMA%20Jimin.user.js
// @updateURL https://update.greasyfork.org/scripts/534378/AMA%20Jimin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const jiminURL = 'https://ama.votenow.tv/favorite-k-pop-artist/jimin';

    if (window.location.href === 'https://ama.votenow.tv/' || window.location.pathname === '/') {
        setTimeout(() => {
            window.location.href = jiminURL;
        }, 10000);
        return;
    }

    if (window.location.href.startsWith(jiminURL)) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const tryPlus = () => {
                    const plusBtn = document.querySelector('button[aria-label="Increase Votes"]');
                    if (!plusBtn) return setTimeout(tryPlus, 500);

                    let count = 0;
                    const plusInterval = setInterval(() => {
                        const btn = document.querySelector('button[aria-label="Increase Votes"]');
                        if (btn) btn.click();
                        count++;
                        if (count >= 25) {
                            clearInterval(plusInterval);
                            waitAndClickVote();
                        }
                    }, 120);
                };

                const waitAndClickVote = () => {
                    const voteInterval = setInterval(() => {
                        const voteBtn = document.querySelector('button.Vote_submit-button');
                        if (voteBtn && !voteBtn.disabled) {
                            voteBtn.click();
                            clearInterval(voteInterval);
                        }
                    }, 500);
                };

                tryPlus();
            }, 5000);
        });
    }
})();
