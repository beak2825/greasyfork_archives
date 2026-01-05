// ==UserScript==
// @name         Show Quora upvotes
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Shows previously hidden upvotes in a Quora feed
// @author       ncg
// @match        https://www.quora.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29926/Show%20Quora%20upvotes.user.js
// @updateURL https://update.greasyfork.org/scripts/29926/Show%20Quora%20upvotes.meta.js
// ==/UserScript==

const hiddenElementClass = 'hide_in_feed',
      hiddenElementSelector = `.${hiddenElementClass}`;
const feedSelector = '.paged_list_wrapper';
const upvoteButtonSelector = '.Upvote.Button';

function showUpvotesInAnswer(answerElement) {
    let hiddenElement;

    if (!(hiddenElement = answerElement.querySelector(hiddenElementSelector))) {
        return;
    }

    hiddenElement.classList.remove(hiddenElementClass);
}

const feed = document.querySelector(feedSelector);

const mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(element => {
            showUpvotesInAnswer(element);
        });
    });
});

mutationObserver.observe(feed, { childList: true });

// Show upvotes for first answers in feed

for (const upvoteButton of document.querySelectorAll(upvoteButtonSelector)) {
    showUpvotesInAnswer(upvoteButton);
}

