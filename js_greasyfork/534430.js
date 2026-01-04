// ==UserScript==
// @name         AMA Old Page Vote Jimin
// @namespace    billboard.ama.jimin
// @version      2.2
// @description  Old landing page
// @author       JBT
// @license      JBT
// @match        https://www.billboard.com/amasvote/
// @match        https://ama.votenow.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534430/AMA%20Old%20Page%20Vote%20Jimin.user.js
// @updateURL https://update.greasyfork.org/scripts/534430/AMA%20Old%20Page%20Vote%20Jimin.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const billboardURL = 'https://www.billboard.com/amasvote/';
    const jiminVoteURL = 'https://ama.votenow.tv/favorite-k-pop-artist/jimin';

    if (window.location.href.startsWith(billboardURL)) {
        setTimeout(() => {
            window.location.href = jiminVoteURL;
        }, 10000);
        return;
    }

    if (window.location.href.startsWith(jiminVoteURL)) {
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
