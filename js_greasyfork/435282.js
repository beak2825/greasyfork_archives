// ==UserScript==
// @name         AO3: Go to Comments
// @namespace    https://greasyfork.org/en/users/163551-vannius
// @version      1.3
// @license      MIT
// @description  When clicking Comments button, jump to Comments section automatically.
// @author       Vannius 
// @match        https://archiveofourown.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435282/AO3%3A%20Go%20to%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/435282/AO3%3A%20Go%20to%20Comments.meta.js
// ==/UserScript==

(function () {
    if (/archiveofourown\.org\/(collections\/[^/]+\/)?works\/[0-9]+/.test(window.location.href)) {
        // Get Comments/Hide Comments tags
        const commentTagTop = document.getElementById('show_comments_link_top');
        const commentTagBottom = document.getElementById('show_comments_link');
        // If there is no comment, commentTagBottom is undefined.
        // And there is no need to add go to comments feature.
        if (!commentTagBottom) return;

        const mutationObserver = new MutationObserver(mutations => {
            const commentFlag = mutations
                .map(x => x.addedNodes.length)
                .reduce((p, x) => p + x);

            if (commentFlag) {
                const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));

                (async () => {
                    await sleep(1000);
                    window.location.href = "#comments_placeholder";
                })();
            }
            mutationObserver.disconnect();
        });

        // Add click event to go to #comments_placeholder
        const target = document.getElementById('comments_placeholder');
        const options = { childList: true };
        for (let commentTag of [commentTagTop, commentTagBottom]) {
            commentTag.addEventListener('click', () => {
                mutationObserver.observe(target, options);
            });
        }
    }
})();
