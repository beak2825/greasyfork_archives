// ==UserScript==
// @name         AMA Jimin (50x) 
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Vote Jimin 50x 
// @license      JBT
// @match        https://ama.votenow.tv/favorite-k-pop-artist/jimin
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534375/AMA%20Jimin%20%2850x%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534375/AMA%20Jimin%20%2850x%29.meta.js
// ==/UserScript==

(function () {
    window.addEventListener('load', () => {
        const tryPlus = () => {
            const plusBtn = document.querySelector('button[aria-label="Increase Votes"]');
            if (!plusBtn) return setTimeout(tryPlus, 500);
            let count = 0;
            const plusInterval = setInterval(() => {
                plusBtn.click();
                count++;
                if (count >= 50) {
                    clearInterval(plusInterval);
                    waitAndClickVote();
                }
            }, 300); // slower delay between clicks (300ms)
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
    });
})();
