// ==UserScript==
// @name         Reddit "Vote" Replacer
// @namespace    https://github.com/GitEin11
// @version      2.0
// @description  Replace the word "Vote" with "circle" in the vote counts
// @author       You
// @match        https://new.reddit.com/*
// @grant        none
// @license MIT 
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/482180/Reddit%20%22Vote%22%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/482180/Reddit%20%22Vote%22%20Replacer.meta.js
// ==/UserScript==

function replaceVote() {
    var voteElements = document.querySelectorAll('[id^="vote-arrows-"] > div:nth-child(2)');
    for (var i = 0; i < voteElements.length; i++) {
        if (voteElements[i].innerHTML == "Vote") {
            voteElements[i].innerHTML = "〇";
        }
    }
}

replaceVote()
//Also rerun the code each time document change (i.e new posts are added when user scroll down)
document.addEventListener("DOMNodeInserted", replaceVote);
